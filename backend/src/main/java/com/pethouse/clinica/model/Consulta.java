package com.pethouse.clinica.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "consultas")
public class Consulta {

    public enum Status { AGENDADA, EM_ANDAMENTO, FINALIZADA, CANCELADA }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Animal e obrigatorio")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "animal_id", nullable = false)
    private Animal animal;

    @NotNull(message = "Tutor e obrigatorio")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tutor_id", nullable = false)
    private Tutor tutor;

    @NotNull(message = "Veterinario e obrigatorio")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "veterinario_id", nullable = false)
    private Veterinario veterinario;

    @NotNull(message = "Data e obrigatoria")
    @Column(nullable = false)
    private LocalDate data;

    @NotNull(message = "Horario e obrigatorio")
    @Column(nullable = false)
    private LocalTime horario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.AGENDADA;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    public Consulta() {}

    public void cancelar() { this.status = Status.CANCELADA; }
    public void iniciarAtendimento() { this.status = Status.EM_ANDAMENTO; }
    public void finalizar() { this.status = Status.FINALIZADA; }
    public boolean podeAtender() {
        return status == Status.AGENDADA || status == Status.EM_ANDAMENTO;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Animal getAnimal() { return animal; }
    public void setAnimal(Animal animal) { this.animal = animal; }
    public Tutor getTutor() { return tutor; }
    public void setTutor(Tutor tutor) { this.tutor = tutor; }
    public Veterinario getVeterinario() {
    return veterinario;
}

public void setVeterinario(Veterinario veterinario) {
    this.veterinario = veterinario;
}
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public LocalTime getHorario() { return horario; }
    public void setHorario(LocalTime horario) { this.horario = horario; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}
