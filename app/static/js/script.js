const select = document.getElementById('filialSelect');
const display = document.getElementById('valorFaturamento');
const btn = document.getElementById('btnAplicar');

const dataInicioInput = document.getElementById('dataInicio');
const dataFimInput = document.getElementById('dataFim');

/* =========================
   BUSCAR DADOS
========================= */
async function buscarDados() {

    try {

        const filial = select.value;
        const dataInicio = dataInicioInput.value;
        const dataFim = dataFimInput.value;

        const params = new URLSearchParams();

        params.append("filial", filial);
        params.append("inicio", dataInicio);
        params.append("fim", dataFim);

        const res = await fetch(`/faturamento?${params.toString()}`);

        const valor = await res.json();

        display.innerText = valor;

    } catch (e) {

        console.error("Erro ao buscar dados:", e);

    }
}

/* =========================
   CARREGAR FILIAIS
========================= */
async function carregarFiliais() {

    try {

        const res = await fetch('/filiais');

        const nomes = await res.json();

        select.innerHTML = '<option value="">Todas as Filiais</option>';

        nomes.forEach(nome => {

            const opt = document.createElement('option');

            opt.value = nome;
            opt.text = nome;

            select.appendChild(opt);

        });

    } catch (e) {

        console.error("Erro ao carregar filiais:", e);

    }
}

/* =========================
   EVENTO BOTÃO
========================= */
btn.addEventListener('click', buscarDados);

/* =========================
   INICIALIZAÇÃO
========================= */
(async function init() {

    await carregarFiliais();
    await buscarDados();

})();