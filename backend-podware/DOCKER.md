# Rodando o Shortz API com Docker

Este projeto agora sobe em dois containers via `docker-compose.yml`:

- **db** — banco de dados (imagem `mariadb:11`), já carregado com o dump `shortz_db-dump.sql`.
- **api** — a API Node/Express (build a partir do `Dockerfile`).

## Arquivos criados/alterados

| Arquivo | O que faz |
|---|---|
| `Dockerfile` | Empacota a API: instala dependências (`npm ci`) e roda `node ./bin/www`. |
| `.dockerignore` | Evita copiar `node_modules`, `.env` e `.git` para dentro da imagem. |
| `docker-compose.yml` | Orquestra os dois serviços (`db` e `api`), rede, volumes e variáveis de ambiente. |
| `.env` | Reorganizado (ver abaixo) — os valores continuam os mesmos. |

### Por que o `.env` foi alterado

O `.env` original tinha comentários na mesma linha do valor, por exemplo:

```
DB_NAME=shortz_db       # nome do banco de dados
```

Isso funciona com a lib `dotenv` do Node (usada localmente), mas o parser de `.env` do Docker Compose **não remove comentários no final da linha** — ele leria o valor de `DB_NAME` como `"shortz_db       # nome do banco de dados"` literalmente, e a API não conseguiria achar o banco. Por isso os comentários foram movidos para a linha de cima. Os valores (`DB_USER=root`, `DB_PASSWORD=123`, etc.) não mudaram.

## Como o banco é inicializado

O `docker-compose.yml` monta o dump direto na pasta especial de inicialização do MariaDB:

```yaml
volumes:
  - ./shortz_db-dump.sql:/docker-entrypoint-initdb.d/shortz_db-dump.sql:ro
```

Isso é um comportamento padrão da imagem oficial: **qualquer `.sql` dentro de `/docker-entrypoint-initdb.d/` é executado automaticamente, mas só na primeira vez que o container é criado** (quando o volume de dados `db_data` ainda está vazio). Se você já tiver subido o banco antes e quiser recarregar o dump do zero, precisa apagar o volume (veja "Resetar o banco" abaixo).

Foi usada a imagem `mariadb` (não `mysql`) porque o dump usa a collation `utf8mb4_uca1400_ai_ci`, que só existe no MariaDB — no MySQL a criação das tabelas falharia.

### Sobre o usuário `root`

Seu `.env` usa `DB_USER=root` e `DB_PASSWORD=123`. Por padrão, as imagens oficiais do MySQL/MariaDB só permitem login do `root` a partir de dentro do próprio container (`localhost`), não de outro container na rede. Por isso o compose define:

```yaml
MARIADB_ROOT_HOST: '%'
```

que libera o `root` para conectar de qualquer host — nesse caso, do container da API.

## Variáveis de ambiente

O serviço `api` usa o `env_file: .env` (reaproveita tudo que já está no seu `.env`), mas sobrescreve duas variáveis para apontar para o container do banco em vez de `localhost`:

```yaml
environment:
  DB_HOST: db      # nome do serviço do banco dentro da rede do compose
  DB_PORT: 3306
```

O serviço `db` usa `${DB_PASSWORD}` e `${DB_NAME}` (lidos do seu `.env`) para criar a senha do `root` e o nome do banco.

## Comandos

Subir tudo (build da imagem da API + banco), em segundo plano:

```bash
docker compose up -d --build
```

Ver logs em tempo real (ex.: para conferir se a API conectou no banco):

```bash
docker compose logs -f
```

Parar os containers (mantém os dados do banco):

```bash
docker compose down
```

Resetar o banco do zero (apaga o volume e recarrega o dump na próxima subida):

```bash
docker compose down -v
docker compose up -d --build
```

Rebuildar só a API depois de alterar código/dependências:

```bash
docker compose up -d --build api
```

## Acesso

- API: `http://localhost:3000` (porta vem do `PORT` no `.env`)
- Banco: `localhost:3306` (exposto para você conectar com HeidiSQL/DBeaver/etc., usuário `root`, senha `123`)

## Uploads

A pasta `public/uploads` é montada como volume (`./public/uploads:/usr/src/app/public/uploads`), então os arquivos enviados via `multer` continuam acessíveis fora do container, na pasta do projeto.
