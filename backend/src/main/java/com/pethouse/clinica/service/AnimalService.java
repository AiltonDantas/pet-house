package com.pethouse.clinica.service;

import com.pethouse.clinica.model.Animal;
import com.pethouse.clinica.repository.AnimalRepository;
import com.pethouse.clinica.repository.TutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AnimalService {

    @Autowired private AnimalRepository animalRepository;
    @Autowired private TutorRepository tutorRepository;

    public List<Animal> listarTodos() { return animalRepository.findAll(); }
    public List<Animal> listarPorTutor(Long tutorId) { return animalRepository.findByTutorId(tutorId); }

    public Animal buscarPorId(Long id) {
        return animalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Animal nao encontrado: " + id));
    }

    public Animal salvar(Animal animal) {
        if (animal.getNome() == null || animal.getNome().isBlank())
            throw new IllegalArgumentException("Nome do animal e obrigatorio.");
        if (animal.getEspecie() == null || animal.getEspecie().isBlank())
            throw new IllegalArgumentException("Especie e obrigatoria.");
        if (animal.getTutor() == null || animal.getTutor().getId() == null)
            throw new IllegalArgumentException("Tutor e obrigatorio para o animal.");
        if (!tutorRepository.existsById(animal.getTutor().getId()))
            throw new IllegalArgumentException("Tutor nao encontrado.");
        return animalRepository.save(animal);
    }

    public void excluir(Long id) {
        if (!animalRepository.existsById(id))
            throw new IllegalArgumentException("Animal nao encontrado: " + id);
        animalRepository.deleteById(id);
    }
}
