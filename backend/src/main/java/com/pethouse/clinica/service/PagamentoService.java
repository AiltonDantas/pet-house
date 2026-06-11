package com.pethouse.clinica.service;

import com.pethouse.clinica.model.Pagamento;
import com.pethouse.clinica.repository.ConsultaRepository;
import com.pethouse.clinica.repository.PagamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class PagamentoService {

    @Autowired private PagamentoRepository pagamentoRepository;
    @Autowired private ConsultaRepository consultaRepository;

    public List<Pagamento> listarTodos() { return pagamentoRepository.findAll(); }

    public Pagamento buscarPorId(Long id) {
        return pagamentoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pagamento nao encontrado: " + id));
    }

    public Pagamento salvar(Pagamento pagamento) {
        if (pagamento.getConsulta() == null || pagamento.getConsulta().getId() == null)
            throw new IllegalArgumentException("Consulta e obrigatoria.");
        if (pagamento.getValorTotal() == null || pagamento.getValorTotal() < 0)
            throw new IllegalArgumentException("Valor nao pode ser negativo.");
        if (!consultaRepository.existsById(pagamento.getConsulta().getId()))
            throw new IllegalArgumentException("Consulta nao encontrada.");
        return pagamentoRepository.save(pagamento);
    }

    public Pagamento confirmar(Long id, Pagamento.FormaPagamento forma) {
        Pagamento p = buscarPorId(id);
        p.setFormaPagamento(forma);
        if (!p.confirmarPagamento())
            throw new IllegalArgumentException("Pagamento nao pode ser confirmado. Status: " + p.getStatus());
        return pagamentoRepository.save(p);
    }

    public Pagamento cancelar(Long id) {
        Pagamento p = buscarPorId(id);
        if (!p.cancelar())
            throw new IllegalArgumentException("Pagamento nao pode ser cancelado. Status: " + p.getStatus());
        return pagamentoRepository.save(p);
    }

    public Double calcularFaturamentoMensal(int ano, int mes) {
        if (mes < 1 || mes > 12) throw new IllegalArgumentException("Mes invalido.");
        Double r = pagamentoRepository.calcularFaturamentoMensal(ano, mes);
        return r != null ? r : 0.0;
    }

    public Double calcularTotalPendente() {
        Double r = pagamentoRepository.calcularTotalPendente();
        return r != null ? r : 0.0;
    }

    public List<Pagamento> listarPorPeriodo(LocalDate inicio, LocalDate fim) {
        return pagamentoRepository.findByDataPagamentoBetween(inicio, fim);
    }
}
