package br.com.muv.controller;

import br.com.muv.model.dto.ViagemConsultaDTO;
import br.com.muv.service.ViagemConsultaService;
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
    public ViagemConsultaController(ViagemConsultaService service) { this.service = service; }

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
