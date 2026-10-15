package br.com.muv.controller;

import br.com.muv.model.dto.ViagemConsultaDTO;
import br.com.muv.model.dto.ViagemCadastroRequestDTO;
import br.com.muv.model.dto.ViagemCadastroResponseDTO;
import br.com.muv.service.ViagemCadastroService;
import br.com.muv.service.ViagemConsultaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api/viagens")
@CrossOrigin(origins = "*")
public class ViagemConsultaController {
    private final ViagemConsultaService service;
    private final ViagemCadastroService cadastroService;
    public ViagemConsultaController(ViagemConsultaService service, ViagemCadastroService cadastroService) {
        this.service = service;
        this.cadastroService = cadastroService;
    }

    @PostMapping
    public ResponseEntity<ViagemCadastroResponseDTO> cadastrar(@Valid @RequestBody ViagemCadastroRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cadastroService.cadastrar(request));
    }

    @GetMapping("/consulta")
    public List<ViagemConsultaDTO> pesquisar(
            @RequestParam(defaultValue = "") String origem,
            @RequestParam(defaultValue = "") String destino,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data,
            @RequestParam(defaultValue = "false") boolean arCondicionado,
            @RequestParam(defaultValue = "false") boolean wifi) {
        return service.pesquisar(origem, destino, data == null ? null : Date.valueOf(data), arCondicionado, wifi);
    }
}
