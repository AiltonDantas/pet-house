package com.pethouse.clinica.service;

import com.pethouse.clinica.model.Usuario;
import com.pethouse.clinica.model.Veterinario;
import com.pethouse.clinica.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario login(String email, String senha) {
        if (email == null || email.isBlank()) throw new IllegalArgumentException("Email e obrigatorio.");
        if (senha == null || senha.isBlank()) throw new IllegalArgumentException("Senha e obrigatoria.");
        Usuario usuario = usuarioRepository.findByEmailAndAtivoTrue(email)
                .orElseThrow(() -> new IllegalArgumentException("Email ou senha invalidos."));
        if (!usuario.autenticar(senha)) throw new IllegalArgumentException("Email ou senha invalidos.");
        return usuario;
    }

    public List<Usuario> listarTodos() { return usuarioRepository.findByAtivoTrue(); }
    public List<Veterinario> listarVeterinarios() { return usuarioRepository.findVeterinarios(); }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado: " + id));
    }

    public Usuario salvar(Usuario usuario) {
        if (usuario.getNome() == null || usuario.getNome().isBlank())
            throw new IllegalArgumentException("Nome e obrigatorio.");
        if (usuario.getEmail() == null || !usuario.getEmail().contains("@"))
            throw new IllegalArgumentException("Email invalido.");
        if (usuario.getSenha() == null || usuario.getSenha().length() < 6)
            throw new IllegalArgumentException("Senha deve ter minimo 6 caracteres.");
        if (usuario.getCpf() == null || usuario.getCpf().isBlank())
            throw new IllegalArgumentException("CPF e obrigatorio.");
        return usuarioRepository.save(usuario);
    }

    public void excluir(Long id) {
        Usuario u = buscarPorId(id);
        u.setAtivo(false);
        usuarioRepository.save(u);
    }
}
