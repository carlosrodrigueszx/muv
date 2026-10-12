package br.com.muv.controller;

import br.com.muv.model.dto.SolicitarRecuperacaoSenhaRequest;
import br.com.muv.model.dto.RedefinirSenhaRequest;
import br.com.muv.service.SolicitacaoRecuperacaoSenhaService;
import br.com.muv.service.RecuperacaoSenhaService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/recuperacao")
public class RecuperacaoSenhaController {

    private final SolicitacaoRecuperacaoSenhaService solicitacao;
    private final RecuperacaoSenhaService redefinicao;

    public RecuperacaoSenhaController(
            SolicitacaoRecuperacaoSenhaService solicitacao,
            RecuperacaoSenhaService redefinicao
    ) {
        this.solicitacao = solicitacao;
        this.redefinicao = redefinicao;
    }

    @PostMapping("/solicitar")
    public ResponseEntity<Void> solicitar(
            @Valid @RequestBody
            SolicitarRecuperacaoSenhaRequest dados
    ) {
        solicitacao.solicitar(dados.email());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/redefinir")
    public ResponseEntity<Void> redefinir(
            @Valid @RequestBody
            RedefinirSenhaRequest dados
    ) {
        redefinicao.redefinirSenha(
            dados.token(),
            dados.novaSenha()
        );

        return ResponseEntity.noContent().build();
    }
}
