package br.com.muv;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import br.com.muv.repository.MotoristaRepository;
import br.com.muv.repository.ViagemConsultaRepository;

@SpringBootTest
class MuvBackendApplicationTests {
	@MockitoBean
	MotoristaRepository motoristaRepository;

	@MockitoBean
	ViagemConsultaRepository viagemConsultaRepository;

	@Test
	void contextLoads() {
	}

}
