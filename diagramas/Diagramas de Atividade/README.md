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

