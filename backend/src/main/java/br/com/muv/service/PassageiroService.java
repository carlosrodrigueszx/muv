package br.com.muv.service;

import br.com.muv.model.dto.PassageiroCadastroRequest;
import br.com.muv.model.dto.PassageiroResponse;
import br.com.muv.model.entity.Passageiro;
import br.com.muv.repository.PassageiroRepository;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
public class PassageiroService {

    private final PassageiroRepository repository;
    private final PasswordEncoder passwordEncoder;

    public PassageiroService(
            PassageiroRepository repository,
            PasswordEncoder passwordEncoder
    ) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public PassageiroResponse cadastrar(
            PassageiroCadastroRequest dados
    ) {
        String cpf = dados.cpf().trim();
        String email = dados.email()
                .trim()
                .toLowerCase(Locale.ROOT);

        if (!cpfValido(cpf)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "CPF invalido"
            );
        }

        if (repository.existsByCpf(cpf)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "CPF ja cadastrado"
            );
        }

        if (repository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "E-mail ja cadastrado"
            );
        }

        Passageiro passageiro = new Passageiro(
                dados.nome().trim(),
                cpf,
                dados.telefone().trim(),
                email,
                passwordEncoder.encode(dados.senha())
        );

        Passageiro salvo;

        try {
            salvo = repository.saveAndFlush(passageiro);
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Dados cadastrais ja existentes",
                    ex
            );
        }

        return new PassageiroResponse(
                salvo.getId(),
                salvo.getNome(),
                salvo.getCpf(),
                salvo.getTelefone(),
                salvo.getEmail()
        );
    }

    private boolean cpfValido(String cpf) {
        if (!cpf.matches("\\d{11}")) {
            return false;
        }

        if (cpf.chars().distinct().count() == 1) {
            return false;
        }

        for (int digito = 9; digito <= 10; digito++) {
            int soma = 0;

            for (int i = 0; i < digito; i++) {
                soma += (cpf.charAt(i) - '0')
                        * (digito + 1 - i);
            }

            int verificador = (soma * 10) % 11;

            if (verificador == 10) {
                verificador = 0;
            }

            if (verificador != cpf.charAt(digito) - '0') {
                return false;
            }
        }

        return true;
    }
}
