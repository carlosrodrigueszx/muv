package br.com.muv.model.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record ViagemCadastroRequestDTO(
        @NotNull @Positive Long motoristaId,
        @NotBlank @Size(max = 255) String nomeRota,
        @NotBlank @Size(max = 255) String origem,
        @Size(max = 255) String paradaIntermediaria,
        @NotBlank @Size(max = 255) String destino,
        @NotNull @FutureOrPresent LocalDate data,
        @NotNull LocalTime horarioPartida,
        @NotNull LocalTime horarioChegada,
        @NotNull @DecimalMin("0.01") BigDecimal tarifa,
        @NotNull @Positive Long vagas,
        @NotBlank @Size(max = 32) String tipoVeiculo,
        @NotBlank @Size(max = 64) String modeloVeiculo,
        @NotNull @Min(1900) @jakarta.validation.constraints.Max(2100) Integer anoVeiculo,
        @NotBlank @Size(max = 32) String corVeiculo,
        @NotBlank @Pattern(regexp = "[A-Z0-9]{7}", message = "A placa deve ter 7 letras ou números, sem hífen") String placaVeiculo,
        @NotNull @Positive Long capacidadeVeiculo,
        boolean aceitaBagagem,
        boolean arCondicionado,
        boolean wifi
) {}
