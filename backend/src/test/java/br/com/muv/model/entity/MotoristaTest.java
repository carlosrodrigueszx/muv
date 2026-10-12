package br.com.muv.model.entity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MotoristaTest {

    private Motorista.Builder builderCompleto() {
        return new Motorista.Builder()
                .id(1L)
                .nome("João Silva")
                .cpf("12345678901")
                .cnh("98765432100")
                .email("joao@email.com")
                .telefone("85999998888")
                .senha("hash")
                .avaliacaoMedia(4.8);
    }

    @Test
    @DisplayName("Builder: deve preencher todos os campos, herdados e próprios")
    void builder_devePreencherTodosOsCampos() {
        Motorista m = builderCompleto().build();

        assertEquals(1L, m.getId());
        assertEquals("João Silva", m.getNome());
        assertEquals("12345678901", m.getCpf());
        assertEquals("98765432100", m.getCnh());
        assertEquals("joao@email.com", m.getEmail());
        assertEquals("85999998888", m.getTelefone());
        assertEquals("hash", m.getSenha());
        assertEquals(4.8, m.getAvaliacaoMedia());
    }

    @Test
    @DisplayName("Builder: campos não informados devem ficar nulos")
    void builder_camposNaoInformadosFicamNulos() {
        Motorista m = new Motorista.Builder().nome("Maria").build();

        assertEquals("Maria", m.getNome());
        assertNull(m.getId());
        assertNull(m.getCpf());
        assertNull(m.getCnh());
        assertNull(m.getEmail());
        assertNull(m.getTelefone());
        assertNull(m.getSenha());
        assertNull(m.getAvaliacaoMedia());
    }

    @Test
    @DisplayName("Builder: métodos encadeados devem retornar Motorista.Builder")
    void builder_encadeamentoRetornaBuilderDoMotorista() {
        Motorista.Builder b = new Motorista.Builder();

        assertSame(b, b.id(1L));
        assertSame(b, b.nome("A"));
        assertSame(b, b.cpf("1"));
        assertSame(b, b.email("a@a.com"));
        assertSame(b, b.telefone("1"));
        assertSame(b, b.senha("s"));
        assertSame(b, b.cnh("1"));
        assertSame(b, b.avaliacaoMedia(1.0));
    }

    @Test
    @DisplayName("copiarDe: deve copiar todos os campos de outro Motorista")
    void copiarDe_deveCopiarTodosOsCampos() {
        Motorista original = builderCompleto().build();

        Motorista copia = new Motorista.Builder().copiarDe(original).build();

        assertNotSame(original, copia);
        assertEquals(original.getId(), copia.getId());
        assertEquals(original.getNome(), copia.getNome());
        assertEquals(original.getCpf(), copia.getCpf());
        assertEquals(original.getCnh(), copia.getCnh());
        assertEquals(original.getEmail(), copia.getEmail());
        assertEquals(original.getTelefone(), copia.getTelefone());
        assertEquals(original.getSenha(), copia.getSenha());
        assertEquals(original.getAvaliacaoMedia(), copia.getAvaliacaoMedia());
    }

    @Test
    @DisplayName("copiarDe: permite alterar um campo da cópia sem afetar o original")
    void copiarDe_alterarCopiaNaoAfetaOriginal() {
        Motorista original = builderCompleto().build();

        Motorista atualizado = new Motorista.Builder()
                .copiarDe(original)
                .avaliacaoMedia(5.0)
                .nome("Novo Nome")
                .build();

        assertEquals(5.0, atualizado.getAvaliacaoMedia());
        assertEquals("Novo Nome", atualizado.getNome());
        assertEquals(4.8, original.getAvaliacaoMedia());
        assertEquals("João Silva", original.getNome());
        // Demais campos permanecem
        assertEquals(original.getId(), atualizado.getId());
        assertEquals(original.getCnh(), atualizado.getCnh());
    }

    @Test
    @DisplayName("Construtor padrão: necessário para o JPA, cria entidade com campos nulos")
    void construtorPadrao_criaEntidadeVazia() {
        Motorista m = new Motorista();

        assertNull(m.getId());
        assertNull(m.getNome());
        assertNull(m.getCnh());
        assertNull(m.getAvaliacaoMedia());
    }
}