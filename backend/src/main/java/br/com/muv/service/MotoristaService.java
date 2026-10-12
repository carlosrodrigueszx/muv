package br.com.muv.service;

import br.com.muv.model.dto.MotoristaRequestDTO;
import br.com.muv.model.dto.MotoristaResponseDTO;
import br.com.muv.model.entity.Motorista;
import br.com.muv.repository.MotoristaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MotoristaService {
    private final MotoristaRepository motoristaRepository;

    public MotoristaService(MotoristaRepository motoristaRepository) {
        this.motoristaRepository = motoristaRepository;
    }

    public MotoristaResponseDTO cadastrar(MotoristaRequestDTO dto) {
        Motorista novoMotorista = new Motorista.Builder()
                .nome(dto.nome())
                .cpf(dto.cpf())
                .cnh(dto.cnh())
                .email(dto.email())
                .telefone(dto.telefone())
                .senha(dto.senha())
                .build();

        Motorista motoristaSalvo = motoristaRepository.save(novoMotorista);

        return new MotoristaResponseDTO(
                motoristaSalvo.getId(),
                motoristaSalvo.getNome(),
                motoristaSalvo.getEmail(),
                motoristaSalvo.getCpf(),
                motoristaSalvo.getCnh(),
                motoristaSalvo.getTelefone(),
                motoristaSalvo.getAvaliacao()
        );
    }

    // Lista TODOS os motoristas do banco de dados
    public List<MotoristaResponseDTO> listarTodos() {
        List<Motorista> motoristas = motoristaRepository.findAll();

        return motoristas.stream().map(motorista -> new MotoristaResponseDTO(
                motorista.getId(),
                motorista.getNome(),
                motorista.getCpf(),
                motorista.getCnh(),
                motorista.getEmail(),
                motorista.getTelefone(),
                motorista.getAvaliacao()
        )).collect(Collectors.toList());
    }

    // Lista os motoristas pertencentes a uma empresa
    public List<MotoristaResponseDTO> listarPorEmpresa(Long empresaId) {
        List<Motorista> motoristas = motoristaRepository.findByEmpresaId(empresaId);

        return motoristas.stream()
                .map(motorista -> new MotoristaResponseDTO(
                        motorista.getId(),
                        motorista.getNome(),
                        motorista.getCpf(),
                        motorista.getCnh(),
                        motorista.getEmail(),
                        motorista.getTelefone(),
                        motorista.getAvaliacao()
                )).collect(Collectors.toList());
    }
}
