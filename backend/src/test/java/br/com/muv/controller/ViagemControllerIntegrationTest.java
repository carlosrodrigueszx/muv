package br.com.muv.controller;

import br.com.muv.model.dto.ViagemDetalheResponse;
import br.com.muv.service.ViagemService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ViagemController.class)
@AutoConfigureMockMvc
class ViagemControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ViagemService viagemService;

    @Test
    void listarViagens_deveRetornarJsonComDetalhesDaViagemEVeiculoSemLogin() throws Exception {
        when(viagemService.listarTodas()).thenReturn(List.of(criarViagem()));

        mockMvc.perform(get("/api/viagens"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(7))
                .andExpect(jsonPath("$[0].dataViagem").value("2026-11-20"))
                .andExpect(jsonPath("$[0].rota.nome").value("Centro - Aeroporto"))
                .andExpect(jsonPath("$[0].rota.pontos[0].nomePonto").value("Terminal Central"))
                .andExpect(jsonPath("$[0].veiculo.modelo").value("Van Executiva"))
                .andExpect(jsonPath("$[0].veiculo.aceitaBagagem").value(true))
                .andExpect(jsonPath("$[0].motorista.nome").value("João Silva"))
                .andExpect(jsonPath("$[0].motorista.cpf").doesNotExist());

        verify(viagemService).listarTodas();
    }

    @Test
    void buscarViagem_deveRetornarDetalhes() throws Exception {
        when(viagemService.buscarPorId(7L)).thenReturn(criarViagem());

        mockMvc.perform(get("/api/viagens/7").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(7))
                .andExpect(jsonPath("$.horarioPartida").value("08:30:00"))
                .andExpect(jsonPath("$.veiculo.placa").value("ABC1D23"))
                .andExpect(jsonPath("$.veiculo.capacidadeTotalPassageiros").value(15));

        verify(viagemService).buscarPorId(7L);
    }

    @Test
    void buscarViagem_deveRetornar404QuandoNaoExiste() throws Exception {
        when(viagemService.buscarPorId(99L)).thenThrow(
                new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Viagem não encontrada.")
        );

        mockMvc.perform(get("/api/viagens/99"))
                .andExpect(status().isNotFound());

        verify(viagemService).buscarPorId(99L);
    }

    private ViagemDetalheResponse criarViagem() {
        return new ViagemDetalheResponse(
                7L,
                LocalDate.of(2026, 11, 20),
                LocalTime.of(8, 30),
                LocalTime.of(10, 0),
                4L,
                new ViagemDetalheResponse.RotaResponse(
                        2L,
                        "Centro - Aeroporto",
                        "Saída do centro com parada no terminal.",
                        List.of(new ViagemDetalheResponse.PontoRotaResponse(
                                3L, 1L, "Terminal Central", "Rua Principal, 10", null, null
                        ))
                ),
                new ViagemDetalheResponse.VeiculoResponse(
                        5L, "Van", "Van Executiva", (short) 2024, "Branca", "ABC1D23",
                        List.of("https://exemplo.test/van.jpg"), 15L, true, true, false
                ),
                new ViagemDetalheResponse.MotoristaResumoResponse(8L, "João Silva", null)
        );
    }
}
