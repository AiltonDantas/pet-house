package com.pethouse.clinica.repository;

import com.pethouse.clinica.model.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    List<Consulta> findByData(LocalDate data);
    List<Consulta> findByDataBetweenOrderByDataAscHorarioAsc(LocalDate inicio, LocalDate fim);
    List<Consulta> findByVeterinarioIdAndDataAndStatusNot(Long veterinarioId, LocalDate data, Consulta.Status status);
    @Query("SELECT COUNT(c) FROM Consulta c WHERE c.data = :data")
    long countByData(@Param("data") LocalDate data);
    List<Consulta> findByAnimalId(Long animalId);
    List<Consulta> findByTutorId(Long tutorId);
}
