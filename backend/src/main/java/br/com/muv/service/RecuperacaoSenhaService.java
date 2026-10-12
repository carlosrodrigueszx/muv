package br.com.muv.service;

import br.com.muv.model.entity.Passageiro;
import br.com.muv.model.entity.RecuperacaoSenha;
import br.com.muv.repository.PassageiroRepository;
import br.com.muv.repository.RecuperacaoSenhaRepository;

import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RecuperacaoSenhaService {

    private final PassageiroRepository passageiros;
    private final RecuperacaoSenhaRepository recuperacoes;
    private final TokenRecuperacaoService tokens;
    private final PasswordEncoder passwordEncoder;

    public RecuperacaoSenhaService(
            PassageiroRepository passageiros,
            RecuperacaoSenhaRepository recuperacoes,
            TokenRecuperacaoService tokens,
            PasswordEncoder passwordEncoder
    ) {
        this.passageiros = passageiros;
        this.recuperacoes = recuperacoes;
        this.tokens = tokens;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void redefinirSenha(String token, String novaSenha) {

        if (token == null ||
                !token.matches("[A-Za-z0-9_-]{43}")) {
            throw tokenInvalido();
        }

        if (novaSenha == null ||
                novaSenha.length() < 8 ||
                novaSenha.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A senha deve ter pelo menos 8 caracteres e no maximo 72 bytes"
            );
        }

        String hash = tokens.calcularHash(token);

        RecuperacaoSenha recuperacao = recuperacoes
                .findByTokenHashAndUtilizadoEmIsNull(hash)
                .orElseThrow(this::tokenInvalido);

        if (!recuperacao.getExpiraEm()
                .isAfter(OffsetDateTime.now(ZoneOffset.UTC))) {
            throw tokenInvalido();
        }

        Passageiro passageiro = passageiros
                .findById(recuperacao.getPassageiroId())
                .orElseThrow(this::tokenInvalido);

        passageiro.atualizarSenhaHash(
                passwordEncoder.encode(novaSenha)
        );

        recuperacao.marcarComoUtilizado();
    }

    private ResponseStatusException tokenInvalido() {
        return new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Token invalido ou expirado"
        );
    }
}
