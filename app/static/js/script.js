const selectFilial = document.getElementById('filialSelect');
const selectProduto = document.getElementById('produtosSelect');
const selectCategoria = document.getElementById('categoriaSelect');


let bancoEstavaOffline = false;
//KPIS

const display_Receita_Bruta = document.getElementById('valorFaturamento');
const display_Receita_Liquida = document.getElementById('valorReceita_liquida');
const display_Desconto_total = document.getElementById('valorDescontoTotal')
const display_valorCustoTotal = document.getElementById('valorCustoTotal')
const display_valor_margemBruta = document.getElementById('valorMargemBruta')
const display_Margem_percentual = document.getElementById('valorMargem_percentual')
const display_quantidade_Vendida = document.getElementById('valorQuantidadeVendida')
const display_ticket_medio = document.getElementById('valorTicketMedio')

//Graficos
const display_grafico1 = document.getElementById('Grafico1')
const display_grafico2 = document.getElementById('Grafico2')
const display_grafico3 = document.getElementById('Grafico3')
const display_grafico4 = document.getElementById('Grafico4')

//Grafico iniciar
let grafico1 = null;
let grafico2 = null;
let grafico3 = null;
let grafico4 = null;


//botão aplicar
const btn = document.getElementById('btnAplicar');

//filtro Data
const dataInicioInput = document.getElementById('dataInicio');
const dataFimInput = document.getElementById('dataFim');

// ALERTA BANCO

const erroBanco =
    document.getElementById("alerta-banco-fora");

function mostrarErroBanco() {

    erroBanco.style.display = "block";
    bancoEstavaOffline = true;
}

function esconderErroBanco() {

    erroBanco.style.display = "none";

    bancoEstavaOffline = false;
}



/* =========================
   BUSCAR DADOS
========================= */
async function buscarDados() {

    try {

        const filial = selectFilial.value;
        const produto = selectProduto.value;
        const categoria = selectCategoria.value;
        const dataInicio = dataInicioInput.value;
        const dataFim = dataFimInput.value;

        const params = new URLSearchParams();
        
        
        params.append("filial", filial);
        params.append("produto",produto);
        params.append("categoria",categoria)
        params.append("inicio", dataInicio);
        params.append("fim", dataFim);



     
        //Faturamento
        const [res_bruto, res_liquida,res_descontoTotal,res_custoTotal,
            res_margemBruta,res_margemPercentual,res_quantidadeVendida,res_ticketMedio] = await Promise.all([
    fetch(`/faturamento?${params.toString()}`),
    fetch(`/receita_liquida?${params.toString()}`),
    fetch(`/desconto_total?${params.toString()}`),
    fetch(`/custo_total?${params.toString()}`),
    fetch(`/margem_bruta?${params.toString()}`),
    fetch(`/margem_bruta_percentual?${params.toString()}`),
    fetch(`/quantidade_vendida?${params.toString()}`),
    fetch(`/ticket_medio?${params.toString()}`)
    
    
]);
        // SE O BANCO CAIR
        if (!res_bruto.ok || !res_liquida.ok) {

    mostrarErroBanco();

    return;
}
       
        // BANCO OK
        esconderErroBanco();

        const valor_receita_bruta = await res_bruto.json();
        const valor_receita_liquida = await res_liquida.json();
        const valor_desconto_total = await res_descontoTotal.json();
        const valor_custo_total = await res_custoTotal.json();
        const valor_margem_bruta = await res_margemBruta.json();
        const valor_margem_percentual = await res_margemPercentual.json();
        const valor_quantidade_vendida = await res_quantidadeVendida.json();
        const valor_ticket_medio = await res_ticketMedio.json();
        







        



        display_Receita_Bruta.innerText = valor_receita_bruta;
        display_Receita_Liquida.innerText = valor_receita_liquida;
        display_Desconto_total.innerText = valor_desconto_total;
        display_valorCustoTotal.innerText = valor_custo_total;
        display_valor_margemBruta.innerText = valor_margem_bruta;
        display_Margem_percentual.innerText = valor_margem_percentual;
        display_quantidade_Vendida.innerText = valor_quantidade_vendida;
        display_ticket_medio.innerText = valor_ticket_medio;


        await carregarGrafico1();
        await carregarGrafico2();
        await carregarGrafico3();
        await carregarGrafico4();


    } catch (e) {

        console.error("Erro ao buscar dados:", e);
        mostrarErroBanco();

    }
}

/* =========================
   CARREGAR FILIAIS
========================= */
async function carregarFiliais() {

    try {

        const res = await fetch('/filiais');

        const nomes = await res.json();

        selectFilial.innerHTML = '<option value="">Todas as Filiais</option>';

        nomes.forEach(nome => {

            const opt = document.createElement('option');

            opt.value = nome;
            opt.text = nome;

            selectFilial.appendChild(opt);

        });

    } catch (e) {

        console.error("Erro ao carregar filiais:", e);

    }
}
async function carregarProdutos(categoria = "") {

    try {

        const res = await fetch(`/produtos?categoria=${categoria}`);
        if (!res.ok) {

            mostrarErroBanco();

            return;
        }
        esconderErroBanco();

        const nomes = await res.json();

        selectProduto.innerHTML =
            '<option value="">Todos os Produtos</option>';

        nomes.forEach(nome => {

            const opt = document.createElement('option');

            opt.value = nome;
            opt.text = nome;

            selectProduto.appendChild(opt);

        });

    } catch (e) {

        console.error("Erro ao carregar produtos:", e);
        mostrarErroBanco();

    }
}

async function carregarCategorias(produto = "") {

    try {

        const res =
            await fetch(`/categorias?produto=${produto}`);

        if (!res.ok) {

            mostrarErroBanco();

            return;
        }

        esconderErroBanco();

        const nomes = await res.json();

        selectCategoria.innerHTML =
            '<option value="">Todas as Categorias</option>';

        nomes.forEach(nome => {

            const opt = document.createElement('option');

            opt.value = nome;
            opt.text = nome;

            selectCategoria.appendChild(opt);

        });

    } catch (e) {

        console.error("Erro ao carregar categorias:", e);

        mostrarErroBanco();
    }
}

//Graficos
//Grafico 1
async function carregarGrafico1() {

    const filial = selectFilial.value;
    const produto = selectProduto.value;
    const categoria = selectCategoria.value;
    const dataInicio = dataInicioInput.value;
    const dataFim = dataFimInput.value;

    const params = new URLSearchParams();

    params.append("filial", filial);
    params.append("produto", produto);
    params.append("categoria", categoria);
    params.append("inicio", dataInicio);
    params.append("fim", dataFim);

    const resposta =
        await fetch(`/grafico_receita_bruta?${params.toString()}`);

    const dados = await resposta.json();

    console.log(dados);

    const labels = dados.map(item => item.periodo);

    const valores = dados.map(item => item.total);
    if (grafico1) {
    grafico1.destroy();
}

    grafico1 = new Chart(display_grafico1, {

        type: 'line',

        data: {

            labels: labels,

            datasets: [{
                label: 'Receita Bruta',

                data: valores,

                borderWidth: 1
            }]
        },

        options: {

            responsive: true,

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        callback: function(valor) {

                            return valor.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            });
                        }
                    }
                }
            }
        }
    });
}





//Grafico 2 
async function carregarGrafico2() {

    const filial = selectFilial.value;
    const produto = selectProduto.value;
    const categoria = selectCategoria.value;
    const dataInicio = dataInicioInput.value;
    const dataFim = dataFimInput.value;

    const params = new URLSearchParams();

    params.append("filial", filial);
    params.append("produto", produto);
    params.append("categoria", categoria);
    params.append("inicio", dataInicio);
    params.append("fim", dataFim);

    const resposta =
        await fetch(`/grafico_receita_liquida?${params.toString()}`);

    const dados = await resposta.json();

    console.log(dados);

    const labels = dados.map(item => item.periodo);

    const valores = dados.map(item => item.total);
    if (grafico2) {
    grafico2.destroy();
}

    grafico2 = new Chart(display_grafico2, {

        type: 'line',

        data: {

            labels: labels,

            datasets: [{
                label: 'Receita liquida',

                data: valores,

                borderWidth: 1
            }]
        },

        options: {

            responsive: true,

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        callback: function(valor) {

                            return valor.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            });
                        }
                    }
                }
            }
        }
    });
}






//grafico 3 
async function carregarGrafico3() {

    const filial = selectFilial.value;
    const produto = selectProduto.value;
    const categoria = selectCategoria.value;
    const dataInicio = dataInicioInput.value;
    const dataFim = dataFimInput.value;

    const params = new URLSearchParams();

    params.append("filial", filial);
    params.append("produto", produto);
    params.append("categoria", categoria);
    params.append("inicio", dataInicio);
    params.append("fim", dataFim);

    const resposta =
        await fetch(`/grafico_margem_bruta_percentual?${params.toString()}`);

    const dados = await resposta.json();

    console.log(dados);

    const labels = dados.map(item => item.periodo);

    const valores = dados.map(item => item.total);
    if (grafico3) {
    grafico3.destroy();
}

    grafico3 = new Chart(display_grafico3, {

        type: 'line',

        data: {

            labels: labels,

            datasets: [{
                label: 'Margem Bruta Percentual',

                data: valores,

                borderWidth: 1
            }]
        },

        options: {

            responsive: true,

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        callback: function(valor) {

                           return valor.toFixed(1) + '%';
                        }
                    }
                }
            }
        }
    });
}



async function carregarGrafico4() {

    const filial = selectFilial.value;
    const produto = selectProduto.value;
    const categoria = selectCategoria.value;
    const dataInicio = dataInicioInput.value;
    const dataFim = dataFimInput.value;

    const params = new URLSearchParams();

    params.append("filial", filial);
    params.append("produto", produto);
    params.append("categoria", categoria);
    params.append("inicio", dataInicio);
    params.append("fim", dataFim);

    const resposta =
        await fetch(`/grafico_produtos_vendidos?${params.toString()}`);

    const dados = await resposta.json();

    console.log(dados);

    const labels = dados.map(item => item.nome_produto);

    const valores = dados.map(item => item.total);
    if (grafico4) {
    grafico4.destroy();
}

    grafico4 = new Chart(display_grafico4, {

        type: 'bar',

        data: {

            labels: labels,

            datasets: [{
                label: 'Quantidade Vendida',

                data: valores,

                borderWidth: 1
            }]
        },

        options: {

            responsive: true,

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        callback: function(valor) {

                           return valor;
                        }
                    }
                }
            }
        }
    });
}




    

/* =========================
   EVENTO BOTÃO
========================= */
btn.addEventListener('click', buscarDados);

selectCategoria.addEventListener("change", async () => {

    const categoria = selectCategoria.value;

    await carregarProdutos(categoria);

    // se voltou para TODOS
    if (categoria === "") {

        selectProduto.value = "";
    }
});


selectProduto.addEventListener("change", async () => {

    const produto = selectProduto.value;

    await carregarCategorias(produto);

    // se voltou para TODOS
    if (produto === "") {

        selectCategoria.value = "";
    }
});




const btnLimpar = document.getElementById('btnLimpar');

btnLimpar.addEventListener('click', () => {

    window.location.reload();

});










/* =========================
   INICIALIZAÇÃO
========================= */
(async function init() {

    await Promise.all([
        carregarFiliais(),
        carregarProdutos(),
        carregarCategorias()
    ]);

    await buscarDados();

})();