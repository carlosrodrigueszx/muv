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

    @Mock
    private ViagemConsultaRepository repository;

    @InjectMocks
    private ViagemConsultaService service;

    @Test
    void pesquisar_deveEncaminharFiltrosERetornarResultados() {
        Date data = Date.valueOf(LocalDate.of(2026, 11, 20));
        List<ViagemConsultaDTO> esperadas = List.of(new ViagemConsultaDTO(
                1L, LocalDate.of(2026, 11, 20), LocalTime.of(8, 0), LocalTime.of(9, 0),
                "Fortaleza", "Pacajus", "Horizonte", "João", 4.8, "Van Executiva",
                "Linha 101", new BigDecimal("25.50"), 10L, true, false
        ));
        when(repository.pesquisar("Fortaleza", "Pacajus", data, true, false)).thenReturn(esperadas);

        assertEquals(esperadas, service.pesquisar("Fortaleza", "Pacajus", data, true, false));

        verify(repository).pesquisar("Fortaleza", "Pacajus", data, true, false);
    }
}
