package com.ads.loja.entity;

public class Cliente {
    private long id;
    private String nome;
    private int idade;
    private String email;

    // Constructors
    public Cliente() {}

    public Cliente(long id, String nome, int idade, String email) {
        this.id = id;
        this.nome = nome;
        this.idade = idade;
        this.email = email;
    }

    // Getters and Setters
    public long getId() {
        return id; //Exclusivo para cada cliente;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public int getIdade() {
        return idade;
    }

    public void setIdade(int idade) {
        this.idade = idade;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
