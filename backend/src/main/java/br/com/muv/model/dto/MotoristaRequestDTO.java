package br.com.muv.model.dto;

public record MotoristaRequestDTO(
        String nome,
        String cpf,
        String cnh,
        String email,
        String telefone,
        String senha
) {
}
