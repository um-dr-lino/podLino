# Checklists — Atividade Aula 01 (PodWave)

> Marcado apenas o que foi verificado de fato (comando executado, arquivo lido, ou tela testada no navegador). Itens não confirmados ficam desmarcados com uma nota do que falta.

## PARTE A — Backend

### Etapa 1 — Setup do ambiente e criação do projeto
- [x] `node -v` e `npm -v` conferidos (v24.18.0 / 11.16.0)
- [x] Pasta `backend-podwave-api` criada, separada da pasta do front (`podlino-frontend`)
- [x] `package.json` gerado, com `"main": "index.js"` (não utilizado — estrutura substituída na Etapa 3)

### Etapa 2 — Dependências e scripts
- [x] `express`, `cors`, `dotenv`, `morgan` instalados como dependências
- [x] `nodemon` instalado como devDependency
- [x] Scripts `start` e `dev` configurados no `package.json`

### Etapa 3 — Estrutura de pastas
- [x] Pastas `bin/`, `config/`, `middlewares/`, `modules/`, `routes/` criadas
- [x] `.gitignore` criado com `node_modules/` e `.env`

### Etapa 4 — Padrão único de resposta
- [x] `middlewares/apiResponse.js` criado com as funções `success` e `error`

### Etapa 5 — Rota `GET /api`
- [x] `routes/index.js` criado, com `name`/`message` adaptados ao projeto (Pod Lino)
- [x] Campo `data.status` escrito exatamente assim (`status`, minúsculo)

### Etapa 6 — CORS via `.env`
- [x] `.env` criado com `PORT=3000` e `CORS_ORIGIN=http://localhost:5173`

### Etapa 7 — `app.js` e `bin/www`
- [x] `app.js` criado, montando `indexRouter` sob o prefixo `/api`
- [x] `bin/www` criado
- [x] `npm run dev` sobe o servidor sem erros — confirmado agora: `PodLino API rodando em http://localhost:3000`

### Etapa 8 — Teste isolado da API
- [x] `curl http://localhost:3000/api` responde o JSON esperado — testado agora:
  `{"success":true,"message":"Bem-vindo à API do PodLino-App.","data":{"name":"Pod Lino - API","version":"1.0.0","status":"online"}}`

## PARTE B — Frontend

### Etapa 1 — Verificação e criação do projeto
- [x] `curl` confirmou que a API está respondendo
- [x] `npm run dev` abre a aplicação em `http://localhost:5173`

### Etapa 2 — Organização de pastas e variáveis de ambiente
- [x] Estrutura de pastas criada (`views/`, `components/`, `router/`, `services/`, `stores/`)
- [x] `HelloWorld.vue` removido; `style.css` limpo (arquivo vazio, sem estilos padrão do Vite)
- [x] `.env` criado com `VITE_API_URL=http://localhost:3000/api`
- [x] `.gitignore` configurado (`node_modules/`, `dist/`, `.env`)

### Etapa 3 — Vue Router: mapeando todas as telas
- [x] Tabela de tradução "funcionalidade → tela" preenchida ([Funcionalides-e-Telas.md](Funcionalides-e-Telas.md))
- [x] Uma tela placeholder criada para cada linha da tabela
- [x] `src/router/index.js` criado com todas as rotas do sistema
- [x] Router registrado em `main.js`
- [x] Navegando manualmente pela URL, as rotas testadas carregam a tela correspondente (`/feed`, `/admin`, `/`)

### Etapa 4 — Layout base: Navbar, Sidebar e Footer
- [x] `TheNavbar.vue`, `TheSidebar.vue` e `TheFooter.vue` criados
- [ ] **Pendente:** os três componentes ainda não têm `<router-link>` para as rotas do projeto (estão com conteúdo estático/vazio)
- [x] Layout montado em `App.vue`, com `<router-view />` no lugar certo

### Etapa 5 — Consumindo a API: marco visual da Landing
- [x] Landing Page exibindo "Status da API: online" com dados reais da API — confirmado agora no navegador
- [x] Erro de CORS reproduzido de propósito (alterei `CORS_ORIGIN` para `http://localhost:9999`, reiniciei a API, recarreguei a Landing): Console acusou
  `Access to fetch at 'http://localhost:3000/api' from origin 'http://localhost:5173' has been blocked by CORS policy...`, Landing caiu para "offline", e o log da API (`morgan`) mostrou `GET /api` chegando normalmente — confirmando que quem bloqueou foi o navegador, não o servidor
- [x] Correção confirmada: `CORS_ORIGIN` restaurado para `http://localhost:5173`, API reiniciada, Landing voltou a "online"
