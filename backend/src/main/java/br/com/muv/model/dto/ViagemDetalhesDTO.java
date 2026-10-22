package br.com.muv.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record ViagemDetalhesDTO(
        Long id, LocalDate data, LocalTime partida, LocalTime chegada,
        String origem, String destino, BigDecimal tarifa, Long vagas, String linha,
        String motorista, String fotoMotorista, Double avaliacaoMotorista,
        String tipoVeiculo, String modeloVeiculo, Integer anoVeiculo, String corVeiculo,
        String placaVeiculo, Long capacidadeVeiculo, boolean aceitaBagagem,
        boolean arCondicionado, boolean wifi, List<String> fotosVeiculo,
        List<ParadaDTO> itinerario, List<AvaliacaoDTO> avaliacoes
) {
    public record ParadaDTO(Long ordem, String nome, String endereco) {}

    public record AvaliacaoDTO(String passageiro, Double nota, String comentario) {}
}
