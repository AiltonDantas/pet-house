package com.pethouse.clinica.model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("Recepcionista")
public class Recepcionista extends Usuario {

    @Column(name = "turno", length = 10)
    private String turno;

    public Recepcionista() { super(); this.turno = "MANHA"; }

    public Recepcionista(String nome, String cpf, String email,
                         String senha, String telefone, String turno) {
        super(nome, cpf, email, senha, telefone);
        this.turno = turno;
    }

    @Override
    public String getCargo() { return "Recepcionista"; }

    @Override
    public String exibirInformacoes() {
        return super.exibirInformacoes() + " | Turno: " + turno;
    }

    public String getTurno() { return turno; }
    public void setTurno(String turno) { this.turno = turno; }
}
