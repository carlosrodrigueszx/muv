package br.com.muv.model.dto;

import jakarta.validation.constraints.NotBlank;

public record RedefinirSenhaRequest(
    @NotBlank String token,
    @NotBlank String novaSenha
) {}
