package br.com.muv.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rota")
public class Rota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String nome;

    @Column(length = 500)
    private String descricao;

    @OneToMany(mappedBy = "rota")
    @OrderBy("ordem ASC")
    private List<PontoRota> pontos = new ArrayList<>();

    protected Rota() {}

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getDescricao() { return descricao; }
    public List<PontoRota> getPontos() { return List.copyOf(pontos); }
}
