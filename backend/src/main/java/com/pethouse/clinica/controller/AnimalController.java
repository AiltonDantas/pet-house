package com.pethouse.clinica.controller;

import com.pethouse.clinica.model.Animal;
import com.pethouse.clinica.service.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/animais")
public class AnimalController {

    @Autowired private AnimalService animalService;

    @GetMapping
    public ResponseEntity<List<Animal>> listar(@RequestParam(required = false) Long tutorId) {
        return ResponseEntity.ok(tutorId != null ? animalService.listarPorTutor(tutorId) : animalService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        try { return ResponseEntity.ok(animalService.buscarPorId(id)); }
        catch (IllegalArgumentException e) { return ResponseEntity.notFound().build(); }
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Animal animal) {
        try { return ResponseEntity.ok(animalService.salvar(animal)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Animal animal) {
        try { animal.setId(id); return ResponseEntity.ok(animalService.salvar(animal)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        try { animalService.excluir(id); return ResponseEntity.ok(Map.of("mensagem", "Animal excluido.")); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }
}
