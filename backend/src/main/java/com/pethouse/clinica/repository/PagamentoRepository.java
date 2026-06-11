package com.pethouse.clinica.repository;

import com.pethouse.clinica.model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
    List<Pagamento> findByStatus(Pagamento.Status status);
    List<Pagamento> findByDataPagamentoBetween(LocalDate inicio, LocalDate fim);
    @Query("SELECT COALESCE(SUM(p.valorTotal), 0) FROM Pagamento p WHERE p.status = 'PAGO' AND YEAR(p.dataPagamento) = :ano AND MONTH(p.dataPagamento) = :mes")
    Double calcularFaturamentoMensal(@Param("ano") int ano, @Param("mes") int mes);
    @Query("SELECT COALESCE(SUM(p.valorTotal), 0) FROM Pagamento p WHERE p.status = 'PENDENTE'")
    Double calcularTotalPendente();
}
