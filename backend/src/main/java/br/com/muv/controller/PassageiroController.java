package br.com.muv.controller;

import br.com.muv.model.dto.PassageiroCadastroRequest;
import br.com.muv.model.dto.PassageiroResponse;
import br.com.muv.service.PassageiroService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/passageiros")
public class PassageiroController {

    private final PassageiroService passageiroService;

    public PassageiroController(
            PassageiroService passageiroService
    ) {
        this.passageiroService = passageiroService;
    }

    @PostMapping
    public ResponseEntity<PassageiroResponse> cadastrar(
            @Valid @RequestBody PassageiroCadastroRequest dados
    ) {
        PassageiroResponse resposta =
                passageiroService.cadastrar(dados);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resposta);
    }
}
