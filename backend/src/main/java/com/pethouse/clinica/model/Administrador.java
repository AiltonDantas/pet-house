package com.pethouse.clinica.model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("Administrador")
public class Administrador extends Usuario {

    @Column(name = "nivel_acesso", length = 20)
    private String nivelAcesso;

    public Administrador() { super(); this.nivelAcesso = "TOTAL"; }

    public Administrador(String nome, String cpf, String email,
                         String senha, String telefone, String nivelAcesso) {
        super(nome, cpf, email, senha, telefone);
        this.nivelAcesso = nivelAcesso;
    }

    @Override
    public String getCargo() { return "Administrador"; }

    @Override
    public String exibirInformacoes() {
        return super.exibirInformacoes() + " | Nivel: " + nivelAcesso;
    }

    public String getNivelAcesso() { return nivelAcesso; }
    public void setNivelAcesso(String nivelAcesso) { this.nivelAcesso = nivelAcesso; }
}
