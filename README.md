# MUV — Plataforma de Transporte Regional de Passageiros

O MUV é uma plataforma web voltada à organização e gestão do transporte regional de passageiros, conectando passageiros, motoristas e cooperativas.

O sistema tem como objetivo facilitar a consulta de rotas e horários, a pesquisa de viagens, a reserva de assentos e a gestão operacional de motoristas, veículos, viagens e embarques.

## Tecnologias

### Front-end

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- React Router

### Back-end

- Java 21
- Spring Boot 4
- Maven Wrapper
- Spring Data JPA
- Flyway

### Banco de dados

- PostgreSQL
- Neon (opção de hospedagem)

### Desenvolvimento e integração contínua

- Git e GitHub
- GitHub Actions
- Jira
- Figma

## Estrutura do projeto

```text
muv/
├── frontend/          # Aplicação React
├── backend/           # API Spring Boot
├── database/          # Estrutura do banco de dados
├── docs/              # Documentação técnica
├── .github/workflows/ # Pipelines GitHub Actions
└── README.md
```

## Pré-requisitos

- Git
- Node.js 24
- npm
- JDK 21

O back-end utiliza Maven Wrapper, dispensando uma instalação global do Maven.

## Executando o Front-end

Na raiz do repositório:

```bash
cd frontend
npm ci
npm run dev
```

O servidor Vite utiliza a porta `5173`.

Rota disponível no estágio atual:

```text
http://localhost:5173/gestao/motoristas
```

Consulta de viagens:

```text
http://localhost:5173/buscar-viagens
```

Cadastro de viagens pela área da cooperativa (requer ao menos um motorista cadastrado):

```text
http://localhost:5173/gestao/viagens
```

### Verificações do Front-end

```bash
npm audit
npm run lint
npm run build
```

O script de build executa a verificação TypeScript e gera a compilação de produção com Vite.

## Executando o Back-end

Configure o terminal para utilizar o JDK 21.

```bash
cd backend
./mvnw spring-boot:run
```

A API utiliza a porta `8080`.

### Endpoint de verificação

```text
GET /api/health
```

Resposta:

```json
{"status":"UP"}
```

### Consulta de viagens

```text
GET /api/viagens/consulta?origem=Fortaleza&destino=Pacajus&data=2026-10-24&arCondicionado=true&wifi=false
```

Os parâmetros `origem` e `destino` pesquisam por parte do nome da parada; `data` usa o formato `AAAA-MM-DD` e pode ser omitida. Os filtros de conforto são opcionais e aceitam `true` ou `false`. A migration `V2__viagem_consulta.sql` acrescenta os atributos de Wi-Fi e ar-condicionado ao veículo. A migration `V3__horario_chegada_viagem.sql` acrescenta o horário previsto de chegada. Registros antigos permanecem com chegada nula até esse dado ser cadastrado. A pesquisa retorna as viagens e tarifas cadastradas nas tabelas `Viagem`, `Rota`, `Ponto_Rota` e `Trecho_Rota`.

O cadastro é feito por `POST /api/viagens`. A requisição inclui a rota, paradas, horários, tarifa, vagas, dados do veículo e o ID de um motorista existente. A operação grava veículo, rota, paradas, trecho tarifado e viagem em uma transação.

Para inserir três viagens fictícias no banco local e experimentar a tela, com o PostgreSQL já iniciado e as migrations aplicadas, execute na raiz do projeto:

```bash
docker compose exec -T postgres psql -U muv -d muv_dev < database/dev-demo-data.sql
```

O script pode ser executado novamente sem duplicar esses dados. As partidas são criadas para a data atual, com chegadas previstas às 15:30, 16:30 e 17:05; atualize a busca no navegador e use Fortaleza → Pacajus com o filtro de ar-condicionado ligado. Os dados são somente para demonstração.

### Testes e build do Back-end

```bash
./mvnw verify
```

Os relatórios dos testes Maven são gerados em `backend/target/surefire-reports/`.

## Banco de dados

O PostgreSQL será utilizado como banco de dados relacional, com persistência através do Spring Data JPA e gerenciamento de migrations pelo Flyway.

A integração com o banco de dados ainda está em preparação. A configuração atual do Spring Boot mantém a autoconfiguração de DataSource e Flyway desativada.

## Integração contínua

O MUV utiliza GitHub Actions por meio do workflow:

```text
.github/workflows/ci.yml
```

A pipeline executa verificações em Pull Requests direcionados à `main` e em pushes relevantes para a branch principal.

### Job Front-end

- Instalação reproduzível com `npm ci`
- Auditoria de dependências com `npm audit`
- ESLint
- Verificação TypeScript e build Vite

### Job Back-end

- Configuração do Java 21
- Cache de dependências Maven
- Compilação e testes com `mvn verify`
- Publicação dos relatórios Surefire

As execuções podem ser acompanhadas na aba Actions do repositório.

## Controle de versão

O desenvolvimento é organizado em branches específicas, vinculadas às issues do Jira, com integração à `main` por Pull Requests.

### Convenção de branches

```text
feature/SCRUM-23-gestao-rotas
fix/SCRUM-108-dependencias-frontend
docs/SCRUM-18-ambiente-local
chore/SCRUM-66-github-actions
```

### Convenção de commits

```text
feat(SCRUM-23): implementar gestao de rotas
fix(SCRUM-108): corrigir dependencias
docs(SCRUM-18): atualizar ambiente de desenvolvimento
ci(SCRUM-66): configurar pipeline
test(SCRUM-105): adicionar testes
refactor(SCRUM-XX): refatorar modulo
```

Cada Pull Request deve indicar a issue correspondente do Jira.

## Documentação

A documentação do projeto está presente na branch `docs/documentos`, contemplando:

- Requisitos
- Diagramas
- Protótipos
- Atas de reuniões

### Classificação dos requisitos

- `RF00X` — Requisito Funcional
- `RNF00X` — Requisito Não Funcional
- `RN00X` — Regra de Negócio

## Referências do projeto

- [GitHub — MUV](https://github.com/carlosrodrigueszx/muv)
- [Jira — SCRUM](https://projeto-integrado-cc.atlassian.net)
- [Figma — Protótipo MUV](https://www.figma.com/design/BZfLRVcLOKqP6gbZbNptuF/MUV-Prot%C3%B3tipo)

## Funcionalidades implementadas

- [RF001 — Cadastro e Autenticação de Passageiros](docs/RF001-CADASTRO-AUTENTICACAO.md)

## Estado atual da implementação

O MUV utiliza PostgreSQL, Spring Data JPA e Flyway.

O ambiente de desenvolvimento pode utilizar PostgreSQL local
com Docker ou PostgreSQL hospedado no Neon.

A RF001, desenvolvida na branch de cadastro e autenticacao
de passageiros, contempla cadastro, login, logout e
recuperacao de senha.

As interfaces utilizam a identidade visual do prototipo MUV.

Documentacao: docs/RF001-CADASTRO-AUTENTICACAO.md
