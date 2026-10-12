-- Horário previsto de chegada da viagem. Permanece nulo para registros antigos
-- até que a cooperativa informe esse dado.
ALTER TABLE Viagem
    ADD COLUMN horario_chegada TIME;
