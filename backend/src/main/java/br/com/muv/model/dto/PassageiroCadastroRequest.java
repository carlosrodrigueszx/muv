package br.com.muv.model.dto;

import jakarta.validation.constraints.*;

public record PassageiroCadastroRequest(
    @NotBlank
    @Size(max = 150)
    String nome,

    @NotBlank
    @Pattern(regexp = "\\d{11}")
    String cpf,

    @NotBlank
    @Pattern(regexp = "\\d{10,11}")
    String telefone,

    @NotBlank
    @Email
    @Size(max = 254)
    String email,

    @NotBlank
    @Size(min = 8)
    String senha
) {}
