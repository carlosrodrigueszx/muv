package br.com.muv.controller;

import br.com.muv.model.dto.ViagemDetalheResponse;
import br.com.muv.service.ViagemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/viagens")
@CrossOrigin(origins = "*")
public class ViagemController {
    private final ViagemService viagemService;

    public ViagemController(ViagemService viagemService) {
        this.viagemService = viagemService;
    }

    @GetMapping
    public ResponseEntity<List<ViagemDetalheResponse>> listarTodas() {
        return ResponseEntity.ok(viagemService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ViagemDetalheResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(viagemService.buscarPorId(id));
    }
}
