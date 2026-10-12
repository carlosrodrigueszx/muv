package br.com.muv.repository;

import br.com.muv.model.entity.RecuperacaoSenha;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RecuperacaoSenhaRepository
        extends JpaRepository<RecuperacaoSenha, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<RecuperacaoSenha>
        findByTokenHashAndUtilizadoEmIsNull(String tokenHash);
}
