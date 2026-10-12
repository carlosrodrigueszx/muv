package br.com.muv.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TokenRecuperacaoServiceTest {

    private final TokenRecuperacaoService service =
            new TokenRecuperacaoService();

    @Test
    void deveGerarTokensDiferentes() {
        String primeiro = service.gerarToken();
        String segundo = service.gerarToken();

        assertEquals(43, primeiro.length());
        assertNotEquals(primeiro, segundo);
    }

    @Test
    void deveGerarHashSha256() {
        String token = service.gerarToken();
        String hash = service.calcularHash(token);

        assertEquals(64, hash.length());
        assertNotEquals(token, hash);
        assertEquals(hash, service.calcularHash(token));
    }
}
