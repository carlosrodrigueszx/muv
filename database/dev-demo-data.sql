-- Dados fictícios para a tela de busca de viagens no ambiente local.
-- Pode ser executado novamente: procura os registros por seus identificadores de demonstração.
-- Não usar como dados reais de passageiros, motoristas ou autenticação.

BEGIN;

DO $$
DECLARE
    motorista_1_id BIGINT;
    motorista_2_id BIGINT;
    motorista_3_id BIGINT;
    veiculo_1_id BIGINT;
    veiculo_2_id BIGINT;
    veiculo_3_id BIGINT;
    rota_1_id BIGINT;
    rota_2_id BIGINT;
    rota_3_id BIGINT;
    origem_1_id BIGINT;
    destino_1_id BIGINT;
    origem_2_id BIGINT;
    horizonte_2_id BIGINT;
    destino_2_id BIGINT;
    origem_3_id BIGINT;
    itaitinga_3_id BIGINT;
    destino_3_id BIGINT;
BEGIN
    -- Motoristas fictícios (as senhas são marcadores, não credenciais válidas).
    SELECT id INTO motorista_1_id FROM motorista WHERE email = 'demo.raimundo@muv.local';
    IF motorista_1_id IS NULL THEN
        INSERT INTO motorista (nome, cpf, cnh, telefone, avaliacao_media, email, senha_hash)
        VALUES ('Raimundo Silva', '90000000001', '90000000001', '(85) 90000-0001', 4.9,
                'demo.raimundo@muv.local', 'DEMO-ONLY-NOT-A-LOGIN-HASH') RETURNING id INTO motorista_1_id;
    END IF;

    SELECT id INTO motorista_2_id FROM motorista WHERE email = 'demo.joao@muv.local';
    IF motorista_2_id IS NULL THEN
        INSERT INTO motorista (nome, cpf, cnh, telefone, avaliacao_media, email, senha_hash)
        VALUES ('João Paulo', '90000000002', '90000000002', '(85) 90000-0002', 4.8,
                'demo.joao@muv.local', 'DEMO-ONLY-NOT-A-LOGIN-HASH') RETURNING id INTO motorista_2_id;
    END IF;

    SELECT id INTO motorista_3_id FROM motorista WHERE email = 'demo.carlos@muv.local';
    IF motorista_3_id IS NULL THEN
        INSERT INTO motorista (nome, cpf, cnh, telefone, avaliacao_media, email, senha_hash)
        VALUES ('Carlos Lima', '90000000003', '90000000003', '(85) 90000-0003', 4.7,
                'demo.carlos@muv.local', 'DEMO-ONLY-NOT-A-LOGIN-HASH') RETURNING id INTO motorista_3_id;
    END IF;

    -- Todos têm ar-condicionado; o segundo veículo também oferece Wi-Fi.
    SELECT id INTO veiculo_1_id FROM veiculo WHERE placa = 'DEM0001';
    IF veiculo_1_id IS NULL THEN
        INSERT INTO veiculo (tipo, modelo, ano, cor, placa, capacidade_total_passageiros, aceita_bagagem, ar_condicionado, wifi)
        VALUES ('VAN', 'Renault Master Executiva', 2023, 'Branca', 'DEM0001', 15, TRUE, TRUE, FALSE)
        RETURNING id INTO veiculo_1_id;
    END IF;

    SELECT id INTO veiculo_2_id FROM veiculo WHERE placa = 'DEM0002';
    IF veiculo_2_id IS NULL THEN
        INSERT INTO veiculo (tipo, modelo, ano, cor, placa, capacidade_total_passageiros, aceita_bagagem, ar_condicionado, wifi)
        VALUES ('MICRO-ONIBUS', 'Mercedes Sprinter', 2022, 'Prata', 'DEM0002', 20, TRUE, TRUE, TRUE)
        RETURNING id INTO veiculo_2_id;
    END IF;

    SELECT id INTO veiculo_3_id FROM veiculo WHERE placa = 'DEM0003';
    IF veiculo_3_id IS NULL THEN
        INSERT INTO veiculo (tipo, modelo, ano, cor, placa, capacidade_total_passageiros, aceita_bagagem, ar_condicionado, wifi)
        VALUES ('VAN', 'Fiat Ducato Maxicargo', 2024, 'Prata', 'DEM0003', 16, TRUE, TRUE, FALSE)
        RETURNING id INTO veiculo_3_id;
    END IF;

    SELECT id INTO rota_1_id FROM rota WHERE nome = 'LINHA 101 DIRETA';
    IF rota_1_id IS NULL THEN
        INSERT INTO rota (nome, descricao) VALUES ('LINHA 101 DIRETA', 'Rota fictícia de demonstração Fortaleza–Pacajus')
        RETURNING id INTO rota_1_id;
    END IF;
    SELECT id INTO origem_1_id FROM ponto_rota WHERE id_rota = rota_1_id AND ordem = 1;
    IF origem_1_id IS NULL THEN
        INSERT INTO ponto_rota (id_rota, ordem, nome_ponto, endereco)
        VALUES (rota_1_id, 1, 'Fortaleza (Terminal Messejana)', 'Terminal Messejana, Fortaleza - CE') RETURNING id INTO origem_1_id;
    END IF;
    SELECT id INTO destino_1_id FROM ponto_rota WHERE id_rota = rota_1_id AND ordem = 2;
    IF destino_1_id IS NULL THEN
        INSERT INTO ponto_rota (id_rota, ordem, nome_ponto, endereco)
        VALUES (rota_1_id, 2, 'Pacajus (Centro / Rodoviária)', 'Centro, Pacajus - CE') RETURNING id INTO destino_1_id;
    END IF;
    INSERT INTO trecho_rota (id_rota, id_ponto_origem, id_ponto_destino, valor)
    VALUES (rota_1_id, origem_1_id, destino_1_id, 18.50)
    ON CONFLICT (id_rota, id_ponto_origem, id_ponto_destino) DO NOTHING;

    SELECT id INTO rota_2_id FROM rota WHERE nome = 'LINHA 104 CONVENCIONAL';
    IF rota_2_id IS NULL THEN
        INSERT INTO rota (nome, descricao) VALUES ('LINHA 104 CONVENCIONAL', 'Rota fictícia com parada em Horizonte')
        RETURNING id INTO rota_2_id;
    END IF;
    SELECT id INTO origem_2_id FROM ponto_rota WHERE id_rota = rota_2_id AND ordem = 1;
    IF origem_2_id IS NULL THEN
        INSERT INTO ponto_rota (id_rota, ordem, nome_ponto, endereco)
        VALUES (rota_2_id, 1, 'Fortaleza (Terminal Messejana)', 'Terminal Messejana, Fortaleza - CE') RETURNING id INTO origem_2_id;
    END IF;
    SELECT id INTO horizonte_2_id FROM ponto_rota WHERE id_rota = rota_2_id AND ordem = 2;
    IF horizonte_2_id IS NULL THEN
        INSERT INTO ponto_rota (id_rota, ordem, nome_ponto, endereco)
        VALUES (rota_2_id, 2, 'Horizonte (Centro)', 'Centro, Horizonte - CE') RETURNING id INTO horizonte_2_id;
    END IF;
    SELECT id INTO destino_2_id FROM ponto_rota WHERE id_rota = rota_2_id AND ordem = 3;
    IF destino_2_id IS NULL THEN
        INSERT INTO ponto_rota (id_rota, ordem, nome_ponto, endereco)
        VALUES (rota_2_id, 3, 'Pacajus (Centro / Rodoviária)', 'Centro, Pacajus - CE') RETURNING id INTO destino_2_id;
    END IF;
    INSERT INTO trecho_rota (id_rota, id_ponto_origem, id_ponto_destino, valor)
    VALUES (rota_2_id, origem_2_id, destino_2_id, 17.00)
    ON CONFLICT (id_rota, id_ponto_origem, id_ponto_destino) DO NOTHING;

    SELECT id INTO rota_3_id FROM rota WHERE nome = 'LINHA 101 SEMI-EXPRESSO';
    IF rota_3_id IS NULL THEN
        INSERT INTO rota (nome, descricao) VALUES ('LINHA 101 SEMI-EXPRESSO', 'Rota fictícia com parada em Itaitinga')
        RETURNING id INTO rota_3_id;
    END IF;
    SELECT id INTO origem_3_id FROM ponto_rota WHERE id_rota = rota_3_id AND ordem = 1;
    IF origem_3_id IS NULL THEN
        INSERT INTO ponto_rota (id_rota, ordem, nome_ponto, endereco)
        VALUES (rota_3_id, 1, 'Fortaleza (Terminal Messejana)', 'Terminal Messejana, Fortaleza - CE') RETURNING id INTO origem_3_id;
    END IF;
    SELECT id INTO itaitinga_3_id FROM ponto_rota WHERE id_rota = rota_3_id AND ordem = 2;
    IF itaitinga_3_id IS NULL THEN
        INSERT INTO ponto_rota (id_rota, ordem, nome_ponto, endereco)
        VALUES (rota_3_id, 2, 'Itaitinga (Centro)', 'Centro, Itaitinga - CE') RETURNING id INTO itaitinga_3_id;
    END IF;
    SELECT id INTO destino_3_id FROM ponto_rota WHERE id_rota = rota_3_id AND ordem = 3;
    IF destino_3_id IS NULL THEN
        INSERT INTO ponto_rota (id_rota, ordem, nome_ponto, endereco)
        VALUES (rota_3_id, 3, 'Pacajus (Centro / Rodoviária)', 'Centro, Pacajus - CE') RETURNING id INTO destino_3_id;
    END IF;
    INSERT INTO trecho_rota (id_rota, id_ponto_origem, id_ponto_destino, valor)
    VALUES (rota_3_id, origem_3_id, destino_3_id, 18.50)
    ON CONFLICT (id_rota, id_ponto_origem, id_ponto_destino) DO NOTHING;

    -- Partidas para hoje, para que coincidam com a data inicial da tela.
    INSERT INTO viagem (data_viagem, horario_partida, vagas_restantes, id_rota, id_veiculo, id_motorista)
    SELECT CURRENT_DATE, TIME '14:30', 4, rota_1_id, veiculo_1_id, motorista_1_id
    WHERE NOT EXISTS (SELECT 1 FROM viagem WHERE id_rota = rota_1_id AND data_viagem = CURRENT_DATE AND horario_partida = TIME '14:30');
    INSERT INTO viagem (data_viagem, horario_partida, vagas_restantes, id_rota, id_veiculo, id_motorista)
    SELECT CURRENT_DATE, TIME '15:15', 7, rota_2_id, veiculo_2_id, motorista_2_id
    WHERE NOT EXISTS (SELECT 1 FROM viagem WHERE id_rota = rota_2_id AND data_viagem = CURRENT_DATE AND horario_partida = TIME '15:15');
    INSERT INTO viagem (data_viagem, horario_partida, vagas_restantes, id_rota, id_veiculo, id_motorista)
    SELECT CURRENT_DATE, TIME '16:00', 9, rota_3_id, veiculo_3_id, motorista_3_id
    WHERE NOT EXISTS (SELECT 1 FROM viagem WHERE id_rota = rota_3_id AND data_viagem = CURRENT_DATE AND horario_partida = TIME '16:00');
END;
$$;

COMMIT;
