package br.com.muv.service;

import br.com.muv.model.entity.RecuperacaoSenha;
import br.com.muv.repository.PassageiroRepository;
import br.com.muv.repository.RecuperacaoSenhaRepository;

import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SolicitacaoRecuperacaoSenhaService {

    private final PassageiroRepository passageiros;
    private final RecuperacaoSenhaRepository recuperacoes;
    private final TokenRecuperacaoService tokens;
    private final EmailRecuperacaoSenhaService emails;

    public SolicitacaoRecuperacaoSenhaService(
            PassageiroRepository passageiros,
            RecuperacaoSenhaRepository recuperacoes,
            TokenRecuperacaoService tokens,
            EmailRecuperacaoSenhaService emails
    ) {
        this.passageiros = passageiros;
        this.recuperacoes = recuperacoes;
        this.tokens = tokens;
        this.emails = emails;
    }

    @Transactional
    public void solicitar(String email) {
        emails.verificarDisponibilidade();

        String normalizado = email.trim()
                .toLowerCase(Locale.ROOT);

        passageiros.findByEmailIgnoreCase(normalizado)
                .ifPresent(passageiro -> {
                    String token = tokens.gerarToken();

                    recuperacoes.saveAndFlush(
                        new RecuperacaoSenha(
                            passageiro.getId(),
                            tokens.calcularHash(token)
                        )
                    );

                    emails.enviarLink(
                        passageiro.getEmail(),
                        token
                    );
                });
    }
}
