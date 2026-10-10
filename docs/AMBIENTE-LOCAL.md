# MUV - Ambiente de Desenvolvimento Local

## Requisitos

- Git
- Docker e Docker Compose
- JDK 21
- Node.js 24
- npm

## 1. Configurar variaveis de ambiente

Na raiz do repositorio:

```bash
if [ ! -f .env ]; then
  umask 077
  printf 'POSTGRES_PASSWORD=%s\n' \
    "$(openssl rand -hex 24)" > .env
fi
```

O arquivo .env e local e nao deve ser versionado.

## 2. Iniciar o PostgreSQL

```bash
docker compose up -d postgres
docker compose ps
```

Configuracao de desenvolvimento:

- PostgreSQL 17
- Banco: muv_dev
- Usuario: muv
- Porta local: 5432

Os dados ficam armazenados em volume Docker.

## 3. Executar o back-end

Utilize o JDK 21.

```bash
cd backend

set -a
source ../.env
set +a

./mvnw spring-boot:run \
  -Dspring-boot.run.profiles=dev
```

A API utiliza a porta 8080 por padrao.
Caso esteja ocupada, utilize:

```bash
./mvnw spring-boot:run \
  -Dspring-boot.run.profiles=dev \
  -Dspring-boot.run.arguments=--server.port=8081
```

## 4. Verificar a API

Na porta configurada:

```bash
curl -i http://localhost:8080/api/health
```

Resposta esperada:

```json
{"status":"UP"}
```

## 5. Executar o front-end

Em outro terminal:

```bash
cd frontend
npm ci
npm run dev
```

O Vite utiliza a porta 5173.

## 6. Executar verificacoes

Front-end:

```bash
cd frontend
npm run lint
npm run build
```

Back-end:

```bash
cd backend
./mvnw -B -ntp verify
```

## 7. Migrations Flyway

As migrations ficam em:

backend/src/main/resources/db/migration/

A migration inicial e:

V1__initial_schema.sql

O Flyway executa as migrations pendentes
durante a inicializacao com o perfil dev.

Novas alteracoes de banco devem utilizar
novas migrations versionadas.

Nao modificar migrations ja compartilhadas
e aplicadas em outros ambientes.

## 8. Encerrar o ambiente

Para parar o banco:

```bash
docker compose stop postgres
```

Nao utilizar docker compose down -v,
pois esse comando remove o volume de dados.
