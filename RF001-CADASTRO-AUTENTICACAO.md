# RF001 — Cadastro e Autenticação de Passageiros

## Funcionalidades

- Cadastro de passageiros com nome, CPF, telefone, e-mail e senha.
- Validação de dados e identificação de CPF ou e-mail duplicado.
- Login e logout.
- Consulta da sessão autenticada.
- Recuperação de senha por e-mail.
- Redefinição de senha por token temporário.

## Telas

| Rota | Descrição |
| --- | --- |
| `/cadastro` | Cadastro de passageiros |
| `/login` | Login e minha conta |
| `/esqueci-senha` | Solicitação de recuperação |
| `/redefinir-senha` | Redefinição de senha |

As telas utilizam a identidade visual do protótipo MUV, com layout responsivo.

## API

| Método | Endpoint |
| --- | --- |
| POST | `/api/passageiros` |
| GET | `/api/auth/csrf` |
| POST | `/api/auth/login` |
| GET | `/api/auth/me` |
| POST | `/api/auth/logout` |
| POST | `/api/auth/recuperacao/solicitar` |
| POST | `/api/auth/recuperacao/redefinir` |

## Segurança

- Senhas protegidas com BCrypt.
- Autenticação com sessão HTTP.
- Proteção CSRF.
- Tokens de recuperação de uso único com validade de 30 minutos.
- Credenciais externas mantidas fora do repositório.

## Banco de dados

- PostgreSQL.
- Flyway: `V1__initial_schema.sql` e `V2__recuperacao_senha.sql`.
- Conexão com Neon validada no ambiente de desenvolvimento.

## Testes

- Backend: `cd backend && ./mvnw -B -ntp verify`
- Frontend: `cd frontend && npm run build && npm run lint`
- E-mails de desenvolvimento: Mailpit, porta 8025.

## Limites

- Cadastro de motorista e cooperativa fora do escopo da RF001.
- Sem login automático após o cadastro.
- Gov.br e SMS/WhatsApp não implementados.
