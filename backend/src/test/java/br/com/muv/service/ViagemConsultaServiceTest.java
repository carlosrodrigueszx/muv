package br.com.muv.service;

import br.com.muv.model.dto.ViagemConsultaDTO;
import br.com.muv.repository.ViagemConsultaRepository;
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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ViagemConsultaServiceTest {
    @Mock ViagemConsultaRepository repository;
    @InjectMocks ViagemConsultaService service;

    @Test
    void pesquisarDeveRepassarCriteriosEDevolverViagensEncontradas() {
        Date data = Date.valueOf(LocalDate.of(2026, 10, 12));
        ViagemConsultaDTO viagem = new ViagemConsultaDTO(
                1L, data.toLocalDate(), LocalTime.of(14, 30), LocalTime.of(15, 30),
                "Fortaleza", "Pacajus", null, "Raimundo Silva", 4.9,
                "Van executiva", "LINHA 101 DIRETA", new BigDecimal("18.50"),
                4L, true, false);
        when(repository.pesquisar("Fortaleza", "Pacajus", data, true, false))
                .thenReturn(List.of(viagem));

        List<ViagemConsultaDTO> result = service.pesquisar("Fortaleza", "Pacajus", data, true, false);

        assertEquals(List.of(viagem), result);
        verify(repository).pesquisar("Fortaleza", "Pacajus", data, true, false);
    }
}
