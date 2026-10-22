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

