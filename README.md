# Barber Flow

Site profissional e fila digital para barbearias de bairro. O cliente vê a fila antes de sair de casa; o barbeiro organiza o atendimento sem depender de listas copiadas no WhatsApp.

## O que existe neste marco

- Frontend React/Vite mobile-first e instalável como PWA.
- Página pública personalizável por barbearia.
- Visualização e entrada na fila com nomes anonimizados.
- API Java 21 + Spring Boot.
- PostgreSQL com migrações Flyway.
- WebSocket/STOMP para atualização da fila em tempo real.
- Estrutura multitenant: todas as consultas da fila usam a barbearia identificada pelo `slug`.
- Dados demonstrativos para desenvolvimento local.

Ainda não fazem parte deste marco: login administrativo, painel do barbeiro, comandos chamar/iniciar/finalizar, cancelamento pelo cliente, notificações e deploy definitivo.

## Estrutura

```text
frontend/   React, Vite e PWA (Vercel)
backend/    Java, Spring Boot, REST e WebSocket (Render)
Neon        PostgreSQL compartilhado com isolamento por tenant_id
```

## Rodar localmente

Frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Backend, com Java 21 e Maven:

```bash
cd backend
mvn spring-boot:run
```

Sem variáveis, a API usa H2 em memória e cria a barbearia de demonstração `denis`. Teste em `http://localhost:8080/ping` e abra o frontend em `http://localhost:5173/denis`.

## Neon

Copie a connection string do Neon e converta somente o começo de `postgresql://` para `jdbc:postgresql://`. Separe usuário e senha nas variáveis indicadas em `backend/.env.example`.

## Render

- Root Directory: `backend`
- Runtime: Docker
- Health Check Path: `/ping`
- Environment: as variáveis de `backend/.env.example`
- Em produção, defina `DEMO_TENANT_ENABLED=false` depois que o cadastro administrativo existir.

## Vercel

- Root Directory: `frontend`
- Framework: Vite
- Environment: `VITE_API_URL=https://sua-api.onrender.com`
- Adicione a URL final da Vercel em `CORS_ALLOWED_ORIGINS` no Render.

## Regra de isolamento

O endereço público usa um `slug`, por exemplo `/denis`. A API resolve esse slug para um tenant e todas as leituras e gravações usam o `tenant_id` resolvido no servidor. Quando houver login administrativo, o tenant virá do JWT; nunca será aceito cegamente do corpo da requisição.
