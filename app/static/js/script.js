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
   GRÁFICO 2 — Receita Líquida
   ========================================================= */
async function carregarGrafico2() {
    const dados = await fetchGraficoDados('grafico_receita_liquida');
    const labels  = dados.map(d => d.periodo);
    const valores = dados.map(d => d.total);
    destroyChart(grafico2);

    grafico2 = new Chart(display_grafico2, {
        type: 'line',
        data: { labels, datasets: [buildLineDataset('Receita Líquida', valores, PALETTE.teal)] },
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
   GRÁFICO 3 — Margem Bruta %
   ========================================================= */
async function carregarGrafico3() {
    const dados = await fetchGraficoDados('grafico_margem_bruta_percentual');
    const labels  = dados.map(d => d.periodo);
    const valores = dados.map(d => d.total);
    destroyChart(grafico3);

    grafico3 = new Chart(display_grafico3, {
        type: 'line',
        data: { labels, datasets: [buildLineDataset('Margem Bruta %', valores, PALETTE.purple)] },
        options: {
            ...CHART_DEFAULTS,
            scales: {
                ...CHART_DEFAULTS.scales,
                y: {
                    ...CHART_DEFAULTS.scales.y,
                    ticks: { ...CHART_DEFAULTS.scales.y.ticks, callback: v => v.toFixed(1) + '%' }
                }
            },
            plugins: {
                ...CHART_DEFAULTS.plugins,
                tooltip: { ...CHART_DEFAULTS.plugins.tooltip, callbacks: {
                    label: ctx => ctx.parsed.y.toFixed(2) + '%'
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