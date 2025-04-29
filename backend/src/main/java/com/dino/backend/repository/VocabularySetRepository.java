package com.dino.backend.repository;

import com.dino.backend.model.VocabularySet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.Optional;

@Repository
public interface VocabularySetRepository extends JpaRepository<VocabularySet, Long> {
    Optional<VocabularySet> findByUserIdAndDate(Long userId, Date date);
}