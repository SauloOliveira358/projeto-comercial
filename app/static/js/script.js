const selectFilial = document.getElementById('filialSelect');
const selectProduto = document.getElementById('produtosSelect');
const selectCategoria = document.getElementById('categoriaSelect');


const display_Receita_Bruta = document.getElementById('valorFaturamento');
const display_Receita_Liquida = document.getElementById('valorReceita_liquida');


const btn = document.getElementById('btnAplicar');

const dataInicioInput = document.getElementById('dataInicio');
const dataFimInput = document.getElementById('dataFim');

// ALERTA BANCO

const erroBanco =
    document.getElementById("alerta-banco-fora");

function mostrarErroBanco() {

    erroBanco.style.display = "block";
}

function esconderErroBanco() {

    erroBanco.style.display = "none";
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
        const [res_bruto, res_liquida] = await Promise.all([
    fetch(`/faturamento?${params.toString()}`),
    fetch(`/receita_liquida?${params.toString()}`)
]);
        // SE O BANCO CAIR
        if (!res_bruto.ok || !res_liquida.ok) {

    window.location.reload();

    return;
}
       
        // BANCO OK
        esconderErroBanco();

        const valor_receita_bruta = await res_bruto.json();
        const valor_receita_liquida = await res_liquida.json();



        display_Receita_Bruta.innerText = valor_receita_bruta;
        display_Receita_Liquida.innerText = valor_receita_liquida;

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

async function carregarCategorias() {

    try{
    const res = await fetch('/categorias');
    const nomes = await res.json();

    selectCategoria.innerHTML = '<option value ="">Todas as Categorias</option>';

    nomes.forEach(nome => {
        const opt = document.createElement('option');

        opt.value = nome;
        opt.text = nome;
        selectCategoria.appendChild(opt);
    });
}catch (e){
    console.error("Erro ao carregar produtos:", e)
}

    
}
/* =========================
   EVENTO BOTÃO
========================= */
btn.addEventListener('click', buscarDados);

selectCategoria.addEventListener("change", () => {

    carregarProdutos(selectCategoria.value);

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