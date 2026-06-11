package com.pethouse.clinica.controller;

import com.pethouse.clinica.model.Tutor;
import com.pethouse.clinica.service.TutorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tutores")
public class TutorController {

    @Autowired private TutorService tutorService;

    @GetMapping
    public ResponseEntity<List<Tutor>> listar(@RequestParam(required = false) String nome) {
        return ResponseEntity.ok(nome != null ? tutorService.buscarPorNome(nome) : tutorService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        try { return ResponseEntity.ok(tutorService.buscarPorId(id)); }
        catch (IllegalArgumentException e) { return ResponseEntity.notFound().build(); }
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Tutor tutor) {
        try { return ResponseEntity.ok(tutorService.salvar(tutor)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Tutor tutor) {
        try { tutor.setId(id); return ResponseEntity.ok(tutorService.salvar(tutor)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        try { tutorService.excluir(id); return ResponseEntity.ok(Map.of("mensagem", "Tutor excluido.")); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }
}
