# MUV

Plataforma web de transporte comunitário para passageiros e fretes.

## Sobre o projeto

O MUV tem como objetivo centralizar e modernizar a operação de transporte
alternativo e comunitário, conectando motoristas e passageiros.

A plataforma prevê suporte a serviços como transporte de passageiros e fretes,
permitindo aos motoristas cadastrar veículos, gerenciar rotas e preços, enquanto
os passageiros poderão buscar viagens, realizar reservas, contratar fretes e
avaliar os serviços.

> As funcionalidades definitivas serão especificadas no Documento de
> Requisitos do projeto.

## Tecnologias

### Front-end

- React
- TypeScript
- Tailwind CSS
- Vite

### Back-end

- Java 21
- Spring Boot
- Maven

### Banco de dados

- PostgreSQL
- Neon

## Estrutura do projeto

```text
muv/
├── frontend/       # Aplicação React
├── backend/        # API Spring Boot
├── database/       # Scripts e estrutura do banco
├── docs/           # Documentação do projeto
└── .github/        # Configurações do GitHub
```

## Pré-requisitos

- Git
- Node.js 24
- npm
- Java 21

## Executando o Front-end

```bash
cd frontend
npm install
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:5173
```

## Executando o Back-end

```bash
cd backend
./mvnw spring-boot:run
```

A API utiliza a porta `8080`.

Endpoint de verificação:

```text
GET /api/health
```

Resposta esperada:

```json
{
  "status": "UP"
}
```

## Testes do Back-end

```bash
cd backend
./mvnw test
```

## Git

As funcionalidades devem ser desenvolvidas em branches específicas e
integradas à `main` por meio de Pull Requests.

### Convenção de branches

```text
feature/MUV-XXX-descricao
fix/MUV-XXX-descricao
docs/MUV-XXX-descricao
chore/MUV-XXX-descricao
```

### Convenção de commits

```text
feat: nova funcionalidade
fix: correção de problema
docs: documentação
chore: configuração/manutenção
test: testes
refactor: refatoração
```

## Documentação

A documentação do projeto será mantida em `docs/`, incluindo:

- requisitos;
- diagramas;
- protótipos;
- atas/reuniões.

Os requisitos serão documentados seguindo a classificação:

- `RF00X` — Requisito Funcional;
- `RNF00X` — Requisito Não Funcional;
- `RN00X` — Regra de Negócio.
