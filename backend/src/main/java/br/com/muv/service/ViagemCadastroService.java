package br.com.muv.service;

import br.com.muv.model.dto.ViagemCadastroRequestDTO;
import br.com.muv.model.dto.ViagemCadastroResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ViagemCadastroService {
    private final JdbcTemplate jdbc;

    public ViagemCadastroService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Transactional
    public ViagemCadastroResponseDTO cadastrar(ViagemCadastroRequestDTO request) {
        if (!request.horarioChegada().isAfter(request.horarioPartida())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "O horário de chegada deve ser posterior ao horário de partida.");
        }
        if (request.vagas() > request.capacidadeVeiculo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "O número de vagas não pode exceder a capacidade do veículo.");
        }

        Boolean motoristaExiste = jdbc.queryForObject(
                "SELECT EXISTS (SELECT 1 FROM motorista WHERE id = ?)", Boolean.class, request.motoristaId());
        if (!Boolean.TRUE.equals(motoristaExiste)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Motorista não encontrado.");
        }

        Boolean placaEmUso = jdbc.queryForObject(
                "SELECT EXISTS (SELECT 1 FROM veiculo WHERE placa = ?)", Boolean.class, request.placaVeiculo());
        if (Boolean.TRUE.equals(placaEmUso)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um veículo cadastrado com essa placa.");
        }

        Long veiculoId = jdbc.queryForObject("""
                INSERT INTO veiculo (tipo, modelo, ano, cor, placa, capacidade_total_passageiros,
                                     aceita_bagagem, ar_condicionado, wifi)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                RETURNING id
                """, Long.class,
                request.tipoVeiculo(), request.modeloVeiculo(), request.anoVeiculo(), request.corVeiculo(),
                request.placaVeiculo(), request.capacidadeVeiculo(), request.aceitaBagagem(),
                request.arCondicionado(), request.wifi());

        Long rotaId = jdbc.queryForObject("INSERT INTO rota (nome) VALUES (?) RETURNING id",
                Long.class, request.nomeRota());
        Long origemId = inserirPonto(rotaId, 1, request.origem());
        long ordemDestino = 2;
        if (request.paradaIntermediaria() != null && !request.paradaIntermediaria().isBlank()) {
            inserirPonto(rotaId, 2, request.paradaIntermediaria().trim());
            ordemDestino = 3;
        }
        Long destinoId = inserirPonto(rotaId, ordemDestino, request.destino());

        jdbc.update("""
                INSERT INTO trecho_rota (id_rota, id_ponto_origem, id_ponto_destino, valor)
                VALUES (?, ?, ?, ?)
                """, rotaId, origemId, destinoId, request.tarifa());

        Long viagemId = jdbc.queryForObject("""
                INSERT INTO viagem (data_viagem, horario_partida, horario_chegada, vagas_restantes,
                                    id_rota, id_veiculo, id_motorista)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                RETURNING id
                """, Long.class, request.data(), request.horarioPartida(), request.horarioChegada(),
                request.vagas(), rotaId, veiculoId, request.motoristaId());

        return new ViagemCadastroResponseDTO(viagemId);
    }

    private Long inserirPonto(Long rotaId, long ordem, String nome) {
        return jdbc.queryForObject("""
                INSERT INTO ponto_rota (id_rota, ordem, nome_ponto)
                VALUES (?, ?, ?)
                RETURNING id
                """, Long.class, rotaId, ordem, nome.trim());
    }
}

