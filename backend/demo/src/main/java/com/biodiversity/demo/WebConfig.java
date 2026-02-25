package com.biodiversity.demo;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // Autorise tes deux ports de développement React (Vite utilise souvent 5173)
                .allowedOrigins("http://localhost:5173", "http://localhost:5174")
                // Autorise toutes les méthodes nécessaires pour le CRUD
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                // Autorise tous les headers (important pour l'auth)
                .allowedHeaders("*")
                // TRÈS IMPORTANT : Autorise l'envoi de credentials (auth, rôles, sessions)
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Cette partie permet à ton navigateur d'accéder physiquement aux images
        // stockées dans le dossier "uploads" à la racine de ton projet.
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}