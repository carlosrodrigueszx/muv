package br.com.muv.service;

import br.com.muv.model.dto.LoginRequest;
import br.com.muv.model.entity.Passageiro;
import br.com.muv.repository.PassageiroRepository;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AutenticacaoServiceTest {

    private final PassageiroRepository repository =
            mock(PassageiroRepository.class);

    private final PasswordEncoder encoder =
            mock(PasswordEncoder.class);

    private final AutenticacaoService service =
            new AutenticacaoService(repository, encoder);

    private Passageiro passageiro() {
        return new Passageiro(
                "Passageiro Teste",
                "11144477735",
                "85999999999",
                "teste@example.com",
                "hash-armazenado"
        );
    }

    @Test
    void deveAutenticarComSenhaCorreta() {
        Passageiro passageiro = passageiro();

        when(repository.findByEmailIgnoreCase("teste@example.com"))
                .thenReturn(Optional.of(passageiro));

        when(encoder.matches("SenhaTeste123!", "hash-armazenado"))
                .thenReturn(true);

        Passageiro resultado = service.validarCredenciais(
                new LoginRequest(
                        " TESTE@EXAMPLE.COM ",
                        "SenhaTeste123!"
                )
        );

        assertSame(passageiro, resultado);
    }

    @Test
    void deveRejeitarSenhaIncorreta() {
        when(repository.findByEmailIgnoreCase("teste@example.com"))
                .thenReturn(Optional.of(passageiro()));

        when(encoder.matches("SenhaErrada", "hash-armazenado"))
                .thenReturn(false);

        ResponseStatusException erro = assertThrows(
                ResponseStatusException.class,
                () -> service.validarCredenciais(
                        new LoginRequest(
                                "teste@example.com",
                                "SenhaErrada"
                        )
                )
        );

        assertEquals(HttpStatus.UNAUTHORIZED, erro.getStatusCode());
    }

    @Test
    void deveRejeitarEmailNaoCadastrado() {
        when(repository.findByEmailIgnoreCase("inexistente@example.com"))
                .thenReturn(Optional.empty());

        ResponseStatusException erro = assertThrows(
                ResponseStatusException.class,
                () -> service.validarCredenciais(
                        new LoginRequest(
                                "inexistente@example.com",
                                "SenhaTeste123!"
                        )
                )
        );

        assertEquals(HttpStatus.UNAUTHORIZED, erro.getStatusCode());
        verifyNoInteractions(encoder);
    }
}
