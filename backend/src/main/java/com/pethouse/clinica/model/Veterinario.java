package com.pethouse.clinica.model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("Veterinario")
public class Veterinario extends Usuario {

    @Column(name = "especialidade", length = 80)
    private String especialidade;

    @Column(name = "crmv", length = 20)
    private String crmv;

    public Veterinario() { super(); }

    public Veterinario(String nome, String cpf, String email, String senha,
                       String telefone, String especialidade, String crmv) {
        super(nome, cpf, email, senha, telefone);
        this.especialidade = especialidade;
        this.crmv = crmv;
    }

    @Override
    public String getCargo() { return "Veterinario"; }

    @Override
    public String exibirInformacoes() {
        return super.exibirInformacoes()
                + " | Especialidade: " + especialidade
                + " | CRMV: " + crmv;
    }

    public String getEspecialidade() { return especialidade; }
    public void setEspecialidade(String especialidade) { this.especialidade = especialidade; }
    public String getCrmv() { return crmv; }
    public void setCrmv(String crmv) { this.crmv = crmv; }
}
