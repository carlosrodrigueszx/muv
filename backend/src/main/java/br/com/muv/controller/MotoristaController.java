package br.com.muv.controller;

import br.com.muv.model.dto.MotoristaRequestDTO;
import br.com.muv.model.dto.MotoristaResponseDTO;
import br.com.muv.service.MotoristaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/motoristas")
@CrossOrigin(origins = "*")
public class MotoristaController {
    private final MotoristaService motoristaService;

    public MotoristaController(MotoristaService motoristaService) {
        this.motoristaService = motoristaService;
    }

    // Rota de Cadastro
    @PostMapping
    public ResponseEntity<MotoristaResponseDTO> cadastrar(@RequestBody MotoristaRequestDTO dto) {
        MotoristaResponseDTO resposta  = motoristaService.cadastrar(dto);
        return new ResponseEntity<>(resposta, HttpStatus.CREATED);
    }

    // Rota para listar TODOS os motoristas
    // Lista por empresa se for passado como parâmetro um id (ou seja, é opcional)
    @GetMapping
    public ResponseEntity<List<MotoristaResponseDTO>> listarTodos(@RequestParam(required = false) Long empresaId) {

//        if (empresaId != null) {
//            List<MotoristaResponseDTO> filtrados = motoristaService.listarPorEmpresa(empresaId);
//            return ResponseEntity.ok(filtrados);
//        }

        List<MotoristaResponseDTO> lista = motoristaService.listarTodos();
        return ResponseEntity.ok(lista);
    }
}
