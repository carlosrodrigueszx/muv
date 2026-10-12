package br.com.muv.controller;

import br.com.muv.model.dto.LoginRequest;
import br.com.muv.model.dto.LoginResponse;
import br.com.muv.model.entity.Passageiro;
import br.com.muv.service.AutenticacaoService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.csrf.CsrfAuthenticationStrategy;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AutenticacaoController {

    private final AutenticacaoService service;

    public AutenticacaoController(AutenticacaoService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest dados,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        Passageiro passageiro = service.validarCredenciais(dados);

        Authentication autenticacao =
            UsernamePasswordAuthenticationToken.authenticated(
                passageiro.getEmail(),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_PASSAGEIRO"))
            );

        request.getSession(true);
        request.changeSessionId();

        SecurityContext contexto =
            SecurityContextHolder.createEmptyContext();

        contexto.setAuthentication(autenticacao);
        SecurityContextHolder.setContext(contexto);

        new HttpSessionSecurityContextRepository()
            .saveContext(contexto, request, response);

        new CsrfAuthenticationStrategy(
            new HttpSessionCsrfTokenRepository()
        ).onAuthentication(autenticacao, request, response);

        return new LoginResponse(
            passageiro.getId(),
            passageiro.getNome(),
            passageiro.getEmail()
        );
    }

    @GetMapping("/me")
    public Map<String, Object> usuarioAtual(
            Authentication autenticacao
    ) {
        return Map.of(
            "email", autenticacao.getName(),
            "autenticado", true
        );
    }
}
