package com.pethouse.clinica.service;

import com.pethouse.clinica.model.Consulta;
import com.pethouse.clinica.model.Pagamento;
import com.pethouse.clinica.repository.AnimalRepository;
import com.pethouse.clinica.repository.ConsultaRepository;
import com.pethouse.clinica.repository.PagamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;

@Service
public class RelatorioService {

    @Autowired private ConsultaRepository consultaRepository;
    @Autowired private AnimalRepository animalRepository;
    @Autowired private PagamentoRepository pagamentoRepository;

    public Map<String, Object> dashboard() {
        Map<String, Object> dados = new LinkedHashMap<>();
        LocalDate hoje = LocalDate.now();
        dados.put("totalAnimais", animalRepository.count());
        dados.put("consultasHoje", consultaRepository.countByData(hoje));
        dados.put("pagamentosPendentes", pagamentoRepository.findByStatus(Pagamento.Status.PENDENTE).size());
        Double fat = pagamentoRepository.calcularFaturamentoMensal(hoje.getYear(), hoje.getMonthValue());
        dados.put("faturamentoMensal", fat != null ? fat : 0.0);
        List<Consulta> todas = consultaRepository.findAll();
        int tam = todas.size();
        dados.put("ultimasConsultas", todas.subList(Math.max(0, tam - 5), tam));
        return dados;
    }

    public Map<String, Object> consultasPorPeriodo(LocalDate inicio, LocalDate fim) {
        List<Consulta> lista = consultaRepository.findByDataBetweenOrderByDataAscHorarioAsc(inicio, fim);
        Map<String, Object> rel = new LinkedHashMap<>();
        rel.put("total", lista.size());
        rel.put("agendadas",   lista.stream().filter(c -> c.getStatus() == Consulta.Status.AGENDADA).count());
        rel.put("emAndamento", lista.stream().filter(c -> c.getStatus() == Consulta.Status.EM_ANDAMENTO).count());
        rel.put("finalizadas", lista.stream().filter(c -> c.getStatus() == Consulta.Status.FINALIZADA).count());
        rel.put("canceladas",  lista.stream().filter(c -> c.getStatus() == Consulta.Status.CANCELADA).count());
        rel.put("consultas", lista);
        return rel;
    }

    public Map<String, Double> faturamentoAnual(int ano) {
        Map<String, Double> fat = new LinkedHashMap<>();
        for (int mes = 1; mes <= 12; mes++) {
            String nomeMes = Month.of(mes).getDisplayName(TextStyle.SHORT, new Locale("pt", "BR"));
            Double valor = pagamentoRepository.calcularFaturamentoMensal(ano, mes);
            fat.put(nomeMes, valor != null ? valor : 0.0);
        }
        return fat;
    }

    public Map<String, Long> animaisPorEspecie() {
        Map<String, Long> mapa = new LinkedHashMap<>();
        animalRepository.findAll().forEach(a -> mapa.merge(a.getEspecie(), 1L, Long::sum));
        return mapa;
    }

    public Map<String, Object> pagamentosPorPeriodo(LocalDate inicio, LocalDate fim) {
        List<Pagamento> lista = pagamentoRepository.findByDataPagamentoBetween(inicio, fim);
        double totalPago = lista.stream().filter(p -> p.getStatus() == Pagamento.Status.PAGO).mapToDouble(Pagamento::getValorTotal).sum();
        double totalPendente = lista.stream().filter(p -> p.getStatus() == Pagamento.Status.PENDENTE).mapToDouble(Pagamento::getValorTotal).sum();
        Map<String, Object> rel = new LinkedHashMap<>();
        rel.put("totalRegistros", lista.size());
        rel.put("totalPago", totalPago);
        rel.put("totalPendente", totalPendente);
        rel.put("pagamentos", lista);
        return rel;
    }
}
