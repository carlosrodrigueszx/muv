package br.com.muv.model.dto;

public record LoginResponse(
    Long id,
    String nome,
    String email
) {}
