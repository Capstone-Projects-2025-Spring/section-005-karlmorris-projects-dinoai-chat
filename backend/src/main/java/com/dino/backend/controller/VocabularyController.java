package com.dino.backend.controller;

import com.dino.backend.model.User;
import com.dino.backend.model.VocabularySet;
import com.dino.backend.repository.UserRepository;
import com.dino.backend.service.VocabularyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vocabulary")
public class VocabularyController {

    private static final Logger logger = LoggerFactory.getLogger(VocabularyController.class);

    @Autowired
    private VocabularyService vocabularyService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/daily/{userId}")
    public ResponseEntity<VocabularySet> getDailyVocabulary(@PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warn("Unauthenticated request to /api/vocabulary/daily/{}", userId);
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        String username = authentication.getName();
        logger.debug("Authenticated username: {}, requested userId: {}", username, userId);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.error("User not found for username: {}", username);
                    return new RuntimeException("Authenticated user not found");
                });

        logger.debug("Found user: userId={}, username={}", user.getUserId(), user.getUsername());
        if (!user.getUserId().equals(userId)) {
            logger.warn("Access denied: authenticated userId={} does not match requested userId={}", user.getUserId(), userId);
            return ResponseEntity.status(403).build(); // Forbidden
        }

        VocabularySet vocabularySet = vocabularyService.getDailyVocab(userId);
        return ResponseEntity.ok(vocabularySet);
    }
}