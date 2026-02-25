package com.biodiversity.demo.controller;

import com.biodiversity.demo.model.User;
import com.biodiversity.demo.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> data) {

        String email = data.get("email");
        String name = data.get("name");
        String password = data.get("password");

        
        if (email == null || name == null || password == null) {
            return ResponseEntity.badRequest().body("Données d'inscription incomplètes (email, name ou password manquant).");
        }

    
        if (userRepository.findByLogin(email).isPresent()) {
            return ResponseEntity.badRequest().body("Cet email est déjà utilisé.");
        }

    
        User newUser = new User();
        newUser.setLogin(email);    
        newUser.setEmail(email);    
        newUser.setUsername(name);  
        newUser.setPassword(passwordEncoder.encode(password)); 
        newUser.setActive(1);       
        
        
        if (userRepository.count() == 0 || email.endsWith("@admin.com")) {
            newUser.setRole("ROLE_ADMIN");
        } else {
            newUser.setRole("ROLE_USER");
        }

        
        User savedUser = userRepository.save(newUser);
        

        savedUser.setPassword(null); 
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> data, HttpServletRequest request) {
        String login = data.get("login");
        String passwordEnClair = data.get("password");

        if (login == null || passwordEnClair == null) {
            return ResponseEntity.badRequest().body("Login ou mot de passe manquant.");
        }

        return userRepository.findByLogin(login)
                .map(user -> {
                    if (passwordEncoder.matches(passwordEnClair, user.getPassword())) {
                        
                    
                        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                user.getLogin(), 
                                null, 
                                Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
                        );

                        SecurityContextHolder.getContext().setAuthentication(auth);

                    
                        HttpSession session = request.getSession(true);
                        session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

                        user.setPassword(null); 
                        return ResponseEntity.ok(user); 
                    } else {
                        return ResponseEntity.status(401).body("Mot de passe incorrect");
                    }
                })
                .orElseGet(() -> ResponseEntity.status(401).body("Identifiants incorrects"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate(); 
        }
        SecurityContextHolder.clearContext(); 
        return ResponseEntity.ok("Déconnecté avec succès");
    }
}