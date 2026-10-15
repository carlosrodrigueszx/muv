package br.com.muv;

import br.com.muv.repository.RecuperacaoSenhaRepository;
import br.com.muv.repository.MotoristaRepository;
import br.com.muv.repository.PassageiroRepository;
import br.com.muv.repository.ViagemRepository;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
class MuvBackendApplicationTests {

    @MockitoBean
    private RecuperacaoSenhaRepository recuperacaoSenhaRepository;


    @MockitoBean
    private MotoristaRepository motoristaRepository;

    @MockitoBean
    private PassageiroRepository passageiroRepository;

    @MockitoBean
    private ViagemRepository viagemRepository;

    @Test
    void contextLoads() {
    }
}
