package br.com.muv.repository;

import br.com.muv.model.entity.Motorista;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MotoristaRepository extends JpaRepository<Motorista, Long> {
//    List<Motorista> findByEmpresaId(Long empresaId);
}
