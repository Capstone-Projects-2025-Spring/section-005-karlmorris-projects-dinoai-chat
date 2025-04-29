package com.dino.backend.model;

import jakarta.persistence.*;

import java.sql.Date;

@Entity
@Table(name = "dino_vocabulary_set")
public class VocabularySet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vocab_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "date", nullable = false)
    private Date date;

    @Lob
    @Column(name = "vocab_json", nullable = false, columnDefinition = "TEXT")
    private String vocabJson;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getVocabJson() {
        return vocabJson;
    }

    public void setVocabJson(String vocabJson) {
        this.vocabJson = vocabJson;
    }
}