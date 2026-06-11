package com.pethouse.clinica.controller;

import com.pethouse.clinica.model.Consulta;
import com.pethouse.clinica.service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consultas")
public class ConsultaController {

    @Autowired private ConsultaService consultaService;

    @GetMapping
    public ResponseEntity<List<Consulta>> listar(
            @RequestParam(required = false) String inicio,
            @RequestParam(required = false) String fim) {
        if (inicio != null && fim != null)
            return ResponseEntity.ok(consultaService.listarPorPeriodo(LocalDate.parse(inicio), LocalDate.parse(fim)));
        return ResponseEntity.ok(consultaService.listarTodas());
    }

    @GetMapping("/hoje")
    public ResponseEntity<List<Consulta>> hoje() { return ResponseEntity.ok(consultaService.listarHoje()); }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        try { return ResponseEntity.ok(consultaService.buscarPorId(id)); }
        catch (IllegalArgumentException e) { return ResponseEntity.notFound().build(); }
    }

    @PostMapping
public ResponseEntity<?> salvar(@RequestBody Consulta consulta) {
    try {
        return ResponseEntity.ok(consultaService.salvar(consulta));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body(Map.of(
            "erro", e.getClass().getName(),
            "mensagem", e.getMessage()
        ));
    }
}
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Consulta consulta) {
        try { consulta.setId(id); return ResponseEntity.ok(consultaService.salvar(consulta)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelar(@PathVariable Long id) {
        try { return ResponseEntity.ok(consultaService.cancelar(id)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @PatchMapping("/{id}/iniciar")
    public ResponseEntity<?> iniciar(@PathVariable Long id) {
        try { return ResponseEntity.ok(consultaService.iniciarAtendimento(id)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<?> finalizar(@PathVariable Long id) {
        try { return ResponseEntity.ok(consultaService.finalizar(id)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        try { consultaService.excluir(id); return ResponseEntity.ok(Map.of("mensagem", "Consulta excluida.")); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }
}
