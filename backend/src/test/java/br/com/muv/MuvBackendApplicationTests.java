package br.com.muv;

import br.com.muv.repository.MotoristaRepository;
import br.com.muv.repository.PassageiroRepository;
import br.com.muv.repository.RecuperacaoSenhaRepository;
import br.com.muv.repository.ViagemConsultaRepository;
import br.com.muv.service.ViagemCadastroService;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
class MuvBackendApplicationTests {

    @MockitoBean
    MotoristaRepository motoristaRepository;

    @MockitoBean
    PassageiroRepository passageiroRepository;

    @MockitoBean
    RecuperacaoSenhaRepository recuperacaoSenhaRepository;

    @MockitoBean
    ViagemConsultaRepository viagemConsultaRepository;

    @MockitoBean
    ViagemCadastroService viagemCadastroService;

    @Test
    void contextLoads() {
    }
}
