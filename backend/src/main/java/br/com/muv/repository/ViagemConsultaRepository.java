package br.com.muv.repository;

import br.com.muv.model.dto.ViagemConsultaDTO;
import br.com.muv.model.dto.ViagemDetalhesDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Tuple;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public class ViagemConsultaRepository {
    private final EntityManager entityManager;
    private final ObjectMapper objectMapper;

    public ViagemConsultaRepository(EntityManager entityManager, ObjectMapper objectMapper) {
        this.entityManager = entityManager;
        this.objectMapper = objectMapper;
    }

    public Optional<ViagemDetalhesDTO> buscarDetalhes(Long viagemId, String origem, String destino) {
        String sql = """
            SELECT v.id, v.data_viagem, v.horario_partida, v.horario_chegada AS chegada,
                   pro.nome_ponto AS origem, prd.nome_ponto AS destino, tr.valor AS tarifa,
                   v.vagas_restantes, r.nome AS linha, m.nome AS motorista, m.foto AS foto_motorista,
                   m.avaliacao_media, ve.tipo AS tipo_veiculo, ve.modelo AS modelo_veiculo,
                   ve.ano AS ano_veiculo, ve.cor AS cor_veiculo, ve.placa AS placa_veiculo,
                   ve.capacidade_total_passageiros AS capacidade_veiculo,
                   ve.aceita_bagagem, ve.ar_condicionado, ve.wifi, CAST(ve.fotos AS text) AS fotos
              FROM viagem v
              JOIN rota r ON r.id = v.id_rota
              JOIN motorista m ON m.id = v.id_motorista
              JOIN veiculo ve ON ve.id = v.id_veiculo
              JOIN ponto_rota pro ON pro.id_rota = r.id
               AND ((CAST(:origem AS text) IS NULL
                     AND pro.ordem = (SELECT MIN(p.ordem) FROM ponto_rota p WHERE p.id_rota = r.id))
                    OR (CAST(:origem AS text) IS NOT NULL AND lower(pro.nome_ponto) = lower(:origem)))
              JOIN ponto_rota prd ON prd.id_rota = r.id
               AND ((CAST(:destino AS text) IS NULL
                     AND prd.ordem = (SELECT MAX(p.ordem) FROM ponto_rota p WHERE p.id_rota = r.id))
                    OR (CAST(:destino AS text) IS NOT NULL AND lower(prd.nome_ponto) = lower(:destino)))
              JOIN trecho_rota tr ON tr.id_rota = r.id
               AND tr.id_ponto_origem = pro.id AND tr.id_ponto_destino = prd.id
             WHERE v.id = :viagemId AND prd.ordem > pro.ordem
            """;
        List<Tuple> rows = entityManager.createNativeQuery(sql, Tuple.class)
                .setParameter("viagemId", viagemId)
                .setParameter("origem", origem)
                .setParameter("destino", destino)
                .getResultList();
        if (rows.isEmpty()) return Optional.empty();

        Tuple row = rows.getFirst();
        return Optional.of(new ViagemDetalhesDTO(
                ((Number) row.get("id")).longValue(), asLocalDate(row.get("data_viagem")),
                asLocalTime(row.get("horario_partida")),
                row.get("chegada") == null ? null : asLocalTime(row.get("chegada")),
                (String) row.get("origem"), (String) row.get("destino"),
                (java.math.BigDecimal) row.get("tarifa"), ((Number) row.get("vagas_restantes")).longValue(),
                (String) row.get("linha"), (String) row.get("motorista"), (String) row.get("foto_motorista"),
                row.get("avaliacao_media") == null ? null : ((Number) row.get("avaliacao_media")).doubleValue(),
                (String) row.get("tipo_veiculo"), (String) row.get("modelo_veiculo"),
                ((Number) row.get("ano_veiculo")).intValue(), (String) row.get("cor_veiculo"),
                (String) row.get("placa_veiculo"), ((Number) row.get("capacidade_veiculo")).longValue(),
                (Boolean) row.get("aceita_bagagem"), (Boolean) row.get("ar_condicionado"),
                (Boolean) row.get("wifi"), parseFotos((String) row.get("fotos")),
                buscarItinerario(viagemId, (String) row.get("origem"), (String) row.get("destino")),
                buscarAvaliacoes(viagemId)
        ));
    }

    private List<ViagemDetalhesDTO.ParadaDTO> buscarItinerario(Long viagemId, String origem, String destino) {
        String sql = """
            SELECT p.ordem, p.nome_ponto AS nome, p.endereco
              FROM ponto_rota p
              JOIN viagem v ON v.id_rota = p.id_rota
              JOIN ponto_rota pro ON pro.id_rota = p.id_rota
               AND lower(pro.nome_ponto) = lower(:origem)
              JOIN ponto_rota prd ON prd.id_rota = p.id_rota
               AND lower(prd.nome_ponto) = lower(:destino)
             WHERE v.id = :viagemId
               AND p.ordem BETWEEN pro.ordem AND prd.ordem
             ORDER BY p.ordem
            """;
        @SuppressWarnings("unchecked")
        List<Tuple> rows = entityManager.createNativeQuery(sql, Tuple.class)
                .setParameter("viagemId", viagemId)
                .setParameter("origem", origem)
                .setParameter("destino", destino)
                .getResultList();
        return rows.stream().map(row -> new ViagemDetalhesDTO.ParadaDTO(
                ((Number) row.get("ordem")).longValue(), (String) row.get("nome"), (String) row.get("endereco")
        )).toList();
    }

    private List<ViagemDetalhesDTO.AvaliacaoDTO> buscarAvaliacoes(Long viagemId) {
        String sql = """
            SELECT p.nome AS passageiro, a.nota, a.comentario
              FROM avaliacao a
              JOIN passageiro p ON p.id = a.id_passageiro
             WHERE a.id_viagem = :viagemId
             ORDER BY a.id DESC
            """;
        @SuppressWarnings("unchecked")
        List<Tuple> rows = entityManager.createNativeQuery(sql, Tuple.class)
                .setParameter("viagemId", viagemId)
                .getResultList();
        return rows.stream().map(row -> new ViagemDetalhesDTO.AvaliacaoDTO(
                (String) row.get("passageiro"), ((Number) row.get("nota")).doubleValue(),
                (String) row.get("comentario")
        )).toList();
    }

    private List<String> parseFotos(String fotos) {
        if (fotos == null || fotos.isBlank()) return List.of();
        try {
            List<String> parsed = objectMapper.readValue(fotos, new TypeReference<List<String>>() {});
            if (parsed == null) {
                throw new IllegalStateException("A lista de fotos cadastrada para o veículo é inválida.");
            }
            return List.copyOf(parsed);
        } catch (com.fasterxml.jackson.core.JsonProcessingException exception) {
            throw new IllegalStateException("Não foi possível ler as fotos cadastradas para o veículo.", exception);
        }
    }

    public List<ViagemConsultaDTO> pesquisar(String origem, String destino, Date data,
                                               boolean arCondicionado, boolean wifi) {
        String sql = """
            SELECT v.id, v.data_viagem, v.horario_partida, v.horario_chegada AS chegada,
                   pro.nome_ponto AS origem, prd.nome_ponto AS destino,
                   (SELECT string_agg(pv.nome_ponto, ' → ' ORDER BY pv.ordem)
                      FROM ponto_rota pv WHERE pv.id_rota = r.id AND pv.ordem > pro.ordem AND pv.ordem < prd.ordem) AS via,
                   m.nome AS motorista, m.avaliacao_media, ve.modelo, r.nome AS linha,
                   tr.valor AS tarifa, v.vagas_restantes, ve.ar_condicionado, ve.wifi
              FROM viagem v
              JOIN rota r ON r.id = v.id_rota
              JOIN motorista m ON m.id = v.id_motorista
              JOIN veiculo ve ON ve.id = v.id_veiculo
              JOIN trecho_rota tr ON tr.id_rota = r.id
              JOIN ponto_rota pro ON pro.id = tr.id_ponto_origem
              JOIN ponto_rota prd ON prd.id = tr.id_ponto_destino
             WHERE lower(pro.nome_ponto) LIKE lower(:origem)
               AND lower(prd.nome_ponto) LIKE lower(:destino)
               AND (CAST(:data AS date) IS NULL OR v.data_viagem = CAST(:data AS date))
               AND (NOT :arCondicionado OR ve.ar_condicionado)
               AND (NOT :wifi OR ve.wifi)
               AND v.vagas_restantes > 0
               AND prd.ordem > pro.ordem
             ORDER BY v.horario_partida
            """;
        @SuppressWarnings("unchecked")
        List<Tuple> rows = entityManager.createNativeQuery(sql, Tuple.class)
                .setParameter("origem", "%" + origem.trim() + "%")
                .setParameter("destino", "%" + destino.trim() + "%")
                .setParameter("data", data)
                .setParameter("arCondicionado", arCondicionado)
                .setParameter("wifi", wifi)
                .getResultList();
        return rows.stream().map(row -> new ViagemConsultaDTO(
                ((Number) row.get("id")).longValue(), asLocalDate(row.get("data_viagem")),
                asLocalTime(row.get("horario_partida")),
                row.get("chegada") == null ? null : asLocalTime(row.get("chegada")),
                (String) row.get("origem"), (String) row.get("destino"), (String) row.get("via"),
                (String) row.get("motorista"), row.get("avaliacao_media") == null ? null : ((Number) row.get("avaliacao_media")).doubleValue(),
                (String) row.get("modelo"), (String) row.get("linha"), (java.math.BigDecimal) row.get("tarifa"),
                ((Number) row.get("vagas_restantes")).longValue(), (Boolean) row.get("ar_condicionado"), (Boolean) row.get("wifi")
        )).toList();
    }

    private LocalDate asLocalDate(Object value) {
        if (value instanceof LocalDate localDate) return localDate;
        if (value instanceof Date sqlDate) return sqlDate.toLocalDate();
        throw new IllegalArgumentException("Tipo inesperado para data_viagem: " + value.getClass().getName());
    }

    private LocalTime asLocalTime(Object value) {
        if (value instanceof LocalTime localTime) return localTime;
        if (value instanceof Time sqlTime) return sqlTime.toLocalTime();
        throw new IllegalArgumentException("Tipo inesperado para horário: " + value.getClass().getName());
    }
}
