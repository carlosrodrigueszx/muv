package br.com.muv.model.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record ViagemDetalheResponse(
        Long id,
        LocalDate dataViagem,
        LocalTime horarioPartida,
        LocalTime horarioChegada,
        Long vagasRestantes,
        RotaResponse rota,
        VeiculoResponse veiculo,
        MotoristaResumoResponse motorista
) {
    public record RotaResponse(
            Long id,
            String nome,
            String descricao,
            List<PontoRotaResponse> pontos
    ) {}

    public record PontoRotaResponse(
            Long id,
            Long ordem,
            String nomePonto,
            String endereco,
            java.math.BigDecimal latitude,
            java.math.BigDecimal longitude
    ) {}

    public record VeiculoResponse(
            Long id,
            String tipo,
            String modelo,
            Short ano,
            String cor,
            String placa,
            List<String> fotos,
            Long capacidadeTotalPassageiros,
            boolean aceitaBagagem,
            boolean arCondicionado,
            boolean wifi
    ) {}

    public record MotoristaResumoResponse(Long id, String nome, String foto) {}
}
