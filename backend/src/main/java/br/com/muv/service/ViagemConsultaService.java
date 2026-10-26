package br.com.muv.service;

import br.com.muv.model.dto.ViagemConsultaDTO;
import br.com.muv.model.dto.ViagemDetalhesDTO;
import br.com.muv.repository.ViagemConsultaRepository;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ViagemConsultaService {
    private final ViagemConsultaRepository repository;
    public ViagemConsultaService(ViagemConsultaRepository repository) { this.repository = repository; }

    public List<ViagemConsultaDTO> pesquisar(String origem, String destino, Date data,
                                              boolean arCondicionado, boolean wifi) {
        return repository.pesquisar(origem, destino, data, arCondicionado, wifi);
    }

    public Optional<ViagemDetalhesDTO> buscarDetalhes(Long viagemId, String origem, String destino) {
        return repository.buscarDetalhes(viagemId, origem, destino);
    }
}
