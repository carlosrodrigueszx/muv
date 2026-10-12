package br.com.muv.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "motorista")
public class Motorista extends Usuario {
    @Column(columnDefinition = "bpchar", length = 11)
    private String cnh;
    @Column(name = "avaliacao_media")
    private Double avaliacaoMedia;
//    private Long empresaId; // Cada motorista está associado a uma cooperativa/empresa?

    public Motorista() {
        super();
    }

    private Motorista(Builder builder) {
        super(builder);
        this.cnh = builder.cnh;
        this.avaliacaoMedia = builder.avaliacaoMedia;
    }

    public String getCnh() {
        return cnh;
    }

    public Double getAvaliacaoMedia() {
        return avaliacaoMedia;
    }

    public static class Builder extends Usuario.Builder<Builder> {
        private String cnh;
        private Double avaliacaoMedia;

        @Override
        protected Builder self() {
            return this;
        }

        public Builder cnh(String cnh) {
            this.cnh = cnh;
            return this;
        }

        public Builder avaliacaoMedia(Double avaliacaoMedia) {
            this.avaliacaoMedia = avaliacaoMedia;
            return this;
        }

        public Builder copiarDe(Motorista motorista) {
            super.copiarDe(motorista);
            this.cnh = motorista.getCnh();
            this.avaliacaoMedia = motorista.getAvaliacaoMedia();
            return this;
        }

        @Override
        public Motorista build() {
            return new Motorista(this);
        }
    }
}
