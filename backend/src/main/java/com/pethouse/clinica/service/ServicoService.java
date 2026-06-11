package com.pethouse.clinica.service;

import com.pethouse.clinica.model.Servico;
import com.pethouse.clinica.repository.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ServicoService {

    @Autowired private ServicoRepository servicoRepository;

    public List<Servico> listarTodos() { return servicoRepository.findAll(); }

    public Servico buscarPorId(Long id) {
        return servicoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Servico nao encontrado: " + id));
    }

    public Servico salvar(Servico servico) {
        if (servico.getNome() == null || servico.getNome().isBlank())
            throw new IllegalArgumentException("Nome do servico e obrigatorio.");
        if (servico.getValor() == null || servico.getValor() < 0)
            throw new IllegalArgumentException("Valor nao pode ser negativo.");
        return servicoRepository.save(servico);
    }

    public void excluir(Long id) {
        if (!servicoRepository.existsById(id))
            throw new IllegalArgumentException("Servico nao encontrado: " + id);
        servicoRepository.deleteById(id);
    }
}
