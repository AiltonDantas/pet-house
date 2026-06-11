package com.pethouse.clinica.service;

import com.pethouse.clinica.model.Tutor;
import com.pethouse.clinica.repository.TutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TutorService {

    @Autowired
    private TutorRepository tutorRepository;

    public List<Tutor> listarTodos() { return tutorRepository.findAll(); }

    public List<Tutor> buscarPorNome(String nome) {
        return (nome == null || nome.isBlank())
                ? listarTodos()
                : tutorRepository.findByNomeContainingIgnoreCase(nome);
    }

    public Tutor buscarPorId(Long id) {
        return tutorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tutor nao encontrado: " + id));
    }

    public Tutor salvar(Tutor tutor) {
        if (tutor.getNome() == null || tutor.getNome().isBlank())
            throw new IllegalArgumentException("Nome e obrigatorio.");
        if (tutor.getCpf() == null || tutor.getCpf().isBlank())
            throw new IllegalArgumentException("CPF e obrigatorio.");
        if (tutor.getTelefone() == null || tutor.getTelefone().isBlank())
            throw new IllegalArgumentException("Telefone e obrigatorio.");
        return tutorRepository.save(tutor);
    }

    public void excluir(Long id) {
        if (!tutorRepository.existsById(id))
            throw new IllegalArgumentException("Tutor nao encontrado: " + id);
        tutorRepository.deleteById(id);
    }
}
