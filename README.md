# Base comercial para site de barbearia

Site estático multipágina feito com HTML, CSS e JavaScript puro. Pode ser publicado gratuitamente em serviços como Vercel, Netlify ou GitHub Pages.

## Função de cada arquivo

- `index.html`: apresenta a marca, proposta e diferenciais.
- `servicos.html`: mostra serviços, preços, duração e leva o serviço escolhido ao agendamento.
- `agendar.html`: coleta a preferência do cliente e monta uma mensagem organizada no WhatsApp.
- `sobre.html`: apresenta a história, horários, endereço, mapa e Instagram.
- `style.css`: concentra todo o visual e a responsividade.
- `script.js`: controla o menu mobile, ano automático, serviço selecionado, data mínima e envio ao WhatsApp.

## Personalização obrigatória antes de publicar

1. Em `script.js`, substitua `5500000000000` pelo WhatsApp real com país e DDD, apenas números.
2. Troque nome, textos, preços e horários nos quatro arquivos HTML.
3. Atualize endereço, link do mapa e Instagram em `sobre.html`.
4. Substitua as imagens da pasta `imagens` por fotos autorizadas da barbearia.
5. Confira todos os textos e links no celular antes da entrega.

## Como testar

Abra `index.html` no navegador ou, com a extensão Live Server no VS Code, clique em **Open with Live Server**.

O formulário não reserva horários sozinho. Ele envia uma **solicitação** pelo WhatsApp; a barbearia precisa confirmar a vaga. Agenda automática, painel administrativo e banco de dados ficam para uma versão futura com backend.
