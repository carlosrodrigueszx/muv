package br.com.muv.service;

import br.com.muv.repository.ViagemRepository;
import br.com.muv.model.entity.Viagem;
import br.com.muv.model.entity.Rota;
import br.com.muv.model.entity.Veiculo;
import br.com.muv.model.entity.Motorista;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ViagemServiceTest {

    @Mock
    private ViagemRepository viagemRepository;

    @InjectMocks
    private ViagemService viagemService;

    @Test
    void listarTodas_deveRetornarListaVaziaQuandoNaoHaViagens() {
        when(viagemRepository.findAllByOrderByDataViagemAscHorarioPartidaAsc())
                .thenReturn(List.of());

        assertEquals(List.of(), viagemService.listarTodas());
        verify(viagemRepository).findAllByOrderByDataViagemAscHorarioPartidaAsc();
    }

    @Test
    void listarTodas_deveMapearDetalhesDaViagemEVeiculo() {
        Viagem viagem = org.mockito.Mockito.mock(Viagem.class);
        Rota rota = org.mockito.Mockito.mock(Rota.class);
        Veiculo veiculo = org.mockito.Mockito.mock(Veiculo.class);
        Motorista motorista = org.mockito.Mockito.mock(Motorista.class);
        when(viagemRepository.findAllByOrderByDataViagemAscHorarioPartidaAsc())
                .thenReturn(List.of(viagem));
        when(viagem.getId()).thenReturn(7L);
        when(viagem.getDataViagem()).thenReturn(java.time.LocalDate.of(2026, 11, 20));
        when(viagem.getHorarioPartida()).thenReturn(java.time.LocalTime.of(8, 30));
        when(viagem.getHorarioChegada()).thenReturn(java.time.LocalTime.of(10, 0));
        when(viagem.getVagasRestantes()).thenReturn(4L);
        when(viagem.getRota()).thenReturn(rota);
        when(viagem.getVeiculo()).thenReturn(veiculo);
        when(viagem.getMotorista()).thenReturn(motorista);
        when(rota.getId()).thenReturn(2L);
        when(rota.getNome()).thenReturn("Centro - Aeroporto");
        when(rota.getDescricao()).thenReturn(null);
        when(rota.getPontos()).thenReturn(List.of());
        when(veiculo.getId()).thenReturn(5L);
        when(veiculo.getTipo()).thenReturn("Van");
        when(veiculo.getModelo()).thenReturn("Van Executiva");
        when(veiculo.getAno()).thenReturn((short) 2024);
        when(veiculo.getCor()).thenReturn("Branca");
        when(veiculo.getPlaca()).thenReturn("ABC1D23");
        when(veiculo.getFotos()).thenReturn(List.of());
        when(veiculo.getCapacidadeTotalPassageiros()).thenReturn(15L);
        when(veiculo.isAceitaBagagem()).thenReturn(true);
        when(veiculo.isArCondicionado()).thenReturn(true);
        when(veiculo.isWifi()).thenReturn(false);
        when(motorista.getId()).thenReturn(8L);
        when(motorista.getNome()).thenReturn("João Silva");
        when(motorista.getFoto()).thenReturn(null);

        var resultado = viagemService.listarTodas();

        assertEquals(1, resultado.size());
        assertEquals(7L, resultado.getFirst().id());
        assertEquals(java.time.LocalTime.of(10, 0), resultado.getFirst().horarioChegada());
        assertEquals("Van Executiva", resultado.getFirst().veiculo().modelo());
        assertEquals(true, resultado.getFirst().veiculo().arCondicionado());
        assertEquals(false, resultado.getFirst().veiculo().wifi());
        assertNotNull(resultado.getFirst().rota());
    }

    @Test
    void buscarPorId_deveRetornar404QuandoViagemNaoExiste() {
        when(viagemRepository.findById(42L)).thenReturn(Optional.empty());

        ResponseStatusException erro = assertThrows(
                ResponseStatusException.class,
                () -> viagemService.buscarPorId(42L)
        );

        assertEquals(404, erro.getStatusCode().value());
        verify(viagemRepository).findById(42L);
    }
}
