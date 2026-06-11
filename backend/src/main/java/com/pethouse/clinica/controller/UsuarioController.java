package com.pethouse.clinica.controller;

import com.pethouse.clinica.model.Administrador;
import com.pethouse.clinica.model.Recepcionista;
import com.pethouse.clinica.model.Usuario;
import com.pethouse.clinica.model.Veterinario;
import com.pethouse.clinica.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(usuarioService.login(body.get("email"), body.get("senha")));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(Map.of("erro", e.getMessage()));
        }
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/usuarios/veterinarios")
    public ResponseEntity<List<Veterinario>> listarVeterinarios() {
        return ResponseEntity.ok(usuarioService.listarVeterinarios());
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(usuarioService.buscarPorId(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/usuarios")
    public ResponseEntity<?> salvar(@RequestBody Map<String, Object> body) {
        try {
            Usuario usuario = criarUsuarioPorCargo(body);
            return ResponseEntity.ok(usuarioService.salvar(usuario));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            Usuario usuario = criarUsuarioPorCargo(body);
            usuario.setId(id);
            return ResponseEntity.ok(usuarioService.salvar(usuario));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        try {
            usuarioService.excluir(id);
            return ResponseEntity.ok(Map.of("mensagem", "Excluido."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    private Usuario criarUsuarioPorCargo(Map<String, Object> body) {
        String cargo = valor(body, "cargo");
        String nome = valor(body, "nome");
        String cpf = valor(body, "cpf");
        String email = valor(body, "email");
        String senha = valor(body, "senha");
        String telefone = valor(body, "telefone");

        if (cargo == null || cargo.isBlank()) {
            throw new IllegalArgumentException("Cargo e obrigatorio.");
        }

        if (cargo.equalsIgnoreCase("Administrador")) {
            String nivelAcesso = valor(body, "nivelAcesso");
            if (nivelAcesso == null || nivelAcesso.isBlank()) {
                nivelAcesso = "TOTAL";
            }
            return new Administrador(nome, cpf, email, senha, telefone, nivelAcesso);
        }

        if (cargo.equalsIgnoreCase("Recepcionista")) {
            String turno = valor(body, "turno");
            if (turno == null || turno.isBlank()) {
                turno = "MANHA";
            }
            return new Recepcionista(nome, cpf, email, senha, telefone, turno);
        }

        if (cargo.equalsIgnoreCase("Veterinario") || cargo.equalsIgnoreCase("Veterinário")) {
            String especialidade = valor(body, "especialidade");
            String crmv = valor(body, "crmv");
            return new Veterinario(nome, cpf, email, senha, telefone, especialidade, crmv);
        }

        throw new IllegalArgumentException("Cargo invalido: " + cargo);
    }

    private String valor(Map<String, Object> body, String chave) {
        Object valor = body.get(chave);
        return valor == null ? null : valor.toString();
    }
}