package br.com.muv.service;

import br.com.muv.model.dto.LoginRequest;
import br.com.muv.model.entity.Passageiro;
import br.com.muv.repository.PassageiroRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
public class AutenticacaoService {

    private final PassageiroRepository repository;
    private final PasswordEncoder passwordEncoder;

    public AutenticacaoService(
            PassageiroRepository repository,
            PasswordEncoder passwordEncoder
    ) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public Passageiro validarCredenciais(LoginRequest dados) {
        String email = dados.email()
                .trim()
                .toLowerCase(Locale.ROOT);

        Passageiro passageiro = repository
                .findByEmailIgnoreCase(email)
                .orElseThrow(this::credenciaisInvalidas);

        if (!passwordEncoder.matches(
                dados.senha(),
                passageiro.getSenhaHash()
        )) {
            throw credenciaisInvalidas();
        }

        return passageiro;
    }

    private ResponseStatusException credenciaisInvalidas() {
        return new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "E-mail ou senha invalidos"
        );
    }
}
