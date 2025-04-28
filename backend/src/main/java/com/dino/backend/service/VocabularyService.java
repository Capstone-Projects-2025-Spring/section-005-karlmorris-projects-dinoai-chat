package com.dino.backend.service;

import com.dino.backend.integration.gemini.GeminiAPIService;
import com.dino.backend.model.UserMessage;
import com.dino.backend.model.VocabularySet;
import com.dino.backend.repository.MessageRepository;
import com.dino.backend.repository.VocabularySetRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VocabularyService {

    @Autowired
    private VocabularySetRepository vocabularySetRepository;

    @Autowired
    private GeminiAPIService geminiAPIService;

    @Autowired
    private MessageRepository messageRepository;

    @Transactional
    public VocabularySet generateDailyVocab(Long userId) {
        LocalDate today = LocalDate.now();
        Date sqlDate = Date.valueOf(today);

        // Check if vocab already exists for today
        Optional<VocabularySet> existing = vocabularySetRepository.findByUserIdAndDate(userId, sqlDate);
        if (existing.isPresent()) {
            return existing.get();
        }

        // Get recent chat history (last 10 user messages)
        List<String> recentMessages = messageRepository.findBySessionUserId(userId)
                .stream()
                .filter(msg -> msg instanceof UserMessage)
                .limit(10)
                .map(msg -> ((UserMessage) msg).getContent())
                .collect(Collectors.toList());

        // Generate vocab using Gemini
        String vocabJson = geminiAPIService.generateVocabulary(userId, recentMessages);

        // Save new vocabulary set
        VocabularySet vocabularySet = new VocabularySet();
        vocabularySet.setUserId(userId);
        vocabularySet.setDate(sqlDate);
        vocabularySet.setVocabJson(vocabJson);

        return vocabularySetRepository.save(vocabularySet);
    }

    @Transactional
    public VocabularySet getDailyVocab(Long userId) {
        LocalDate today = LocalDate.now();
        Date sqlDate = Date.valueOf(today);

        return vocabularySetRepository.findByUserIdAndDate(userId, sqlDate)
                .orElseGet(() -> generateDailyVocab(userId));
    }
}