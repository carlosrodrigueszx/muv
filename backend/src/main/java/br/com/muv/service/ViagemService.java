package br.com.muv.service;

import br.com.muv.model.dto.ViagemDetalheResponse;
import br.com.muv.model.entity.PontoRota;
import br.com.muv.model.entity.Viagem;
import br.com.muv.repository.ViagemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ViagemService {
    private final ViagemRepository viagemRepository;

    public ViagemService(ViagemRepository viagemRepository) {
        this.viagemRepository = viagemRepository;
    }

    public List<ViagemDetalheResponse> listarTodas() {
        return viagemRepository.findAllByOrderByDataViagemAscHorarioPartidaAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ViagemDetalheResponse buscarPorId(Long id) {
        Viagem viagem = viagemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Viagem não encontrada."));
        return toResponse(viagem);
    }

    private ViagemDetalheResponse toResponse(Viagem viagem) {
        var rota = viagem.getRota();
        var veiculo = viagem.getVeiculo();
        var motorista = viagem.getMotorista();

        List<ViagemDetalheResponse.PontoRotaResponse> pontos = rota.getPontos().stream()
                .map(this::toPontoResponse)
                .toList();

        return new ViagemDetalheResponse(
                viagem.getId(),
                viagem.getDataViagem(),
                viagem.getHorarioPartida(),
                viagem.getHorarioChegada(),
                viagem.getVagasRestantes(),
                new ViagemDetalheResponse.RotaResponse(
                        rota.getId(), rota.getNome(), rota.getDescricao(), pontos
                ),
                new ViagemDetalheResponse.VeiculoResponse(
                        veiculo.getId(), veiculo.getTipo(), veiculo.getModelo(), veiculo.getAno(),
                        veiculo.getCor(), veiculo.getPlaca(), veiculo.getFotos(),
                        veiculo.getCapacidadeTotalPassageiros(), veiculo.isAceitaBagagem(),
                        veiculo.isArCondicionado(), veiculo.isWifi()
                ),
                new ViagemDetalheResponse.MotoristaResumoResponse(
                        motorista.getId(), motorista.getNome(), motorista.getFoto()
                )
        );
    }

    private ViagemDetalheResponse.PontoRotaResponse toPontoResponse(PontoRota ponto) {
        return new ViagemDetalheResponse.PontoRotaResponse(
                ponto.getId(), ponto.getOrdem(), ponto.getNomePonto(), ponto.getEndereco(),
                ponto.getLatitude(), ponto.getLongitude()
        );
    }
}
