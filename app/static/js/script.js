/* =========================================================
   SELETORES
   ========================================================= */
const selectFilial    = document.getElementById('filialSelect');
const selectProduto   = document.getElementById('produtosSelect');
const selectCategoria = document.getElementById('categoriaSelect');
const dataInicioInput = document.getElementById('dataInicio');
const dataFimInput    = document.getElementById('dataFim');
const btn             = document.getElementById('btnAplicar');
const btnLimpar       = document.getElementById('btnLimpar');
const erroBanco       = document.getElementById('alerta-banco-fora');
const pagePeriod      = document.getElementById('page-period');

// KPIs
const display_Receita_Bruta       = document.getElementById('valorFaturamento');
const display_Receita_Liquida     = document.getElementById('valorReceita_liquida');
const display_Desconto_total      = document.getElementById('valorDescontoTotal');
const display_valorCustoTotal     = document.getElementById('valorCustoTotal');
const display_valor_margemBruta   = document.getElementById('valorMargemBruta');
const display_Margem_percentual   = document.getElementById('valorMargem_percentual');
const display_quantidade_Vendida  = document.getElementById('valorQuantidadeVendida');
const display_ticket_medio        = document.getElementById('valorTicketMedio');

// Gráficos
const display_grafico1 = document.getElementById('Grafico1');
const display_grafico2 = document.getElementById('Grafico2');
const display_grafico3 = document.getElementById('Grafico3');
const display_grafico4 = document.getElementById('Grafico4');

let grafico1 = null, grafico2 = null, grafico3 = null, grafico4 = null;
let bancoEstavaOffline = false;

/* =========================================================
   PALETA DE CORES DOS GRÁFICOS
   ========================================================= */
const PALETTE = {
    blue:   { line: '#2563EB', fill: 'rgba(37,99,235,.08)', point: '#1d4ed8' },
    teal:   { line: '#0D9488', fill: 'rgba(13,148,136,.08)', point: '#0f766e' },
    purple: { line: '#7C3AED', fill: 'rgba(124,58,237,.08)', point: '#6d28d9' },
    amber:  { line: '#D97706', fill: 'rgba(217,119,6,.08)',  point: '#b45309' },
};

const CHART_DEFAULTS = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#0F172A',
            titleColor: '#94A3B8',
            bodyColor: '#F1F5F9',
            padding: 10,
            borderColor: '#1E293B',
            borderWidth: 1,
            cornerRadius: 8,
        }
    },
    scales: {
        x: {
            grid: { color: '#F1F5F9', drawBorder: false },
            ticks: { color: '#94A3B8', font: { family: 'DM Sans', size: 11 }, maxRotation: 30, autoSkip: true },
        },
        y: {
            grid: { color: '#F1F5F9', drawBorder: false },
            ticks: { color: '#94A3B8', font: { family: 'DM Sans', size: 11 } },
            beginAtZero: true,
        }
    },
};

function brlTick(v) {
    if (Math.abs(v) >= 1_000_000) return 'R$' + (v / 1_000_000).toFixed(1) + 'M';
    if (Math.abs(v) >= 1_000)     return 'R$' + (v / 1_000).toFixed(0) + 'K';
    return 'R$' + v.toFixed(0);
}

function buildLineDataset(label, data, palette) {
    return {
        label,
        data,
        borderColor: palette.line,
        backgroundColor: palette.fill,
        pointBackgroundColor: palette.line,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
    };
}

/* =========================================================
   BANCO — ESTADO
   ========================================================= */
function mostrarErroBanco() {
    erroBanco.style.display = 'flex';
    bancoEstavaOffline = true;
}

function esconderErroBanco() {
    erroBanco.style.display = 'none';
    bancoEstavaOffline = false;
}

/* =========================================================
   ATUALIZAR PERÍODO NA HEADER
   ========================================================= */
function atualizarPeriodo() {
    const ini = dataInicioInput.value;
    const fim = dataFimInput.value;
    if (ini && fim) {
        const fmt = d => new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' });
        pagePeriod.textContent = fmt(ini) + ' → ' + fmt(fim);
    } else {
        pagePeriod.textContent = 'Todos os períodos';
    }
}

/* =========================================================
   BUSCAR DADOS
   ========================================================= */
async function buscarDados() {
    try {
        const params = buildParams();

        const [
            res_bruto, res_liquida, res_descontoTotal, res_custoTotal,
            res_margemBruta, res_margemPercentual, res_quantidadeVendida, res_ticketMedio
        ] = await Promise.all([
            fetch(`/faturamento?${params}`),
            fetch(`/receita_liquida?${params}`),
            fetch(`/desconto_total?${params}`),
            fetch(`/custo_total?${params}`),
            fetch(`/margem_bruta?${params}`),
            fetch(`/margem_bruta_percentual?${params}`),
            fetch(`/quantidade_vendida?${params}`),
            fetch(`/ticket_medio?${params}`)
        ]);

        if (!res_bruto.ok || !res_liquida.ok) { mostrarErroBanco(); return; }
        esconderErroBanco();

        display_Receita_Bruta.innerText      = await res_bruto.json();
        display_Receita_Liquida.innerText    = await res_liquida.json();
        display_Desconto_total.innerText     = await res_descontoTotal.json();
        display_valorCustoTotal.innerText    = await res_custoTotal.json();
        display_valor_margemBruta.innerText  = await res_margemBruta.json();
        display_Margem_percentual.innerText  = await res_margemPercentual.json();
        display_quantidade_Vendida.innerText = await res_quantidadeVendida.json();
        display_ticket_medio.innerText       = await res_ticketMedio.json();

        atualizarPeriodo();

        await Promise.all([
            carregarGrafico1(),
            carregarGrafico2(),
            carregarGrafico3(),
            carregarGrafico4(),
            carregarMatriz(),
        ]);

    } catch (e) {
        console.error('Erro ao buscar dados:', e);
        mostrarErroBanco();
    }
}

/* =========================================================
   HELPERS
   ========================================================= */
function buildParams() {
    const p = new URLSearchParams();
    p.append('filial',    selectFilial.value);
    p.append('produto',   selectProduto.value);
    p.append('categoria', selectCategoria.value);
    p.append('inicio',    dataInicioInput.value);
    p.append('fim',       dataFimInput.value);
    return p.toString();
}

async function fetchGraficoDados(endpoint) {
    const res = await fetch(`/${endpoint}?${buildParams()}`);
    return res.json();
}

function destroyChart(ref) { if (ref) ref.destroy(); }

/* =========================================================
   GRÁFICO 1 — Receita Bruta
   ========================================================= */
async function carregarGrafico1() {
    const dados = await fetchGraficoDados('grafico_receita_bruta');
    const labels  = dados.map(d => d.periodo);
    const valores = dados.map(d => d.total);
    destroyChart(grafico1);

    grafico1 = new Chart(display_grafico1, {
        type: 'line',
        data: { labels, datasets: [buildLineDataset('Receita Bruta', valores, PALETTE.blue)] },
        options: {
            ...CHART_DEFAULTS,
            scales: {
                ...CHART_DEFAULTS.scales,
                y: { ...CHART_DEFAULTS.scales.y, ticks: { ...CHART_DEFAULTS.scales.y.ticks, callback: brlTick } }
            },
            plugins: {
                ...CHART_DEFAULTS.plugins,
                tooltip: { ...CHART_DEFAULTS.plugins.tooltip, callbacks: {
                    label: ctx => 'R$ ' + ctx.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                }}
            }
        }
    });
}

/* =========================================================
   GRÁFICO 2 — Receita Líquida por Filial
   ========================================================= */
async function carregarGrafico2() {
    const dados = await fetchGraficoDados('grafico_receitaliquida_por_filial');
    const labels  = dados.map(d => d.nome_filial);
    const valores = dados.map(d => d.total);
    destroyChart(grafico2);

    grafico2 = new Chart(display_grafico2, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Receita Líquida por Filial',
                data: valores,
                backgroundColor: 'rgba(13,148,136,.15)',
                borderColor: PALETTE.teal.line,
                borderWidth: 1.5,
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            ...CHART_DEFAULTS,
            interaction: { mode: 'nearest', axis: 'x', intersect: false },
            scales: {
                ...CHART_DEFAULTS.scales,
                x: { ...CHART_DEFAULTS.scales.x, grid: { display: false } },
                y: { ...CHART_DEFAULTS.scales.y, ticks: { ...CHART_DEFAULTS.scales.y.ticks, callback: brlTick } }
            },
            plugins: {
                ...CHART_DEFAULTS.plugins,
                tooltip: { ...CHART_DEFAULTS.plugins.tooltip, callbacks: {
                    label: ctx => 'R$ ' + ctx.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                }}
            }
        }
    });
}

/* =========================================================
   GRÁFICO 3 — Receita Líquida por Categoria
   ========================================================= */
async function carregarGrafico3() {
    const dados = await fetchGraficoDados('grafico_receitaliquida_por_categoria');
    const labels  = dados.map(d => d.nome_categoria);
    const valores = dados.map(d => d.total);
    destroyChart(grafico3);

    grafico3 = new Chart(display_grafico3, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Receita Líquida por Categoria',
                data: valores,
                backgroundColor: 'rgba(124,58,237,.15)',
                borderColor: PALETTE.purple.line,
                borderWidth: 1.5,
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            ...CHART_DEFAULTS,
            indexAxis: 'y',
            interaction: { mode: 'nearest', axis: 'y', intersect: false },
            scales: {
                x: { ...CHART_DEFAULTS.scales.x, ticks: { ...CHART_DEFAULTS.scales.x.ticks, callback: brlTick } },
                y: { ...CHART_DEFAULTS.scales.y, grid: { display: false } }
            },
            plugins: {
                ...CHART_DEFAULTS.plugins,
                tooltip: { ...CHART_DEFAULTS.plugins.tooltip, callbacks: {
                    label: ctx => 'R$ ' + ctx.parsed.x.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                }}
            }
        }
    });
}


















/* =========================================================
   GRÁFICO 4 — Produtos Mais Vendidos
   ========================================================= */
async function carregarGrafico4() {
    const dados = await fetchGraficoDados('grafico_produtos_vendidos');
    const labels  = dados.map(d => d.nome_produto);
    const valores = dados.map(d => d.total);
    destroyChart(grafico4);

    grafico4 = new Chart(display_grafico4, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Qtd. Vendida',
                data: valores,
                backgroundColor: 'rgba(217,119,6,.15)',
                borderColor: '#D97706',
                borderWidth: 1.5,
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            ...CHART_DEFAULTS,
            indexAxis: 'y',
            interaction: { mode: 'nearest', axis: 'y', intersect: false },
            plugins: {
                ...CHART_DEFAULTS.plugins,
                tooltip: { ...CHART_DEFAULTS.plugins.tooltip, callbacks: {
                    label: ctx => ctx.parsed.x.toLocaleString('pt-BR') + ' un.'
                }}
            },
            scales: {
                x: { ...CHART_DEFAULTS.scales.x, ticks: { ...CHART_DEFAULTS.scales.x.ticks, callback: v => v.toLocaleString('pt-BR') } },
                y: { ...CHART_DEFAULTS.scales.y, grid: { display: false } }
            }
        }
    });
}

/* =========================================================
   CARREGAR SELETORES
   ========================================================= */
async function carregarFiliais() {
    try {
        const nomes = await (await fetch('/filiais')).json();
        selectFilial.innerHTML = '<option value="">Todas as Filiais</option>';
        nomes.forEach(n => { const o = document.createElement('option'); o.value = o.text = n; selectFilial.appendChild(o); });
    } catch (e) { console.error('Erro filiais:', e); }
}

async function carregarProdutos(categoria = '') {
    try {
        const res = await fetch(`/produtos?categoria=${categoria}`);
        if (!res.ok) { mostrarErroBanco(); return; }
        esconderErroBanco();
        const nomes = await res.json();
        selectProduto.innerHTML = '<option value="">Todos os Produtos</option>';
        nomes.forEach(n => { const o = document.createElement('option'); o.value = o.text = n; selectProduto.appendChild(o); });
    } catch (e) { console.error('Erro produtos:', e); mostrarErroBanco(); }
}

async function carregarCategorias(produto = '') {
    try {
        const res = await fetch(`/categorias?produto=${produto}`);
        if (!res.ok) { mostrarErroBanco(); return; }
        esconderErroBanco();
        const nomes = await res.json();
        selectCategoria.innerHTML = '<option value="">Todas as Categorias</option>';
        nomes.forEach(n => { const o = document.createElement('option'); o.value = o.text = n; selectCategoria.appendChild(o); });
    } catch (e) { console.error('Erro categorias:', e); mostrarErroBanco(); }
}

/* =========================================================
   EVENTOS
   ========================================================= */
btn.addEventListener('click', buscarDados);

btnLimpar.addEventListener('click', () => window.location.reload());

selectCategoria.addEventListener('change', async () => {
    await carregarProdutos(selectCategoria.value);
    if (!selectCategoria.value) selectProduto.value = '';
});

selectProduto.addEventListener('change', async () => {
    await carregarCategorias(selectProduto.value);
    if (!selectProduto.value) selectCategoria.value = '';
});

/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */
(async function init() {
    await Promise.all([carregarFiliais(), carregarProdutos(), carregarCategorias()]);
    await buscarDados();
})();

/* =========================================================
   MATRIZ — MARGEM BRUTA POR FILIAL / CATEGORIA / MÊS
   ========================================================= */
const matrizLoading = document.getElementById('matrizLoading');
const matrizVazia   = document.getElementById('matrizVazia');
const matrizTabela  = document.getElementById('matrizTabela');
const matrizHead    = document.getElementById('matrizHead');
const matrizBody    = document.getElementById('matrizBody');
const btnExpandAll  = document.getElementById('btnExpandAll');
const btnCollapseAll = document.getElementById('btnCollapseAll');

// Estado de quais filiais estão expandidas
const filialExpandida = new Set();

/* ── helpers ── */
function margemClass(v) {
    if (v === null || v === undefined || isNaN(v)) return '';
    if (v >= 30) return 'margem-alta';
    if (v >= 15) return 'margem-media';
    return 'margem-baixa';
}

function fmtPct(v) {
    if (v === null || v === undefined || isNaN(v)) return '—';
    return Number(v).toFixed(1) + '%';
}

/* ── renderizar tabela ── */
function renderizarMatriz(dados) {

    matrizHead.innerHTML = '';
    matrizBody.innerHTML = '';

    if (!dados || dados.length === 0) {
        matrizTabela.style.display = 'none';
        matrizVazia.style.display  = 'flex';
        return;
    }

    // Coletar todos os períodos únicos e ordenar
    const periodosSet = new Set();
    dados.forEach(filialObj => {
        filialObj.categorias.forEach(cat => {
            cat.periodos.forEach(p => periodosSet.add(p.periodo));
        });
    });

    // Ordena MM/YYYY cronologicamente
    const periodos = [...periodosSet].sort((a, b) => {
        const [ma, ya] = a.split('/').map(Number);
        const [mb, yb] = b.split('/').map(Number);
        return ya !== yb ? ya - yb : ma - mb;
    });

    // ── Cabeçalho ──
    const headTr = document.createElement('tr');
    headTr.innerHTML = `<th>Filial / Categoria</th>`;
    periodos.forEach(p => {
        const [m, y] = p.split('/');
        const label = new Date(y, m - 1).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        headTr.innerHTML += `<th>${label}</th>`;
    });
    headTr.innerHTML += `<th class="col-total">Total</th>`;
    matrizHead.appendChild(headTr);

    // ── Calcular total geral por período ──
    const totalGeral = {}; // periodo -> { soma, count }
    let totalGeralGlobal = 0;
    let totalGeralCount  = 0;

    dados.forEach(filialObj => {
        filialObj.categorias.forEach(cat => {
            cat.periodos.forEach(p => {
                if (!totalGeral[p.periodo]) totalGeral[p.periodo] = { soma: 0, count: 0 };
                totalGeral[p.periodo].soma  += p.total;
                totalGeral[p.periodo].count += 1;
                totalGeralGlobal += p.total;
            });
        });
    });

    // ── Corpo ──
    dados.forEach(filialObj => {
        const filialKey = filialObj.filial;
        const isOpen    = filialExpandida.has(filialKey);

        // Mapa periodo->soma das categorias da filial
        const filialPorPeriodo = {};
        filialObj.categorias.forEach(cat => {
            cat.periodos.forEach(p => {
                filialPorPeriodo[p.periodo] = (filialPorPeriodo[p.periodo] || 0) + p.total;
            });
        });

        // Total da filial = soma de todas as categorias em todos os períodos
        const filialTotalGlobal = Object.values(filialPorPeriodo).reduce((acc, v) => acc + v, 0);

        // Linha FILIAL
        const trFilial = document.createElement('tr');
        trFilial.className = 'row-filial';
        trFilial.dataset.filial = filialKey;

        let cellsFilial = `
            <td>
                <span class="expand-icon ${isOpen ? 'open' : ''}">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M3 2l4 3-4 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
                ${filialKey}
            </td>`;

        periodos.forEach(p => {
            const soma = filialPorPeriodo[p] !== undefined ? filialPorPeriodo[p] : null;
            cellsFilial += `<td class="${margemClass(soma)}">${fmtPct(soma)}</td>`;
        });

        cellsFilial += `<td class="col-total ${margemClass(filialTotalGlobal)}">${fmtPct(filialTotalGlobal)}</td>`;
        trFilial.innerHTML = cellsFilial;

        // Toggle ao clicar
        trFilial.addEventListener('click', () => {
            if (filialExpandida.has(filialKey)) {
                filialExpandida.delete(filialKey);
            } else {
                filialExpandida.add(filialKey);
            }
            renderizarMatriz(dados);
        });

        matrizBody.appendChild(trFilial);

        // Linhas CATEGORIA (só se expandida)
        if (isOpen) {
            filialObj.categorias.forEach(cat => {
                const trCat = document.createElement('tr');
                trCat.className = 'row-categoria';

                const catTotal = cat.periodos.reduce((acc, p) => acc + p.total, 0);
                const catPorPeriodo = {};
                cat.periodos.forEach(p => { catPorPeriodo[p.periodo] = p.total; });

                let cellsCat = `<td>${cat.categoria}</td>`;
                periodos.forEach(p => {
                    const v = catPorPeriodo[p] !== undefined ? catPorPeriodo[p] : null;
                    cellsCat += `<td class="${margemClass(v)}">${fmtPct(v)}</td>`;
                });
                cellsCat += `<td class="col-total ${margemClass(catTotal)}">${fmtPct(catTotal)}</td>`;

                trCat.innerHTML = cellsCat;
                matrizBody.appendChild(trCat);
            });
        }
    });

    // Linha TOTAL GERAL
    const trTotal = document.createElement('tr');
    trTotal.className = 'row-total';

    let cellsTotal = `<td>Total Geral</td>`;
    periodos.forEach(p => {
        const g = totalGeral[p];
        const soma = g ? g.soma : null;
        cellsTotal += `<td>${fmtPct(soma)}</td>`;
    });
    const somaGeralGlobal = totalGeralGlobal > 0 ? totalGeralGlobal : null;
    cellsTotal += `<td class="col-total">${fmtPct(somaGeralGlobal)}</td>`;

    trTotal.innerHTML = cellsTotal;
    matrizBody.appendChild(trTotal);

    matrizVazia.style.display  = 'none';
    matrizTabela.style.display = 'table';
}

/* ── carregar dados ── */
let dadosMatrizCache = null;

async function carregarMatriz() {
    matrizLoading.style.display = 'flex';
    matrizTabela.style.display  = 'none';
    matrizVazia.style.display   = 'none';

    try {
        const res = await fetch(`/matriz_margem_bruta?${buildParams()}`);
        if (!res.ok) { mostrarErroBanco(); return; }
        dadosMatrizCache = await res.json();
        renderizarMatriz(dadosMatrizCache);
    } catch (e) {
        console.error('Erro ao carregar matriz:', e);
        mostrarErroBanco();
    } finally {
        matrizLoading.style.display = 'none';
    }
}

/* ── botões expandir/recolher ── */
btnExpandAll.addEventListener('click', () => {
    if (!dadosMatrizCache) return;
    dadosMatrizCache.forEach(f => filialExpandida.add(f.filial));
    renderizarMatriz(dadosMatrizCache);
});

btnCollapseAll.addEventListener('click', () => {
    filialExpandida.clear();
    if (dadosMatrizCache) renderizarMatriz(dadosMatrizCache);
});