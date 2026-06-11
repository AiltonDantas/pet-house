package com.pethouse.clinica.controller;

import com.pethouse.clinica.model.Atendimento;
import com.pethouse.clinica.service.AtendimentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/atendimentos")
public class AtendimentoController {

    @Autowired private AtendimentoService atendimentoService;

    @GetMapping
    public ResponseEntity<List<Atendimento>> listar() { return ResponseEntity.ok(atendimentoService.listarTodos()); }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        try { return ResponseEntity.ok(atendimentoService.buscarPorId(id)); }
        catch (IllegalArgumentException e) { return ResponseEntity.notFound().build(); }
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Atendimento atendimento) {
        try { return ResponseEntity.ok(atendimentoService.salvar(atendimento)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @PatchMapping("/{atendimentoId}/servicos/{servicoId}")
    public ResponseEntity<?> adicionarServico(@PathVariable Long atendimentoId, @PathVariable Long servicoId) {
        try { return ResponseEntity.ok(atendimentoService.adicionarServico(atendimentoId, servicoId)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }
}
