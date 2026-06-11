package com.pethouse.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Tutor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String cpf;
    private String telefone;
    private String endereco;
}