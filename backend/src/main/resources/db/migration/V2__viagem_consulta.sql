-- Recursos usados pelos filtros rápidos da tela de consulta de viagens.
ALTER TABLE Veiculo
    ADD COLUMN ar_condicionado BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN wifi BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX idx_viagem_data_partida ON Viagem (data_viagem, horario_partida);
CREATE INDEX idx_ponto_rota_nome ON Ponto_Rota (lower(nome_ponto));
