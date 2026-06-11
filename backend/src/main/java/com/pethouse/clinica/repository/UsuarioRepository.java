package com.pethouse.clinica.repository;

import com.pethouse.clinica.model.Usuario;
import com.pethouse.clinica.model.Veterinario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmailAndAtivoTrue(String email);
    List<Usuario> findByAtivoTrue();
    @Query("SELECT u FROM Usuario u WHERE TYPE(u) = Veterinario AND u.ativo = true")
    List<Veterinario> findVeterinarios();
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
}
