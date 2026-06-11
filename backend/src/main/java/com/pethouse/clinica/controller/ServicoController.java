package com.pethouse.clinica.controller;

import com.pethouse.clinica.model.Servico;
import com.pethouse.clinica.service.ServicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/servicos")
public class ServicoController {

    @Autowired private ServicoService servicoService;

    @GetMapping
    public ResponseEntity<List<Servico>> listar() { return ResponseEntity.ok(servicoService.listarTodos()); }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        try { return ResponseEntity.ok(servicoService.buscarPorId(id)); }
        catch (IllegalArgumentException e) { return ResponseEntity.notFound().build(); }
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Servico servico) {
        try { return ResponseEntity.ok(servicoService.salvar(servico)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Servico servico) {
        try { servico.setId(id); return ResponseEntity.ok(servicoService.salvar(servico)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        try { servicoService.excluir(id); return ResponseEntity.ok(Map.of("mensagem", "Servico excluido.")); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }
}
