package br.com.muv.repository;

import br.com.muv.model.entity.Passageiro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PassageiroRepository
        extends JpaRepository<Passageiro, Long> {

    boolean existsByCpf(String cpf);

    boolean existsByEmailIgnoreCase(String email);

    Optional<Passageiro> findByEmailIgnoreCase(String email);
}
