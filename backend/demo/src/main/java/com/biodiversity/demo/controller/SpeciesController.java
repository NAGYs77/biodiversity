package com.biodiversity.demo.controller;

import com.biodiversity.demo.model.Species;
import com.biodiversity.demo.repository.SpeciesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/species")
@CrossOrigin(origins = "http://localhost:5173")
public class SpeciesController {

    @Autowired
    private SpeciesRepository speciesRepository;

    
    private final String UPLOAD_DIR = "uploads/";

    @GetMapping
    public List<Species> getAllSpecies() {
        return speciesRepository.findAll();
    }

    @PostMapping("/upload")
    public Species addSpeciesWithFiles(
            @RequestParam("commonName") String commonName,
            @RequestParam("scientificName") String scientificName,
            @RequestParam(value = "attachments", required = false) MultipartFile[] files) throws IOException {

        
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        List<String> fileNames = new ArrayList<>();

        // 2. Sauvegarder chaque fichier
        if (files != null) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    // On ajoute un ID unique au nom pour éviter les doublons
                    String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                    Path filePath = uploadPath.resolve(fileName);
                    Files.copy(file.getInputStream(), filePath);
                    fileNames.add(fileName);
                }
            }
        }

        // 3. Créer et enregistrer l'espèce
        Species species = Species.builder()
                .commonName(commonName)
                .scientificName(scientificName)
                .attachments(fileNames) 
                .build();

        return speciesRepository.save(species);
    }




}