ALTER TABLE viagem
    ADD COLUMN horario_chegada TIME;

UPDATE viagem
SET horario_chegada = horario_partida
WHERE horario_chegada IS NULL;

ALTER TABLE viagem
    ALTER COLUMN horario_chegada SET NOT NULL;

ALTER TABLE veiculo
    ADD COLUMN ar_condicionado BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN wifi BOOLEAN NOT NULL DEFAULT FALSE;
