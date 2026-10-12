package br.com.muv.service;

import br.com.muv.model.dto.MotoristaRequestDTO;
import br.com.muv.model.dto.MotoristaResponseDTO;
import br.com.muv.model.entity.Motorista;
import br.com.muv.repository.MotoristaRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MotoristaServiceTest {

    @Mock
    private MotoristaRepository motoristaRepository;

    @InjectMocks
    private MotoristaService motoristaService;

    // ---------- helpers ----------

    private Motorista criarMotorista(Long id, String nome, String cpf, String cnh,
                                     String email, String telefone, Double avaliacao) {
        // O id é gerado pelo banco; aqui simulamos a entidade já persistida.
        return new Motorista.Builder()
                .id(id)
                .nome(nome)
                .cpf(cpf)
                .cnh(cnh)
                .email(email)
                .telefone(telefone)
                .senha("senha123")
                .avaliacaoMedia(avaliacao)
                .build();
    }

    private MotoristaRequestDTO criarRequest() {
        return new MotoristaRequestDTO(
                "João Silva",
                "12345678901",
                "98765432100",
                "joao@email.com",
                "85999998888",
                "senha123"
        );
    }

    // ---------- cadastrar ----------

    @Test
    @DisplayName("cadastrar: deve salvar o motorista com os dados do DTO e avaliação média 0.0")
    void cadastrar_deveSalvarMotoristaComDadosDoDtoEAvaliacaoZero() {
        MotoristaRequestDTO request = criarRequest();
        when(motoristaRepository.save(any(Motorista.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        motoristaService.cadastrar(request);

        ArgumentCaptor<Motorista> captor = ArgumentCaptor.forClass(Motorista.class);
        verify(motoristaRepository, times(1)).save(captor.capture());

        Motorista salvo = captor.getValue();
        assertEquals("João Silva", salvo.getNome());
        assertEquals("12345678901", salvo.getCpf());
        assertEquals("98765432100", salvo.getCnh());
        assertEquals("joao@email.com", salvo.getEmail());
        assertEquals("85999998888", salvo.getTelefone());
        assertEquals(0.0, salvo.getAvaliacaoMedia());
        // O id deve ficar nulo: quem gera é o banco (GenerationType.IDENTITY)
        assertNull(salvo.getId());
        // Comportamento atual: a senha é repassada como veio (sem hash).
        // Quando houver criptografia, troque este assert por assertNotEquals.
        assertEquals("senha123", salvo.getSenha());
    }

    @Test
    @DisplayName("cadastrar: deve retornar ResponseDTO com os dados do motorista persistido")
    void cadastrar_deveRetornarResponseDtoCorreto() {
        MotoristaRequestDTO request = criarRequest();
        Motorista persistido = criarMotorista(1L, "João Silva", "12345678901",
                "98765432100", "joao@email.com", "85999998888", 0.0);
        when(motoristaRepository.save(any(Motorista.class))).thenReturn(persistido);

        MotoristaResponseDTO resposta = motoristaService.cadastrar(request);

        assertNotNull(resposta);
        assertEquals(1L, resposta.id());
        assertEquals("João Silva", resposta.nome());
        assertEquals("12345678901", resposta.cpf());
        assertEquals("98765432100", resposta.cnh());
        assertEquals("joao@email.com", resposta.email());
        assertEquals("85999998888", resposta.telefone());
        assertEquals(0.0, resposta.avaliacaoMedia());
    }

    @Test
    @DisplayName("cadastrar: não deve expor a senha no ResponseDTO")
    void cadastrar_naoDeveExporSenhaNaResposta() {
        when(motoristaRepository.save(any(Motorista.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        MotoristaResponseDTO resposta = motoristaService.cadastrar(criarRequest());

        assertFalse(resposta.toString().contains("senha123"));
    }

    @Test
    @DisplayName("cadastrar: deve propagar a exceção lançada pelo repositório")
    void cadastrar_devePropagarExcecaoDoRepositorio() {
        when(motoristaRepository.save(any(Motorista.class)))
                .thenThrow(new RuntimeException("Violação de unicidade (CPF/e-mail)"));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> motoristaService.cadastrar(criarRequest()));

        assertEquals("Violação de unicidade (CPF/e-mail)", ex.getMessage());
    }

    // ---------- listarTodos ----------

    @Test
    @DisplayName("listarTodos: deve converter todos os motoristas em ResponseDTOs")
    void listarTodos_deveRetornarListaDeDtos() {
        Motorista m1 = criarMotorista(1L, "João", "11111111111", "10000000001",
                "joao@email.com", "85911111111", 4.5);
        Motorista m2 = criarMotorista(2L, "Maria", "22222222222", "20000000002",
                "maria@email.com", "85922222222", 5.0);
        when(motoristaRepository.findAll()).thenReturn(List.of(m1, m2));

        List<MotoristaResponseDTO> resultado = motoristaService.listarTodos();

        assertEquals(2, resultado.size());

        MotoristaResponseDTO r1 = resultado.get(0);
        assertEquals(1L, r1.id());
        assertEquals("João", r1.nome());
        assertEquals("11111111111", r1.cpf());
        assertEquals("10000000001", r1.cnh());
        assertEquals("joao@email.com", r1.email());
        assertEquals("85911111111", r1.telefone());
        assertEquals(4.5, r1.avaliacaoMedia());

        MotoristaResponseDTO r2 = resultado.get(1);
        assertEquals(2L, r2.id());
        assertEquals("Maria", r2.nome());
        assertEquals(5.0, r2.avaliacaoMedia());

        verify(motoristaRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("listarTodos: deve retornar lista vazia quando não há motoristas")
    void listarTodos_deveRetornarListaVaziaQuandoNaoHaMotoristas() {
        when(motoristaRepository.findAll()).thenReturn(List.of());

        List<MotoristaResponseDTO> resultado = motoristaService.listarTodos();

        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
        verify(motoristaRepository).findAll();
    }

    @Test
    @DisplayName("listarTodos: deve preservar a ordem retornada pelo repositório")
    void listarTodos_devePreservarOrdem() {
        Motorista m1 = criarMotorista(10L, "A", "1", "1", "a@a.com", "1", 1.0);
        Motorista m2 = criarMotorista(20L, "B", "2", "2", "b@b.com", "2", 2.0);
        Motorista m3 = criarMotorista(30L, "C", "3", "3", "c@c.com", "3", 3.0);
        when(motoristaRepository.findAll()).thenReturn(List.of(m1, m2, m3));

        List<MotoristaResponseDTO> resultado = motoristaService.listarTodos();

        assertEquals(List.of(10L, 20L, 30L),
                resultado.stream().map(MotoristaResponseDTO::id).toList());
    }

    @Test
    @DisplayName("listarTodos: deve propagar a exceção lançada pelo repositório")
    void listarTodos_devePropagarExcecaoDoRepositorio() {
        when(motoristaRepository.findAll()).thenThrow(new RuntimeException("Erro de banco"));

        assertThrows(RuntimeException.class, () -> motoristaService.listarTodos());
    }
}