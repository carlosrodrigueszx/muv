package br.com.muv.model.dto;

public record PassageiroResponse(
    Long id,
    String nome,
    String cpf,
    String telefone,
    String email
) {}
