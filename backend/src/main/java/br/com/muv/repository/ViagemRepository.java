package br.com.muv.repository;

import br.com.muv.model.entity.Viagem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ViagemRepository extends JpaRepository<Viagem, Long> {

    @EntityGraph(attributePaths = {"rota", "rota.pontos", "veiculo", "motorista"})
    List<Viagem> findAllByOrderByDataViagemAscHorarioPartidaAsc();

    @Override
    @EntityGraph(attributePaths = {"rota", "rota.pontos", "veiculo", "motorista"})
    Optional<Viagem> findById(Long id);
}
