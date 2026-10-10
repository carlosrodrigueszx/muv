package br.com.muv.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Map;
import org.junit.jupiter.api.Test;

class HealthControllerTest {

    @Test
    void deveRetornarStatusUp() {
        HealthController controller = new HealthController();

        assertEquals(
            Map.of("status", "UP"),
            controller.health()
        );
    }
}
