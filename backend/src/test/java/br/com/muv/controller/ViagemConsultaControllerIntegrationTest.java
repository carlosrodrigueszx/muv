package br.com.muv.controller;

import br.com.muv.model.dto.ViagemCadastroResponseDTO;
import br.com.muv.model.dto.ViagemConsultaDTO;
import br.com.muv.service.ViagemCadastroService;
import br.com.muv.service.ViagemConsultaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ViagemConsultaController.class)
@AutoConfigureMockMvc(addFilters = false)
class ViagemConsultaControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ViagemConsultaService consultaService;

    @MockitoBean
    private ViagemCadastroService cadastroService;

    @Test
    void cadastrar_deveAceitarPayloadDaTelaERetornarIdCriado() throws Exception {
        when(cadastroService.cadastrar(org.mockito.ArgumentMatchers.any()))
                .thenReturn(new ViagemCadastroResponseDTO(42L));

        mockMvc.perform(post("/api/viagens")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "motoristaId": 4,
                                  "nomeRota": "Linha Centro-Pacajus",
                                  "origem": "Fortaleza",
                                  "paradaIntermediaria": "Horizonte",
                                  "destino": "Pacajus",
                                  "data": "2026-11-20",
                                  "horarioPartida": "08:00",
                                  "horarioChegada": "09:00",
                                  "tarifa": 25.50,
                                  "vagas": 12,
                                  "tipoVeiculo": "VAN",
                                  "modeloVeiculo": "Van Executiva",
                                  "anoVeiculo": 2024,
                                  "corVeiculo": "Branca",
                                  "placaVeiculo": "ABC1D23",
                                  "capacidadeVeiculo": 15,
                                  "aceitaBagagem": true,
                                  "arCondicionado": true,
                                  "wifi": false
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(42));

        verify(cadastroService).cadastrar(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void cadastrar_deveRejeitarPayloadInvalido() throws Exception {
        mockMvc.perform(post("/api/viagens")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nomeRota\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void pesquisar_deveRetornarResultadosNoFormatoEsperadoPelaTela() throws Exception {
        var resultado = new ViagemConsultaDTO(
                9L, LocalDate.of(2026, 11, 20), LocalTime.of(8, 0), LocalTime.of(9, 0),
                "Fortaleza", "Pacajus", "Horizonte", "João Silva", 4.8, "Van Executiva",
                "Linha 101", new BigDecimal("25.50"), 10L, true, false
        );
        when(consultaService.pesquisar("Fortaleza", "Pacajus", java.sql.Date.valueOf("2026-11-20"), true, false))
                .thenReturn(List.of(resultado));

        mockMvc.perform(get("/api/viagens/consulta")
                        .param("origem", "Fortaleza")
                        .param("destino", "Pacajus")
                        .param("data", "2026-11-20")
                        .param("arCondicionado", "true")
                        .param("wifi", "false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(9))
                .andExpect(jsonPath("$[0].partida").value("08:00:00"))
                .andExpect(jsonPath("$[0].chegada").value("09:00:00"))
                .andExpect(jsonPath("$[0].tarifa").value(25.50))
                .andExpect(jsonPath("$[0].arCondicionado").value(true))
                .andExpect(jsonPath("$[0].wifi").value(false));

        verify(consultaService).pesquisar("Fortaleza", "Pacajus", java.sql.Date.valueOf("2026-11-20"), true, false);
    }
}
