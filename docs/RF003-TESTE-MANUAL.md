# RF003 — Visualizar detalhes da viagem e do veículo

Este guia descreve como preparar o ambiente local e testar manualmente a busca de viagens e a tela de detalhes do motorista, do veículo e do itinerário.

## O que será validado

- A tela de busca consulta viagens persistidas no PostgreSQL local.
- Cada resultado abre a página de detalhes correspondente.
- O detalhe mostra a viagem, o motorista, o veículo, os pontos da rota, a tarifa e as avaliações disponíveis.
- Os estados de carregamento, erro e viagem inexistente são apresentados corretamente.
- A página funciona em telas largas e estreitas.

## Pré-requisitos

- Git.
- Docker Engine/Desktop com Docker Compose v2 em execução e permissão para acessar o daemon.
- Node.js 24 e npm.
- JDK 21.
- Portas locais `5432` (PostgreSQL), `8080` (API) e `5173` (Vite) livres.

Na raiz do repositório, confirme as versões:

```bash
docker compose version
node --version
npm --version
java -version
```

## 1. Configurar o ambiente

Execute os comandos seguintes a partir da raiz do projeto.

Se ainda não existir um `.env`, crie-o a partir do exemplo:

```bash
cp .env.example .env
```

Edite `.env` e defina um valor individual para `POSTGRES_PASSWORD`:

```dotenv
POSTGRES_PASSWORD=escolha-uma-senha-local
```

O arquivo `.env` é ignorado pelo Git. Não compartilhe nem versione a senha. O Compose usa essa variável para inicializar o PostgreSQL; a aplicação Spring conecta-se, por padrão, ao banco `muv_dev`, usuário `muv` e endereço `127.0.0.1:5432`, conforme `backend/src/main/resources/application-dev.properties`.

O Compose carrega o `.env` automaticamente. Ao iniciar pelo Maven dentro de `backend`, o Spring Boot também importa `../.env` como arquivo de propriedades. Escreva `POSTGRES_PASSWORD` sem aspas para Compose e Spring usarem o mesmo valor; `DB_PASSWORD`, se definida no ambiente, tem prioridade. Os valores padrão de URL e usuário já correspondem ao serviço Compose. Se alterar esses valores, informe `DB_URL` e `DB_USER` no ambiente do processo Java.

Valide a configuração e inicie o banco:

```bash
docker compose config --quiet
docker compose up -d postgres
docker compose ps
```

Espere o serviço `postgres` ficar saudável antes de continuar. Se precisar acompanhar a inicialização:

```bash
docker compose logs -f postgres
```

Use `Ctrl+C` para parar o acompanhamento dos logs; isso não para o container.

### Problemas comuns com Docker ou porta 5432

- Se houver erro de permissão ao acessar `/var/run/docker.sock`, inicie o Docker Desktop/Engine e use uma conta autorizada a acessar o daemon. Não execute o projeto com privilégios elevados apenas para contornar essa configuração.
- Se a porta `5432` estiver ocupada, encerre o outro serviço PostgreSQL ou ajuste o mapeamento de porta em `compose.yaml` e a URL `DB_URL` da API para a mesma porta. Não altere arquivos de configuração compartilhados sem combinar a mudança com a equipe.
- Se a senha do `.env` for alterada depois de o volume `postgres_data` já ter sido inicializado, o PostgreSQL existente não troca a senha automaticamente. Use a senha original do volume ou faça uma reinicialização deliberada dos dados locais, lembrando que isso apaga o banco persistido.

## 2. Iniciar a API e aplicar as migrations

Em um terminal, na raiz do repositório:

```bash
cd backend
./mvnw spring-boot:run
```

No Windows, use:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Na inicialização, o Flyway aplica as migrations e o Hibernate valida o schema. Mantenha esse terminal aberto. Aguarde a mensagem de que a aplicação iniciou antes de abrir a tela.

Em outro terminal, verifique a API:

```bash
curl --fail http://127.0.0.1:8080/api/health
```

Resposta esperada:

```json
{"status":"UP"}
```

## 3. Carregar os dados de demonstração

Com o PostgreSQL saudável e as migrations aplicadas, execute na raiz do repositório:

```bash
docker compose exec -T postgres psql -U muv -d muv_dev < database/dev-demo-data.sql
```

O script cria dados fictícios para teste e pode ser executado novamente sem duplicar as viagens de demonstração. As partidas são inseridas para a data corrente. Os valores de cadastro e autenticação desses dados são marcadores de demonstração; não os use como dados ou credenciais reais.

Opcionalmente, confira se as viagens foram inseridas:

```bash
docker compose exec -T postgres psql -U muv -d muv_dev -c \
  "SELECT v.id, v.data_viagem, v.horario_partida, r.nome FROM viagem v JOIN rota r ON r.id = v.id_rota ORDER BY v.data_viagem, v.horario_partida;"
```

O script inclui rotas de Fortaleza a Pacajus, com uma viagem direta e viagens com paradas intermediárias. A tela de busca inicial usa Fortaleza, Pacajus e o filtro de ar-condicionado.

## 4. Iniciar o frontend

Em outro terminal, na raiz do repositório:

```bash
cd frontend
npm ci
npm run dev
```

Se as dependências já estiverem instaladas e não houver mudança nos manifests, `npm ci` pode ser omitido. Mantenha o servidor Vite em execução e abra:

```text
http://127.0.0.1:5173/buscar-viagens
```

O Vite encaminha chamadas `/api` para `http://127.0.0.1:8080`, conforme `frontend/vite.config.ts`.

## Roteiro de testes manuais

### RF003-01 — Consultar viagens disponíveis

1. Abra `/buscar-viagens`.
2. Confirme origem `Fortaleza (Terminal Messejana)`, destino `Pacajus (Centro / Rodoviária)` e data de hoje.
3. Deixe o filtro **Ar-condicionado** marcado e **Wi-Fi** desmarcado.
4. Clique em **Filtrar Busca**.
5. Confirme que aparecem resultados e que cada cartão mostra horários, motorista, veículo, tarifa e vagas.

**Resultado esperado:** são exibidas viagens compatíveis com os filtros e com vagas disponíveis. A quantidade e os horários correspondem aos registros existentes no banco.

Se a lista estiver vazia, confira a data selecionada, os filtros, o estado do PostgreSQL, a execução do script de demonstração e os logs da API.

### RF003-02 — Abrir detalhes a partir de um resultado

1. Em um cartão, clique em **Ver detalhes da viagem**.
2. Confirme que a URL tem o formato `/viagens/{id}` e inclui origem e destino como parâmetros de consulta.
3. Aguarde o carregamento da página.
4. Confira motorista, horários, data, linha, tarifa, vagas, informações do veículo, comodidades e itinerário.
5. Use o link **Voltar para busca de viagens** e abra outro resultado, se disponível.

**Resultado esperado:** os detalhes correspondem ao resultado escolhido. A origem e o destino do trecho escolhido são mantidos, inclusive quando há paradas intermediárias na rota.

Também é possível verificar a API diretamente, usando um ID e os nomes dos pontos existentes no banco:

```bash
curl --fail --get 'http://127.0.0.1:8080/api/viagens/ID' \
  --data-urlencode 'origem=Fortaleza (Terminal Messejana)' \
  --data-urlencode 'destino=Pacajus (Centro / Rodoviária)'
```

Substitua `ID` pelo identificador exibido no cartão ou obtido na consulta SQL. A resposta esperada é um objeto JSON com os campos da viagem, veículo, motorista, itinerário e avaliações.

### RF003-03 — Conferir itinerário e paradas

1. Abra o detalhe de uma viagem com parada intermediária.
2. Confira que a lista mostra origem, paradas autorizadas e destino, na ordem da rota.
3. Confira que os horários de partida e chegada aparecem nos pontos inicial e final.

**Resultado esperado:** as paradas são lidas do banco e exibidas em ordem. A viagem direta mostra apenas origem e destino.

### RF003-04 — Conferir fotos e avaliações

1. Observe a galeria do veículo e a foto do motorista.
2. Confira os recursos do veículo: ar-condicionado, Wi-Fi, bagagem e vagas.
3. Consulte a seção de avaliações.

**Resultado esperado:** são usadas as fotos cadastradas no veículo; quando não existem fotos cadastradas, a interface usa as imagens locais de demonstração. A foto do motorista também tem uma imagem local alternativa. Se o banco não tiver avaliações, a página informa que ainda não há avaliações para a viagem, sem inventar comentários.

### RF003-05 — Viagem inexistente

1. Abra uma URL com um identificador de viagem inexistente, por exemplo `/viagens/999999`.
2. Confirme que uma mensagem informa que a viagem não foi encontrada.

**Resultado esperado:** a página apresenta o estado de não encontrado, sem exibir dados de outra viagem. Pela API, o status esperado é `404`.

### RF003-06 — Filtros, erro e carregamento

1. Na busca, alterne os filtros de ar-condicionado e Wi-Fi e refaça a consulta.
2. Observe o estado de carregamento e o resultado após a resposta.
3. Para testar indisponibilidade, pare a API temporariamente e atualize uma busca ou detalhe; depois reinicie a API.

**Resultado esperado:** os resultados respeitam os filtros. Sem comunicação com a API, a interface informa que não foi possível carregar os dados; não apresenta resultados fictícios como se fossem dados do banco.

### RF003-07 — Responsividade

1. Abra um detalhe em uma janela larga.
2. Reduza a largura do navegador ou use a ferramenta de dispositivos do DevTools em larguras de tablet e celular.
3. Confira a leitura das seções, a galeria, a tarifa e os botões.

**Resultado esperado:** os cartões e a tarifa se reorganizam para telas menores sem sobreposição ou rolagem horizontal indevida.

### Observações sobre a demonstração

- O script de demonstração cria viagens para a data corrente. Se a data inicial do formulário não coincidir com a data local do banco, selecione manualmente a data retornada pela consulta SQL.
- Os registros de demonstração não incluem fotos JSONB para o veículo nem avaliações de passageiros; nesses casos, confira o fallback de imagens e o estado vazio de avaliações.
- A ação de continuar para seleção de assentos/reserva está desabilitada por enquanto. A RF003 cobre a visualização dos detalhes; não é um fluxo de reserva.
- O endpoint de detalhe aceita `origem` e `destino` opcionais. A tela envia esses parâmetros para mostrar o trecho selecionado; chamadas diretas sem esses parâmetros consideram a rota completa.

## Checklist de validação

### Ambiente

- [ ] `.env` existe na raiz e `POSTGRES_PASSWORD` está preenchida.
- [ ] A senha local não foi compartilhada nem adicionada ao Git.
- [ ] Docker Compose consegue validar a configuração.
- [ ] O container `postgres` está saudável e acessível na porta `5432`.
- [ ] A API inicia na porta `8080` sem erro de conexão com o banco.
- [ ] `GET /api/health` retorna `{"status":"UP"}`.
- [ ] As migrations Flyway são aplicadas sem erros.
- [ ] O script de demonstração termina sem erro.

### RF003 e interface

- [ ] A busca encontra viagens para a data e os filtros escolhidos.
- [ ] O cartão apresenta os principais dados e navega para `/viagens/{id}`.
- [ ] O detalhe carrega os dados correspondentes ao ID selecionado.
- [ ] Origem, destino e itinerário são apresentados na ordem correta.
- [ ] Horários, data, tarifa e vagas correspondem ao banco.
- [ ] Tipo, modelo, ano, cor, placa, capacidade e recursos do veículo são exibidos.
- [ ] A galeria usa fotos cadastradas ou as imagens alternativas quando não há fotos no banco.
- [ ] As avaliações são exibidas quando existem; sem registros, aparece o estado vazio.
- [ ] Uma viagem inexistente apresenta mensagem apropriada e a API retorna `404`.
- [ ] Falha de conexão com a API é comunicada claramente.
- [ ] A tela permanece utilizável em desktop, tablet e celular.
- [ ] A ação de reserva permanece identificada como indisponível nesta etapa.

### Encerrar o ambiente

Pare os processos do frontend e da API com `Ctrl+C` nos respectivos terminais. Para parar apenas o container do banco, preservando os dados:

```bash
docker compose stop postgres
```

Para iniciá-lo novamente em outra sessão:

```bash
docker compose start postgres
```

O volume `postgres_data` mantém os dados entre reinicializações. Não remova o volume se quiser preservar o banco local.
