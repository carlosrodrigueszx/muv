package br.com.muv.repository;

import br.com.muv.model.dto.ViagemConsultaDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public class ViagemConsultaRepository {
    @PersistenceContext
    private EntityManager entityManager;

    public List<ViagemConsultaDTO> pesquisar(String origem, String destino, Date data,
                                               boolean arCondicionado, boolean wifi) {
        String sql = """
            SELECT v.id, v.data_viagem, v.horario_partida, NULL::time AS chegada,
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
