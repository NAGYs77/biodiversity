package com.biodiversity.demo.config;

import com.biodiversity.demo.model.User;
import com.biodiversity.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        return args -> {
        
            if (userRepository.findByLogin("admin@biodiversity.com").isEmpty()) {
                User admin = new User();
                admin.setLogin("admin@biodiversity.com");
                admin.setEmail("admin@biodiversity.com");
                admin.setUsername("Administrateur");
                admin.setActive(1);
                admin.setRole("ROLE_ADMIN");
                
            
                admin.setPassword(passwordEncoder.encode("arc&stone"));
                
                userRepository.save(admin);
                System.out.println(">>> Compte Administrateur créé : admin@biodiversity.com / arc&stone");
            }
        };
    }
}