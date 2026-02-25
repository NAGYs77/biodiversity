package com.biodiversity.demo.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor; // Ajouté pour gérer le constructeur vide automatiquement

@Entity
@Table(name = "UTILISATEUR")
@Data
@NoArgsConstructor // Génère le constructeur public User
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="USER_ID", updatable = false, nullable = false)
    private Long id;

    @Column(name ="LOGIN", unique = true, nullable = false)
    private String login;

    @Column(name ="USERNAME", nullable = false)
    private String username;

    @Column(name ="USER_EMAIL", nullable = false)
    private String email;

    @Column(name ="USER_PASSWORD", nullable = false)
    private String password;

    @Column(name ="USER_ACTIVE", nullable = false)
    private Integer active;

    // Constructeur complet pour la création d'utilisateur
    public User(String login, String password, Integer active, String email, String username) {
        this.login = login;
        this.password = password;
        this.active = active;
        this.email = email;
        this.username = username;
    }

    // Constructeur léger (utile pour certains cas de test ou sélection)
    public User(long id, String login) {
        this.id = id;
        this.login = login;
    }


    @Column(name ="USER_ROLE", nullable = false)
private String role; // Valeurs possibles : "ROLE_ADMIN" ou "ROLE_USER"

// Modifie ton constructeur complet
public User(String login, String password, Integer active, String email, String username, String role) {
    this.login = login;
    this.password = password;
    this.active = active;
    this.email = email;
    this.username = username;
    this.role = role;
 }
}