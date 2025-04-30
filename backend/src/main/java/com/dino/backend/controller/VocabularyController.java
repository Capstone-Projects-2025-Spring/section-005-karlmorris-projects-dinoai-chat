package com.dino.backend.controller;

import com.dino.backend.model.User;
import com.dino.backend.model.VocabularySet;
import com.dino.backend.repository.UserRepository;
import com.dino.backend.service.VocabularyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vocabulary")
public class VocabularyController {

    @Autowired
    private VocabularyService vocabularyService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/daily")
    public ResponseEntity<?> getDailyVocab(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        VocabularySet vocabSet = vocabularyService.getDailyVocab(user.getId(), user.getNativeLanguage());

        return ResponseEntity.ok(vocabSet);
    }
} 