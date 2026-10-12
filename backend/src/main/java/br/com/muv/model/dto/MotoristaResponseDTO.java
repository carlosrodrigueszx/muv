package br.com.muv.model.dto;

public record MotoristaResponseDTO(
        Long id,
        String nome,
        String cpf,
        String cnh,
        String email,
        String telefone,
        Double avaliacao
) {}
