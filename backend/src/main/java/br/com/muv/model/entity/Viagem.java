package br.com.muv.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "viagem")
public class Viagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_viagem", nullable = false)
    private LocalDate dataViagem;

    @Column(name = "horario_partida", nullable = false)
    private LocalTime horarioPartida;

    @Column(name = "horario_chegada", nullable = false)
    private LocalTime horarioChegada;

    @Column(name = "vagas_restantes", nullable = false)
    private Long vagasRestantes;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_rota", nullable = false)
    private Rota rota;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_veiculo", nullable = false)
    private Veiculo veiculo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_motorista", nullable = false)
    private Motorista motorista;

    protected Viagem() {}

    public Long getId() { return id; }
    public LocalDate getDataViagem() { return dataViagem; }
    public LocalTime getHorarioPartida() { return horarioPartida; }
    public LocalTime getHorarioChegada() { return horarioChegada; }
    public Long getVagasRestantes() { return vagasRestantes; }
    public Rota getRota() { return rota; }
    public Veiculo getVeiculo() { return veiculo; }
    public Motorista getMotorista() { return motorista; }
}
