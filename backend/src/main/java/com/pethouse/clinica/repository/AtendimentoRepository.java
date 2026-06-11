package com.pethouse.clinica.repository;

import com.pethouse.clinica.model.Atendimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AtendimentoRepository extends JpaRepository<Atendimento, Long> {
    Optional<Atendimento> findByConsultaId(Long consultaId);
    boolean existsByConsultaId(Long consultaId);
}
