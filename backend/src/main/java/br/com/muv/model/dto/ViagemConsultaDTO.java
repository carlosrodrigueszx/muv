package br.com.muv.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record ViagemConsultaDTO(
        Long id, LocalDate data, LocalTime partida, LocalTime chegada,
        String origem, String destino, String via, String motorista,
        Double avaliacao, String veiculo, String linha, BigDecimal tarifa,
        Long vagas, boolean arCondicionado, boolean wifi
) {}
