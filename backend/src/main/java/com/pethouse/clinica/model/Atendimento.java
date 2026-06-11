package com.pethouse.clinica.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "atendimentos")
public class Atendimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Consulta e obrigatoria")
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "consulta_id", nullable = false, unique = true)
    private Consulta consulta;

    @NotBlank(message = "Diagnostico e obrigatorio")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String diagnostico;

    @Column(columnDefinition = "TEXT")
    private String procedimentos;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "atendimento_servicos",
        joinColumns = @JoinColumn(name = "atendimento_id"),
        inverseJoinColumns = @JoinColumn(name = "servico_id")
    )
    private List<Servico> servicos = new ArrayList<>();

    @Column(nullable = false)
    private Double valorTotal = 0.0;

    public Atendimento() {}

    public void recalcularTotal() {
        if (servicos != null) {
            this.valorTotal = servicos.stream().mapToDouble(Servico::getValor).sum();
        }
    }

    public void adicionarServico(Servico servico) {
        if (servico != null) { this.servicos.add(servico); recalcularTotal(); }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Consulta getConsulta() { return consulta; }
    public void setConsulta(Consulta consulta) { this.consulta = consulta; }
    public String getDiagnostico() { return diagnostico; }
    public void setDiagnostico(String diagnostico) { this.diagnostico = diagnostico; }
    public String getProcedimentos() { return procedimentos; }
    public void setProcedimentos(String procedimentos) { this.procedimentos = procedimentos; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public List<Servico> getServicos() { return servicos; }
    public void setServicos(List<Servico> servicos) { this.servicos = servicos; recalcularTotal(); }
    public Double getValorTotal() { return valorTotal; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }
}
