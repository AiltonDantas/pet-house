package com.pethouse.clinica.service;

import com.pethouse.clinica.model.Consulta;
import com.pethouse.clinica.repository.AnimalRepository;
import com.pethouse.clinica.repository.ConsultaRepository;
import com.pethouse.clinica.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class ConsultaService {

    @Autowired private ConsultaRepository consultaRepository;
    @Autowired private AnimalRepository animalRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    public List<Consulta> listarTodas() { return consultaRepository.findAll(); }
    public List<Consulta> listarHoje() { return consultaRepository.findByData(LocalDate.now()); }

    public List<Consulta> listarPorPeriodo(LocalDate inicio, LocalDate fim) {
        if (inicio == null || fim == null) throw new IllegalArgumentException("Datas sao obrigatorias.");
        if (inicio.isAfter(fim)) throw new IllegalArgumentException("Data inicio nao pode ser apos data fim.");
        return consultaRepository.findByDataBetweenOrderByDataAscHorarioAsc(inicio, fim);
    }

    public Consulta buscarPorId(Long id) {
        return consultaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Consulta nao encontrada: " + id));
    }

    public Consulta salvar(Consulta consulta) {
        validar(consulta);
        if (consulta.getId() == null) verificarConflito(consulta);
        return consultaRepository.save(consulta);
    }

    public Consulta cancelar(Long id) {
        Consulta c = buscarPorId(id);
        if (c.getStatus() == Consulta.Status.FINALIZADA)
            throw new IllegalArgumentException("Nao e possivel cancelar consulta finalizada.");
        if (c.getStatus() == Consulta.Status.CANCELADA)
            throw new IllegalArgumentException("Consulta ja esta cancelada.");
        c.cancelar();
        return consultaRepository.save(c);
    }

    public Consulta iniciarAtendimento(Long id) {
        Consulta c = buscarPorId(id);
        if (c.getStatus() != Consulta.Status.AGENDADA)
            throw new IllegalArgumentException("Somente consultas AGENDADAS podem ser iniciadas.");
        c.iniciarAtendimento();
        return consultaRepository.save(c);
    }

    public Consulta finalizar(Long id) {
        Consulta c = buscarPorId(id);
        if (c.getStatus() != Consulta.Status.EM_ANDAMENTO)
            throw new IllegalArgumentException("Somente consultas EM_ANDAMENTO podem ser finalizadas.");
        c.finalizar();
        return consultaRepository.save(c);
    }

    public void excluir(Long id) {
        if (!consultaRepository.existsById(id))
            throw new IllegalArgumentException("Consulta nao encontrada: " + id);
        consultaRepository.deleteById(id);
    }

    private void validar(Consulta c) {
        if (c.getAnimal() == null || c.getAnimal().getId() == null)
            throw new IllegalArgumentException("Animal e obrigatorio.");
        if (c.getVeterinario() == null || c.getVeterinario().getId() == null)
            throw new IllegalArgumentException("Veterinario e obrigatorio.");
        if (c.getTutor() == null || c.getTutor().getId() == null)
            throw new IllegalArgumentException("Tutor e obrigatorio.");
        if (c.getData() == null) throw new IllegalArgumentException("Data e obrigatoria.");
        if (c.getHorario() == null) throw new IllegalArgumentException("Horario e obrigatorio.");
        if (c.getId() == null && c.getData().isBefore(LocalDate.now()))
            throw new IllegalArgumentException("Nao e possivel agendar no passado.");
    }

    private void verificarConflito(Consulta nova) {
        List<Consulta> existentes = consultaRepository.findByVeterinarioIdAndDataAndStatusNot(
                nova.getVeterinario().getId(), nova.getData(), Consulta.Status.CANCELADA);
        for (Consulta ex : existentes) {
            if (ex.getHorario().equals(nova.getHorario()))
                throw new IllegalArgumentException("Veterinario ja possui consulta neste horario.");
        }
    }
}
