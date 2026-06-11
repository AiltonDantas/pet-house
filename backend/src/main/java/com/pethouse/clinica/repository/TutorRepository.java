package com.pethouse.clinica.repository;

import com.pethouse.clinica.model.Tutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TutorRepository extends JpaRepository<Tutor, Long> {
    List<Tutor> findByNomeContainingIgnoreCase(String nome);
    Optional<Tutor> findByCpf(String cpf);
    boolean existsByCpf(String cpf);
}
