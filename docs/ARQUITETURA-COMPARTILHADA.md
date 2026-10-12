# MUV - Arquitetura Compartilhada

## Objetivo

Padronizar a implementacao dos modulos do MUV,
permitindo o desenvolvimento paralelo da equipe.

## Back-end

Pacote base: br.com.muv

Organizacao recomendada:

- controller: endpoints REST
- service: regras de negocio
- repository: persistencia JPA
- model: entidades do dominio
- dto: contratos de entrada e saida
- exception: tratamento de erros
- config: configuracoes compartilhadas

As classes e pastas serao criadas conforme
as funcionalidades forem implementadas.

## Front-end

Manter React, TypeScript, Vite e React Router.

Reutilizar os layouts existentes e separar:

- pages: telas
- components: componentes reutilizaveis
- services: comunicacao com a API
- types: contratos TypeScript

## Contratos iniciais propostos

RF001:
POST /api/passageiros
POST /api/auth/login

RF002:
GET /api/viagens

RF011:
POST /api/motoristas

RF010:
POST /api/veiculos

RF003:
GET /api/viagens/{id}

Os contratos serao detalhados antes da
implementacao das respectivas funcionalidades.

## Convencoes REST

- Utilizar JSON nas APIs de negocio
- Validar os dados recebidos
- Utilizar DTOs para entradas e saidas
- Tratar erros com respostas consistentes
- Nao expor senhas ou entidades sensiveis
- Separar regras de negocio dos controllers

## Banco de dados

PostgreSQL com Spring Data JPA.

As alteracoes no esquema devem utilizar
migrations versionadas do Flyway.

A migration V1 ja foi compartilhada.
A RF001 já utiliza V2__recuperacao_senha.sql. Novas migrações devem usar versões disponíveis, alinhadas com a equipe.

## Integracao

- Uma branch por funcionalidade
- Commits vinculados ao Jira
- Pull Requests direcionados a main
- Executar testes antes do merge
- Preservar os contratos compartilhados

## Implementacao

Cada integrante sera responsavel por
implementar e testar seu requisito funcional.

Mudancas em entidades ou contratos compartilhados
devem ser alinhadas entre os integrantes.

## Implementacao da RF001

A branch feature/cadastro-autenticacao-passageiros implementa:

- POST /api/passageiros
- GET /api/auth/csrf
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/logout
- POST /api/auth/recuperacao/solicitar
- POST /api/auth/recuperacao/redefinir

A autenticacao utiliza Spring Security, sessao HTTP,
protecao CSRF e senhas com BCrypt.

A recuperacao de senha utiliza token temporario de uso unico.

## Evolucao do banco

- V1__initial_schema.sql: esquema inicial.
- V2__recuperacao_senha.sql: recuperacao de senha.

Novas migrations devem possuir versoes nao utilizadas,
alinhadas entre os integrantes da equipe.
