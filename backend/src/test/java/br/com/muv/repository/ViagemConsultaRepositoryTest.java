package br.com.muv.repository;

import br.com.muv.model.dto.ViagemConsultaDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.persistence.Tuple;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ViagemConsultaRepositoryTest {
    @Mock EntityManager entityManager;
    @Mock Query query;
    @Mock Tuple row;
    @InjectMocks ViagemConsultaRepository repository;

    @Test
    void pesquisarDeveMapearDataEHorariosRetornadosComoTiposJavaTime() {
        LocalDate data = LocalDate.of(2026, 10, 12);
        LocalTime partida = LocalTime.of(14, 30);
        LocalTime chegada = LocalTime.of(15, 30);

        when(entityManager.createNativeQuery(anyString(), eq(Tuple.class))).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        when(query.getResultList()).thenReturn(List.of(row));
        when(row.get("id")).thenReturn(21L);
        when(row.get("data_viagem")).thenReturn(data);
        when(row.get("horario_partida")).thenReturn(partida);
        when(row.get("chegada")).thenReturn(chegada);
        when(row.get("origem")).thenReturn("Fortaleza (Terminal Messejana)");
        when(row.get("destino")).thenReturn("Pacajus (Centro / Rodoviária)");
        when(row.get("via")).thenReturn(null);
        when(row.get("motorista")).thenReturn("Raimundo Silva");
        when(row.get("avaliacao_media")).thenReturn(4.9d);
        when(row.get("modelo")).thenReturn("Van executiva");
        when(row.get("linha")).thenReturn("LINHA 101 DIRETA");
        when(row.get("tarifa")).thenReturn(new BigDecimal("18.50"));
        when(row.get("vagas_restantes")).thenReturn(4L);
        when(row.get("ar_condicionado")).thenReturn(true);
        when(row.get("wifi")).thenReturn(false);

        List<ViagemConsultaDTO> result = repository.pesquisar(
                "Fortaleza", "Pacajus", Date.valueOf(data), true, false);

        assertEquals(1, result.size());
        assertEquals(data, result.getFirst().data());
        assertEquals(partida, result.getFirst().partida());
        assertEquals(chegada, result.getFirst().chegada());
        assertEquals(new BigDecimal("18.50"), result.getFirst().tarifa());
        assertEquals(4L, result.getFirst().vagas());
        verify(query).setParameter("data", Date.valueOf(data));
        verify(query).setParameter("arCondicionado", true);
        verify(query).setParameter("wifi", false);
    }
}
