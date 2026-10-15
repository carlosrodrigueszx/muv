package br.com.muv.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

@Entity
@Table(name = "veiculo")
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 32)
    private String tipo;

    @Column(nullable = false, length = 64)
    private String modelo;

    @Column(nullable = false)
    private Short ano;

    @Column(nullable = false, length = 32)
    private String cor;

    @Column(nullable = false, unique = true, length = 7)
    private String placa;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> fotos;

    @Column(name = "capacidade_total_passageiros", nullable = false)
    private Long capacidadeTotalPassageiros;

    @Column(name = "aceita_bagagem", nullable = false)
    private boolean aceitaBagagem = true;

    @Column(name = "ar_condicionado", nullable = false)
    private boolean arCondicionado;

    @Column(nullable = false)
    private boolean wifi;

    protected Veiculo() {}

    public Long getId() { return id; }
    public String getTipo() { return tipo; }
    public String getModelo() { return modelo; }
    public Short getAno() { return ano; }
    public String getCor() { return cor; }
    public String getPlaca() { return placa; }
    public List<String> getFotos() { return fotos; }
    public Long getCapacidadeTotalPassageiros() { return capacidadeTotalPassageiros; }
    public boolean isAceitaBagagem() { return aceitaBagagem; }
    public boolean isArCondicionado() { return arCondicionado; }
    public boolean isWifi() { return wifi; }
}
