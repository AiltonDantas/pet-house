package com.pethouse.clinica.controller;

import com.pethouse.clinica.model.Pagamento;
import com.pethouse.clinica.service.PagamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pagamentos")
public class PagamentoController {

    @Autowired private PagamentoService pagamentoService;

    @GetMapping
    public ResponseEntity<List<Pagamento>> listar() { return ResponseEntity.ok(pagamentoService.listarTodos()); }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        try { return ResponseEntity.ok(pagamentoService.buscarPorId(id)); }
        catch (IllegalArgumentException e) { return ResponseEntity.notFound().build(); }
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Pagamento pagamento) {
        try { return ResponseEntity.ok(pagamentoService.salvar(pagamento)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Pagamento pagamento) {
        try { pagamento.setId(id); return ResponseEntity.ok(pagamentoService.salvar(pagamento)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @PatchMapping("/{id}/confirmar")
    public ResponseEntity<?> confirmar(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            Pagamento.FormaPagamento forma = Pagamento.FormaPagamento.valueOf(body.get("formaPagamento"));
            return ResponseEntity.ok(pagamentoService.confirmar(id, forma));
        } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelar(@PathVariable Long id) {
        try { return ResponseEntity.ok(pagamentoService.cancelar(id)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }
}
