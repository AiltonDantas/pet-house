package com.pethouse.clinica.controller;

import com.pethouse.clinica.service.RelatorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    @Autowired private RelatorioService relatorioService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard() {
        return ResponseEntity.ok(relatorioService.dashboard());
    }

    @GetMapping("/consultas")
    public ResponseEntity<Map<String, Object>> consultas(
            @RequestParam String inicio, @RequestParam String fim) {
        return ResponseEntity.ok(relatorioService.consultasPorPeriodo(
                LocalDate.parse(inicio), LocalDate.parse(fim)));
    }

    @GetMapping("/faturamento/{ano}")
    public ResponseEntity<Map<String, Double>> faturamento(@PathVariable int ano) {
        return ResponseEntity.ok(relatorioService.faturamentoAnual(ano));
    }

    @GetMapping("/animais/especies")
    public ResponseEntity<Map<String, Long>> animaisPorEspecie() {
        return ResponseEntity.ok(relatorioService.animaisPorEspecie());
    }

    @GetMapping("/pagamentos")
    public ResponseEntity<Map<String, Object>> pagamentos(
            @RequestParam String inicio, @RequestParam String fim) {
        return ResponseEntity.ok(relatorioService.pagamentosPorPeriodo(
                LocalDate.parse(inicio), LocalDate.parse(fim)));
    }
}
