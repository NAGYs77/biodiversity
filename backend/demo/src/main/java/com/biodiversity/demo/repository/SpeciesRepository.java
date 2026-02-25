package com.biodiversity.demo.repository;

import com.biodiversity.demo.model.Species;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpeciesRepository extends JpaRepository<Species, Long> {
    // Cette interface vide te donne déjà accès aux méthodes :
    // .save(), .findAll(), .findById(), .delete()
}