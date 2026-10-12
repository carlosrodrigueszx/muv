package br.com.muv.model.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Entity
@Table(name = "recuperacao_senha")
public class RecuperacaoSenha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "passageiro_id", nullable = false)
    private Long passageiroId;

    @Column(name = "token_hash", nullable = false,
            unique = true, length = 64)
    private String tokenHash;

    @Column(name = "criado_em", nullable = false)
    private OffsetDateTime criadoEm;

    @Column(name = "expira_em", nullable = false)
    private OffsetDateTime expiraEm;

    @Column(name = "utilizado_em")
    private OffsetDateTime utilizadoEm;

    protected RecuperacaoSenha() {}

    public RecuperacaoSenha(Long passageiroId, String tokenHash) {
        this.passageiroId = passageiroId;
        this.tokenHash = tokenHash;
        this.criadoEm = OffsetDateTime.now(ZoneOffset.UTC);
        this.expiraEm = criadoEm.plusMinutes(30);
    }

    public Long getId() { return id; }

    public Long getPassageiroId() {
        return passageiroId;
    }

    public String getTokenHash() {
        return tokenHash;
    }

    public OffsetDateTime getExpiraEm() {
        return expiraEm;
    }

    public OffsetDateTime getUtilizadoEm() {
        return utilizadoEm;
    }

    public void marcarComoUtilizado() {
        this.utilizadoEm = OffsetDateTime.now(ZoneOffset.UTC);
    }
}
