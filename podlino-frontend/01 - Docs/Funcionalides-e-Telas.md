# Funcionalidades e Telas — PodWave

Tradução funcionalidade → tela, com a rota correspondente já implementada em `podlino-frontend/src/router/index.js`.

## Funcionalidades para Usuários

| Funcionalidade | Tela | Rota |
|---|---|---|
| Cadastro de usuário | Cadastro | `/register` |
| Autenticação (login) | Login | `/login` |
| Recuperação de senha | Recuperar senha | `/esqueci-senha` |
| Exploração de podcasts por categorias | Explorar | `/explorar` |
| Reprodução contínua de episódios | Player (embutido na tela de Episódio) | `/episodio/:id` |
| Favoritar episódios | Favoritos | `/perfil/favoritos` |
| Marcar progresso da reprodução | Continuar ouvindo | `/perfil/historico` |
| Avaliar episódios | Episódio (seção de avaliação) | `/episodio/:id` |
| Comentar episódios | Episódio (seção de comentários) | `/episodio/:id` |
| Seguir / deixar de seguir criadores | Podcast (botão seguir) / Seguindo | `/podcast/:id`, `/perfil/seguindo` |
| Curtir / descurtir episódios | Episódio (botão curtir) | `/episodio/:id` |
| Feed "Seguindo" | Feed Seguindo | `/seguindo` |
| Feed "Geral" | Feed Geral | `/feed` |
| Upload de episódios (.mp3) pelo criador | Upload de Episódio | `/criador/podcasts/:id/episodios/novo` |
| Gerenciar meus podcasts (criador) | Meus Podcasts / Novo Podcast / Editar Podcast | `/criador/podcasts`, `/criador/podcasts/novo`, `/criador/podcasts/:id/editar` |
| Gerenciar episódios do meu podcast (criador) | Gerenciar Episódios | `/criador/podcasts/:id/episodios` |
| Dados da conta | Meu Perfil | `/perfil` |
| Configurações da conta | Configurações | `/perfil/configuracoes` |
| Busca de podcasts/episódios | Buscar | `/buscar` |

## Funcionalidades para Administradores

| Funcionalidade | Tela | Rota |
|---|---|---|
| Dashboard com estatísticas | Dashboard Admin | `/admin` |
| Cadastro e gerenciamento de podcasts | Gerenciar Podcasts (admin) | `/admin/podcasts` |
| Cadastro e gerenciamento de episódios | Gerenciar Podcasts (admin) | `/admin/podcasts` |
| Controle de usuários | Gerenciar Usuários | `/admin/usuarios` |
| Gerenciamento de permissões | Gerenciar Usuários | `/admin/usuarios` |
