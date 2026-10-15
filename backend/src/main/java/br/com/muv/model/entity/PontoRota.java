package br.com.muv.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "ponto_rota")
public class PontoRota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_rota", nullable = false)
    private Rota rota;

    @Column(nullable = false)
    private Long ordem;

    @Column(name = "nome_ponto", nullable = false, length = 255)
    private String nomePonto;

    @Column(length = 500)
    private String endereco;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    protected PontoRota() {}

    public Long getId() { return id; }
    public Long getOrdem() { return ordem; }
    public String getNomePonto() { return nomePonto; }
    public String getEndereco() { return endereco; }
    public BigDecimal getLatitude() { return latitude; }
    public BigDecimal getLongitude() { return longitude; }
}
