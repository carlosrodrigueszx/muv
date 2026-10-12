package br.com.muv.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "motorista")
public class Motorista extends Usuario {
    private String cnh;
    private Double avaliacao;
//    private Long empresaId; // Cada motorista está associado a uma cooperativa/empresa?

    public Motorista() {
        super();
    }

    private Motorista(Builder builder) {
        super(builder);
        this.cnh = builder.cnh;
        this.avaliacao = builder.avaliacao;
    }

    public String getCnh() {
        return cnh;
    }

    public Double getAvaliacao() {
        return avaliacao;
    }

    public static class Builder extends Usuario.Builder<Builder> {
        private String cnh;
        private Double avaliacao;

        @Override
        protected Builder self() {
            return this;
        }

        public Builder cnh(String cnh) {
            this.cnh = cnh;
            return this;
        }

        public Builder avaliacao(Double avaliacao) {
            this.avaliacao = avaliacao;
            return this;
        }

        public Builder copiarDe(Motorista motorista) {
            super.copiarDe(motorista);
            this.cnh = motorista.getCnh();
            this.avaliacao = motorista.getAvaliacao();
            return this;
        }

        @Override
        public Motorista build() {
            return new Motorista(this);
        }
    }
}
