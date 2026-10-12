CREATE TABLE Motorista
(
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome            VARCHAR(255) NOT NULL,
    cpf             CHAR(11)     NOT NULL UNIQUE,
    cnh             CHAR(11)     NOT NULL UNIQUE,
    telefone        VARCHAR(20)  NOT NULL,
    foto            VARCHAR(255),
    avaliacao_media FLOAT,
    email           VARCHAR(255) NOT NULL UNIQUE,
    senha_hash      VARCHAR(255) NOT NULL,

    CONSTRAINT ck_motorista_avaliacao
        CHECK (
            avaliacao_media IS NULL
                OR avaliacao_media BETWEEN 0 AND 5
            )
);

CREATE TABLE Veiculo
(
    id                           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo                         VARCHAR(32) NOT NULL,
    modelo                       VARCHAR(64) NOT NULL,
    ano                          SMALLINT    NOT NULL,
    cor                          VARCHAR(32) NOT NULL,
    placa                        VARCHAR(7)  NOT NULL UNIQUE,
    fotos                        JSONB,
    capacidade_total_passageiros BIGINT      NOT NULL,
    aceita_bagagem               BOOLEAN     NOT NULL DEFAULT TRUE,

    CONSTRAINT ck_veiculo_ano
        CHECK (ano BETWEEN 1900 AND 2100),

    CONSTRAINT ck_veiculo_capacidade
        CHECK (capacidade_total_passageiros > 0)
);

-- =====================================================
-- ROTAS E TRECHOS
-- =====================================================

CREATE TABLE Rota
(
    id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome      VARCHAR(255) NOT NULL,
    descricao VARCHAR(500)
);

-- Pontos de parada ordenados dentro de cada rota.
CREATE TABLE Ponto_Rota
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_rota     BIGINT       NOT NULL,
    ordem       BIGINT       NOT NULL,
    nome_ponto  VARCHAR(255) NOT NULL,
    endereco    VARCHAR(500),
    latitude    NUMERIC(10, 7),
    longitude   NUMERIC(10, 7),

    CONSTRAINT fk_ponto_rota
        FOREIGN KEY (id_rota)
            REFERENCES Rota (id),

    CONSTRAINT uq_rota_ordem
        UNIQUE (id_rota, ordem),

    CONSTRAINT uq_rota_ponto
        UNIQUE (id_rota, id),

    CONSTRAINT ck_ponto_ordem
        CHECK (ordem > 0),

    CONSTRAINT ck_ponto_latitude
        CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),

    CONSTRAINT ck_ponto_longitude
        CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180)
);

-- Cada trecho possui origem, destino e preço.
-- Podem existir tarifas entre pontos não consecutivos.
CREATE TABLE Trecho_Rota
(
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_rota          BIGINT         NOT NULL,
    id_ponto_origem  BIGINT         NOT NULL,
    id_ponto_destino BIGINT         NOT NULL,
    valor            NUMERIC(10, 2) NOT NULL,

    CONSTRAINT fk_trecho_rota
        FOREIGN KEY (id_rota)
            REFERENCES Rota (id),

    CONSTRAINT fk_trecho_origem
        FOREIGN KEY (id_rota, id_ponto_origem)
            REFERENCES Ponto_Rota (id_rota, id),

    CONSTRAINT fk_trecho_destino
        FOREIGN KEY (id_rota, id_ponto_destino)
            REFERENCES Ponto_Rota (id_rota, id),

    CONSTRAINT uq_trecho_tarifa
        UNIQUE (id_rota, id_ponto_origem, id_ponto_destino),

    CONSTRAINT uq_trecho_rota_id
        UNIQUE (id, id_rota),

    CONSTRAINT ck_trecho_pontos
        CHECK (id_ponto_origem <> id_ponto_destino),

    CONSTRAINT ck_trecho_valor
        CHECK (valor >= 0)
);

-- =====================================================
-- PASSAGEIROS
-- =====================================================

CREATE TABLE Passageiro
(
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome       VARCHAR(255) NOT NULL,
    cpf        CHAR(11)     NOT NULL UNIQUE,
    telefone   VARCHAR(20)  NOT NULL,
    foto       VARCHAR(255),
    email      VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL
);

-- =====================================================
-- VIAGENS
-- =====================================================

CREATE TABLE Viagem
(
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    data_viagem     DATE NOT NULL,
    horario_partida TIME NOT NULL,
    vagas_restantes BIGINT NOT NULL,
    id_rota         BIGINT NOT NULL,
    id_veiculo      BIGINT NOT NULL,
    id_motorista    BIGINT NOT NULL,

    CONSTRAINT fk_viagem_rota
        FOREIGN KEY (id_rota)
            REFERENCES Rota (id),

    CONSTRAINT fk_viagem_veiculo
        FOREIGN KEY (id_veiculo)
            REFERENCES Veiculo (id),

    CONSTRAINT fk_viagem_motorista
        FOREIGN KEY (id_motorista)
            REFERENCES Motorista (id),

    CONSTRAINT uq_viagem_rota
        UNIQUE (id, id_rota),

    CONSTRAINT ck_viagem_vagas
        CHECK (vagas_restantes >= 0)
);

-- =====================================================
-- RESERVAS
-- =====================================================

CREATE TABLE Reserva
(
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    quantidade_assentos BIGINT         NOT NULL,
    quantidade_bagagens BIGINT         NOT NULL DEFAULT 0,
    status_reserva      VARCHAR(32)    NOT NULL DEFAULT 'PENDENTE',
    status_pagamento    VARCHAR(32)    NOT NULL DEFAULT 'PENDENTE',
    valor_pago          NUMERIC(10, 2) NOT NULL,
    data_reserva        TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_passageiro       BIGINT         NOT NULL,
    id_viagem           BIGINT         NOT NULL,
    id_trecho           BIGINT         NOT NULL,
    id_rota             BIGINT         NOT NULL,

    CONSTRAINT fk_reserva_passageiro
        FOREIGN KEY (id_passageiro)
            REFERENCES Passageiro (id),

    CONSTRAINT fk_reserva_viagem_rota
        FOREIGN KEY (id_viagem, id_rota)
            REFERENCES Viagem (id, id_rota),

    CONSTRAINT fk_reserva_trecho_rota
        FOREIGN KEY (id_trecho, id_rota)
            REFERENCES Trecho_Rota (id, id_rota),

    CONSTRAINT ck_reserva_assentos
        CHECK (quantidade_assentos > 0),

    CONSTRAINT ck_reserva_bagagens
        CHECK (quantidade_bagagens >= 0),

    CONSTRAINT ck_reserva_valor
        CHECK (valor_pago >= 0)
);

-- =====================================================
-- AVALIAÇÕES
-- =====================================================

CREATE TABLE Avaliacao
(
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nota          NUMERIC(3, 2) NOT NULL,
    comentario    VARCHAR(500),
    id_passageiro BIGINT        NOT NULL,
    id_viagem     BIGINT        NOT NULL,

    CONSTRAINT fk_avaliacao_passageiro
        FOREIGN KEY (id_passageiro)
            REFERENCES Passageiro (id),

    CONSTRAINT fk_avaliacao_viagem
        FOREIGN KEY (id_viagem)
            REFERENCES Viagem (id),

    CONSTRAINT uq_avaliacao_passageiro_viagem
        UNIQUE (id_passageiro, id_viagem),

    CONSTRAINT ck_avaliacao_nota
        CHECK (nota BETWEEN 1 AND 5)
);

-- =====================================================
-- OCORRÊNCIAS
-- =====================================================

CREATE TABLE Ocorrencia
(
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo          VARCHAR(128) NOT NULL,
    descricao     VARCHAR(500) NOT NULL,
    data_registro TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_viagem     BIGINT       NOT NULL,

    CONSTRAINT fk_ocorrencia_viagem
        FOREIGN KEY (id_viagem)
            REFERENCES Viagem (id)
);

-- =====================================================
-- FRETES E ENCOMENDAS
-- =====================================================

CREATE TABLE Frete_Encomenda
(
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    remetente        VARCHAR(255)   NOT NULL,
    destinatario     VARCHAR(255)   NOT NULL,
    ponto_coleta     VARCHAR(255)   NOT NULL,
    ponto_entrega    VARCHAR(255)   NOT NULL,
    descricao_pacote VARCHAR(255)   NOT NULL,
    valor_cobrado    NUMERIC(10, 2) NOT NULL,
    status_encomenda VARCHAR(32)    NOT NULL DEFAULT 'PENDENTE',
    id_viagem        BIGINT         NOT NULL,

    CONSTRAINT fk_frete_viagem
        FOREIGN KEY (id_viagem)
            REFERENCES Viagem (id),

    CONSTRAINT ck_frete_valor
        CHECK (valor_cobrado >= 0)
);

-- =====================================================
-- LISTA DE ESPERA
-- =====================================================

CREATE TABLE Lista_Espera
(
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    data_entrada  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status        VARCHAR(32) NOT NULL DEFAULT 'AGUARDANDO',
    id_viagem     BIGINT      NOT NULL,
    id_passageiro BIGINT      NOT NULL,

    CONSTRAINT fk_lista_viagem
        FOREIGN KEY (id_viagem)
            REFERENCES Viagem (id),

    CONSTRAINT fk_lista_passageiro
        FOREIGN KEY (id_passageiro)
            REFERENCES Passageiro (id),

    CONSTRAINT uq_lista_viagem_passageiro
        UNIQUE (id_viagem, id_passageiro)
);

-- =====================================================
-- ACHADOS E PERDIDOS
-- =====================================================

CREATE TABLE Achados_Perdidos
(
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descricao     VARCHAR(500),
    foto_item     VARCHAR(255),
    data_registro TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status        VARCHAR(32) NOT NULL DEFAULT 'NAO_RECLAMADO',
    id_viagem     BIGINT      NOT NULL,

    CONSTRAINT fk_achado_viagem
        FOREIGN KEY (id_viagem)
            REFERENCES Viagem (id)
);