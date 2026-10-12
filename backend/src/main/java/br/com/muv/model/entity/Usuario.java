package br.com.muv.model.entity;

import jakarta.persistence.*;

@MappedSuperclass
public abstract class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String nome;
    @Column(columnDefinition = "bpchar", length = 11)
    private String cpf;
    private String email;
    private String telefone;
    @Column(name = "senha_hash")
    private String senha;

    public Usuario() {}

    protected Usuario(Builder<?> builder) {
        this.id = builder.id;
        this.nome = builder.nome;
        this.cpf = builder.cpf;
        this.email = builder.email;
        this.senha = builder.senha;
    }

    public long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getCpf() {
        return cpf;
    }

    public String getEmail() {
        return email;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getSenha() {
        return senha;
    }

    public static abstract class Builder<B extends Builder<B>> {
        private Long id;
        private String nome;
        private String cpf;
        private String email;
        private String telefone;
        private String senha;

        // Método abstrato para forçar a classe filha a retornar "this" com o tipo correto
        protected abstract B self();

        public B id(Long id) {
            this.id = id;
            return self();
        }

        public B nome(String nome) {
            this.nome = nome;
            return self();
        }

        public B cpf(String cpf) {
            this.cpf = cpf;
            return self();
        }

        public B email(String email) {
            this.email = email;
            return self();
        }

        public B telefone(String telefone) {
            this.telefone = telefone;
            return self();
        }

        public B senha(String senha) {
            this.senha = senha;
            return self();
        }

        public B copiarDe(Usuario usuario) {
            this.id = usuario.getId();
            this.nome = usuario.getNome();
            this.cpf = usuario.getCpf();
            this.email = usuario.getEmail();
            this.telefone = usuario.getTelefone();
            this.senha = usuario.getSenha();
            return self();
        }

        public abstract Usuario build();
    }
}
