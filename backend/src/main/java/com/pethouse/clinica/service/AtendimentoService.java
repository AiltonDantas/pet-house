package com.pethouse.clinica.service;

import com.pethouse.clinica.model.Atendimento;
import com.pethouse.clinica.model.Consulta;
import com.pethouse.clinica.model.Servico;
import com.pethouse.clinica.repository.AtendimentoRepository;
import com.pethouse.clinica.repository.ConsultaRepository;
import com.pethouse.clinica.repository.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AtendimentoService {

    @Autowired private AtendimentoRepository atendimentoRepository;
    @Autowired private ConsultaRepository consultaRepository;
    @Autowired private ServicoRepository servicoRepository;

    public List<Atendimento> listarTodos() { return atendimentoRepository.findAll(); }

    public Atendimento buscarPorId(Long id) {
        return atendimentoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Atendimento nao encontrado: " + id));
    }

    public Atendimento salvar(Atendimento atendimento) {
        if (atendimento.getConsulta() == null || atendimento.getConsulta().getId() == null)
            throw new IllegalArgumentException("Consulta e obrigatoria.");
        if (atendimento.getDiagnostico() == null || atendimento.getDiagnostico().isBlank())
            throw new IllegalArgumentException("Diagnostico e obrigatorio.");

        Consulta consulta = consultaRepository.findById(atendimento.getConsulta().getId())
                .orElseThrow(() -> new IllegalArgumentException("Consulta nao encontrada."));
        if (!consulta.podeAtender())
            throw new IllegalArgumentException("Consulta nao pode ser atendida. Status: " + consulta.getStatus());

        atendimento.recalcularTotal();
        Atendimento salvo = atendimentoRepository.save(atendimento);
        consulta.finalizar();
        consultaRepository.save(consulta);
        return salvo;
    }

    public Atendimento adicionarServico(Long atendimentoId, Long servicoId) {
        Atendimento atendimento = buscarPorId(atendimentoId);
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new IllegalArgumentException("Servico nao encontrado: " + servicoId));
        atendimento.adicionarServico(servico);
        return atendimentoRepository.save(atendimento);
    }
}
