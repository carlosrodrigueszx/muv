package br.com.muv.service;

import br.com.muv.model.dto.ViagemCadastroRequestDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ViagemCadastroServiceTest {

    @Mock
    private JdbcTemplate jdbc;

    @InjectMocks
    private ViagemCadastroService service;

    @Test
    void cadastrar_devePersistirVeiculoRotaPontosETrecho() {
        when(jdbc.queryForObject(contains("SELECT EXISTS (SELECT 1 FROM motorista"), eq(Boolean.class), any(Object[].class)))
                .thenReturn(true);
        when(jdbc.queryForObject(contains("SELECT EXISTS (SELECT 1 FROM veiculo"), eq(Boolean.class), any(Object[].class)))
                .thenReturn(false);
        when(jdbc.queryForObject(contains("INSERT INTO veiculo"), eq(Long.class), any(Object[].class)))
                .thenReturn(10L);
        when(jdbc.queryForObject(contains("INSERT INTO rota"), eq(Long.class), any(Object[].class)))
                .thenReturn(20L);
        when(jdbc.queryForObject(contains("INSERT INTO ponto_rota"), eq(Long.class), any(Object[].class)))
                .thenReturn(21L, 22L, 23L);
        when(jdbc.queryForObject(contains("INSERT INTO viagem"), eq(Long.class), any(Object[].class)))
                .thenReturn(30L);

        var resposta = service.cadastrar(request(LocalTime.of(8, 0), LocalTime.of(10, 0), 12L, 15L));

        assertEquals(30L, resposta.id());
        verify(jdbc).update(contains("INSERT INTO trecho_rota"), eq(20L), eq(21L), eq(23L), eq(new BigDecimal("25.50")));
    }

    @Test
    void cadastrar_deveRejeitarChegadaAntesOuIgualAPartida() {
        ResponseStatusException erro = assertThrows(ResponseStatusException.class,
                () -> service.cadastrar(request(LocalTime.of(10, 0), LocalTime.of(10, 0), 12L, 15L)));

        assertEquals(400, erro.getStatusCode().value());
        verifyNoInteractions(jdbc);
    }

    @Test
    void cadastrar_deveRejeitarMaisVagasQueCapacidade() {
        ResponseStatusException erro = assertThrows(ResponseStatusException.class,
                () -> service.cadastrar(request(LocalTime.of(8, 0), LocalTime.of(10, 0), 16L, 15L)));

        assertEquals(400, erro.getStatusCode().value());
        verifyNoInteractions(jdbc);
    }

    private ViagemCadastroRequestDTO request(LocalTime partida, LocalTime chegada, long vagas, long capacidade) {
        return new ViagemCadastroRequestDTO(
                4L, "Linha Centro-Pacajus", "Fortaleza", "Horizonte", "Pacajus",
                LocalDate.of(2026, 11, 20), partida, chegada, new BigDecimal("25.50"), vagas,
                "VAN", "Van Executiva", 2024, "Branca", "ABC1D23", capacidade,
                true, true, false
        );
    }
}
