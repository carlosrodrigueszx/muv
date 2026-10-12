package br.com.muv.config;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

class PasswordConfigTest {

    @Test
    void deveProtegerEValidarSenha() {
        PasswordEncoder encoder =
                new PasswordConfig().passwordEncoder();

        String senha = "SenhaTeste123!";
        String hash = encoder.encode(senha);

        assertNotEquals(senha, hash);
        assertTrue(encoder.matches(senha, hash));
        assertFalse(encoder.matches("SenhaErrada", hash));
    }
}
