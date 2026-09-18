"use strict";

const CONFIGURACAO = {
    whatsapp: "5500000000000"
};

const botaoMenu = document.querySelector(".menu-botao");
const menu = document.querySelector(".menu-principal");

if (botaoMenu && menu) {
    botaoMenu.addEventListener("click", () => {
        const aberto = botaoMenu.getAttribute("aria-expanded") === "true";
        botaoMenu.setAttribute("aria-expanded", String(!aberto));
        menu.classList.toggle("aberto", !aberto);
        document.body.classList.toggle("menu-aberto", !aberto);
    });

    menu.addEventListener("click", () => {
        botaoMenu.setAttribute("aria-expanded", "false");
        menu.classList.remove("aberto");
        document.body.classList.remove("menu-aberto");
    });
}

document.querySelectorAll("[data-ano]").forEach((elemento) => {
    elemento.textContent = new Date().getFullYear();
});

const campoData = document.querySelector("#data");
if (campoData) {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    campoData.min = `${ano}-${mes}-${dia}`;
}

const parametros = new URLSearchParams(window.location.search);
const servicoRecebido = parametros.get("servico");
const campoServico = document.querySelector("#servico");
if (campoServico && servicoRecebido) {
    const opcaoExiste = [...campoServico.options].some((opcao) => opcao.value === servicoRecebido);
    if (opcaoExiste) campoServico.value = servicoRecebido;
}

const formulario = document.querySelector("#form-agendamento");
const mensagemForm = document.querySelector("#mensagem-form");

if (formulario) {
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        mensagemForm.classList.remove("ativa");

        if (!formulario.reportValidity()) return;

        if (!/^55\d{10,11}$/.test(CONFIGURACAO.whatsapp) || /^550+$/.test(CONFIGURACAO.whatsapp)) {
            mensagemForm.textContent = "O WhatsApp da barbearia ainda precisa ser configurado no arquivo script.js.";
            mensagemForm.classList.add("ativa");
            return;
        }

        const dados = new FormData(formulario);
        const data = new Date(`${dados.get("data")}T12:00:00`);
        const dataFormatada = new Intl.DateTimeFormat("pt-BR").format(data);
        const observacao = String(dados.get("observacao") || "").trim();
        const linhas = [
            "Olá! Gostaria de solicitar um horário na Barberia.",
            "",
            `Nome: ${dados.get("nome")}`,
            `Serviço: ${dados.get("servico")}`,
            `Data desejada: ${dataFormatada}`,
            `Horário desejado: ${dados.get("horario")}`
        ];

        if (observacao) linhas.push(`Observação: ${observacao}`);
        linhas.push("", "Aguardo a confirmação da disponibilidade.");

        const url = `https://wa.me/${CONFIGURACAO.whatsapp}?text=${encodeURIComponent(linhas.join("\n"))}`;
        window.open(url, "_blank", "noopener,noreferrer");
    });
}
