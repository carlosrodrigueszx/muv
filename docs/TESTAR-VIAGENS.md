# Testes e checklist de integração de viagens

Este guia cobre os testes automatizados do cadastro, busca e detalhes de viagens, além de um roteiro curto de validação manual no navegador.

## Testes automatizados

Na raiz do repositório:

```bash
cd backend
./mvnw -Dtest=ViagemCadastroServiceTest,ViagemConsultaServiceTest,ViagemServiceTest,ViagemConsultaControllerIntegrationTest,ViagemControllerIntegrationTest test
```

Para executar toda a suíte do backend:

```bash
cd backend
./mvnw test
```

Os testes unitários cobrem as regras de cadastro (horários e capacidade), as chamadas de gravação, o encaminhamento dos filtros de busca e o mapeamento dos detalhes da viagem e do veículo. Os testes MVC exercitam os endpoints HTTP, a validação do payload, os status e o formato JSON, com os serviços isolados por mocks. Eles não substituem um teste com PostgreSQL real.

O frontend tem verificação de tipos e compilação:

```bash
cd frontend
npm run build
```

## Checklist manual curto

### Preparar a aplicação

- [ ] Configure `POSTGRES_PASSWORD` no `.env` e inicie o banco com `docker compose up -d postgres`.
- [ ] Inicie o backend (`cd backend && ./mvnw spring-boot:run`) e confirme que o Flyway aplicou as migrations, incluindo `V3__viagem_horario_chegada_e_recursos_veiculo.sql`.
- [ ] Inicie o frontend (`cd frontend && npm ci && npm run dev`) e abra `http://localhost:5173`.

### Fluxo de gestão e consulta

- [ ] Entre com uma conta que possa cadastrar viagens e abra `/gestao/viagens/cadastrar`.
- [ ] Preencha os dados usando um motorista existente. Cadastre uma viagem com parada intermediária, chegada posterior à partida, tarifa e comodidades do veículo.
- [ ] Confirme a mensagem com o ID criado e que uma segunda tentativa com a mesma placa é rejeitada.
- [ ] Abra `/buscar-viagens`, pesquise pela origem, destino e data cadastradas e teste os filtros de ar-condicionado e Wi-Fi.
- [ ] Confirme nos resultados linha, horários, parada, motorista, tarifa e vagas.
- [ ] Abra **Ver detalhes** e confira pontos da rota, horário de chegada, modelo/placa/capacidade do veículo, bagagem e comodidades.
- [ ] Teste uma busca sem resultados e um ID inexistente em `/gestao/viagens/999999`; a página deve exibir mensagens adequadas.

## Endpoints úteis

```bash
curl -i http://localhost:8080/api/viagens
curl -i 'http://localhost:8080/api/viagens/consulta?origem=Fortaleza&destino=Pacajus&data=2026-11-20&arCondicionado=true&wifi=false'
curl -i http://localhost:8080/api/viagens/1
```

Cadastro usa `POST /api/viagens` e exige autenticação e token CSRF. A tela de cadastro busca os motoristas em `GET /api/motoristas`.
