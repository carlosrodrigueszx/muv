# Explicação do diagrama de classes

O diagrama de classes apresentado representa a estrutura do sistema de gerenciamento de viagens e reservas, demonstrando as principais entidades, seus atributos, métodos e os relacionamentos existentes entre elas. A modelagem foi desenvolvida buscando separar as responsabilidades do sistema e aplicar **princípios de orientação a objetos** e **padrões de projeto**.

A classe abstrata `Usuario` representa as informações comuns aos usuários do sistema, como nome, CPF, telefone, e-mail e senha. A partir dela são especializadas as classes `Passageiro`, `Motorista` e `Administrador`, cada uma com características específicas. O passageiro é responsável pela realização de reservas, enquanto o motorista está associado à condução das viagens.

A classe `Viagem` concentra as principais informações relacionadas a uma viagem, como identificador, data, horários de saída e chegada e quantidade de bagagens restantes. Ela também possui operações para adicionar e remover observadores, enviar notificações, reservar assentos e liberar assentos. Cada viagem é associada a um `Veiculo`, conduzida por um `Motorista` e segue uma determinada `Rota`. Além disso, uma viagem pode possuir uma `ListaEspera` e gerar um `ManifestoEmbarque` contendo a lista de passageiros.

A classe Rota representa o percurso realizado pela viagem, contendo informações como identificador, nome de origem, destino final e linha ou região. A rota é composta por ParadaIntermediaria, que representa possíveis paradas durante o percurso, e por `PrecoTrecho`, responsável por armazenar os valores associados aos diferentes trechos da rota.

A classe `Reserva` representa a reserva realizada pelo passageiro e armazena informações como identificador, quantidade de assentos, ponto de embarque, ponto de desembarque e data da reserva. Uma reserva também pode conter `Bagagem` e possui um estado associado, permitindo controlar as diferentes etapas do seu ciclo de vida.

Para esse controle foi utilizado o padrão de projeto **State**. A classe abstrata `EstadoReserva` define as operações de confirmação e cancelamento, enquanto as classes `ReservaPendenteState`, `ReservaConfirmadaState` e `ReservaCanceladaState` implementam os comportamentos correspondentes a cada estado. Dessa forma, o comportamento da reserva pode variar de acordo com sua situação atual sem concentrar toda a lógica condicional na própria classe Reserva.

O sistema também utiliza o padrão **Observer** para tratar notificações relacionadas às viagens. A interface `IViagemObserver` define a operação de notificação, sendo implementada por `PassageiroObserver`. A classe Viagem mantém uma lista de observadores e pode notificá-los quando ocorre algum evento ou alteração relevante, reduzindo o acoplamento entre a viagem e os usuários que precisam receber as atualizações.

Para o envio das notificações foi aplicado o padrão **Strategy**. A interface `INotificacaoStrategy` estabelece uma operação comum para envio de mensagens, enquanto `WhatsAppNotificacaoStrategy` e `EmailNotificacaoStrategy` fornecem diferentes formas de realizar esse envio. A classe `NotificacaoService` utiliza uma estratégia configurável, possibilitando alterar o meio de comunicação sem modificar a lógica principal do serviço.

Além das entidades do domínio, o diagrama apresenta as classes `ViagemController` e `ReservaController`, responsáveis por intermediar as operações do sistema. O `ViagemController` permite pesquisar viagens e atualizar seus status, enquanto o `ReservaController` concentra as operações de criação e cancelamento de reservas. Para acesso e persistência dos dados, são utilizadas as interfaces `IViagemRepository` e `IReservaRepository`, seguindo uma abordagem baseada no padrão **Repository**.

De maneira geral, o diagrama demonstra uma arquitetura orientada a objetos na qual as responsabilidades são distribuídas entre entidades, controladores, serviços e repositórios. A utilização dos padrões **State, Observer, Strategy e Repository** contribui para diminuir o acoplamento entre as classes, facilitar futuras alterações e tornar o sistema mais organizado, extensível e de fácil manutenção.

# Explicação dos diagramas de atividade

**RF001a – Cadastro.** O passageiro informa nome, CPF, telefone, e-mail e senha. O sistema valida os campos e verifica se CPF ou e-mail já existem. Só então cria a conta, com os dados sensíveis criptografados (RNF003/LGPD).

**RF001b – Login.** O sistema valida as credenciais e inicia uma sessão segura, ou exibe erro de autenticação.

**RF001c – Recuperação de senha.** O sistema gera um link ou código temporário e o envia ao passageiro. Após a redefinição, o link é invalidado. Se a conta não existir, a mensagem é genérica, para não revelar quais contas existem.

**RF002 – Pesquisa de viagens.** O passageiro busca por origem, destino, data e horário. A resposta deve levar menos de 2 s (RNF002). Os resultados podem ser filtrados por horário, preço, avaliação do motorista e disponibilidade.

**RF003 – Detalhes da viagem.** O sistema carrega em paralelo os dados do veículo, do motorista, dos pontos de embarque e desembarque, das paradas e das vagas em tempo real. Depois, o passageiro decide se reserva.

**RF004a – Reserva de assentos.** O passageiro escolhe assentos, pontos de embarque e desembarque e declara as bagagens. O sistema só confirma se houver vagas (RN001) e espaço no bagageiro (RN003). Se não houver vagas, oferece a lista de espera.

**RF004b – Cancelamento.** O sistema verifica o prazo da linha (RN002) para definir o reembolso integral e informa as condições. Se o passageiro confirmar, os assentos são liberados e a lista de espera é acionada.

**RF004c – Reagendamento.** O sistema lista outras viagens da mesma linha. Se houver vaga na nova viagem, cria a nova reserva e cancela a original.

**RF004d – Viagem cancelada pelo motorista.** O sistema busca automaticamente viagens com trecho e horário similares e notifica o passageiro. Se ele aceitar, a nova reserva é criada. Caso contrário, ou se não houver alternativas, a reserva é cancelada com reembolso.

**RF005 – Notificações.** O sistema trata três eventos: confirmação de reserva, proximidade do veículo e atraso ou alteração de rota. Em cada caso, envia a mensagem por WhatsApp ou e-mail e registra a falha para nova tentativa, se houver.

**RF006 – Lista de espera.** Quando a viagem está lotada, o passageiro entra na fila. Ao surgir uma vaga por desistência, o sistema notifica o próximo automaticamente e ele decide se reserva.

**RF007 – Avaliação.** A avaliação só é liberada ao final da viagem e uma única vez. O passageiro dá nota de 1 a 5 e comenta. O sistema recalcula a média do motorista.

**RF008 – Histórico.** O sistema lista viagens realizadas e canceladas, com trajeto, data, valor e motorista. A opção "refazer reserva" reaproveita origem e destino para uma nova busca.

## Administração e operação

**RF009 – Frota.** O proprietário ou administrador cadastra, edita e consulta veículos. A capacidade cadastrada é a base da regra anti-overbooking (RN001).

**RF010 – Motoristas.** O administrador cadastra o motorista com dados pessoais e CNH e o vincula a um veículo e uma rota. O sistema verifica conflitos de agenda antes de registrar o vínculo.

**RF011 – Rotas e linhas.** O administrador ou motorista cria ou edita rotas com origem, destino, paradas, horários e preços por trecho. A rota só é publicada após validação.

**RF012 – Manifesto digital.** O motorista vê a lista de passageiros com embarque, desembarque, assentos, bagagens e status de pagamento. Se o pagamento estiver pendente, ele o confirma no embarque.

**RF013 – Registro manual.** O motorista registra um passageiro de última hora. O sistema valida a capacidade (RN001), bloqueia os assentos e atualiza as vagas em tempo real. Se estiver lotado, recusa o registro, o que evita overbooking.

**RF014 – Alertas de atraso e avaria.** O aviso do motorista é retransmitido a todos os passageiros com reserva ativa na rota. Em caso de avaria, a cooperativa aloca veículo e motorista reserva e o manifesto é transferido automaticamente (RN005).

**RF015 – Comunicados em massa.** A diretoria cria o comunicado, escolhe linhas ou regiões e canais (WhatsApp ou e-mail), e o sistema envia aos passageiros vinculados e registra o status do envio.

**RF016 – Achados e perdidos.** A equipe registra o objeto com foto, data, linha e veículo. A central consulta, contata o dono e marca o item como devolvido ou em guarda.

**RF017 – Relatório de demanda.** A diretoria define período e filtros, e o sistema consolida reservas e solicitações por rota, destino e horário. Com base nisso, a cooperativa decide sobre ajustes na frota ou novas rotas.

**RF018 – Canal oficial.** O sistema publica os horários oficiais. Dúvidas e reservas corporativas chegam à diretoria por um canal direto de atendimento.

**RF019 – Ocorrências internas.** A diretoria registra incidentes vinculados a uma viagem (tipo, descrição, data e hora) e pode consultá-los depois por filtros.
