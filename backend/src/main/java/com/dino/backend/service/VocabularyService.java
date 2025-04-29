package com.dino.backend.service;

import com.dino.backend.integration.gemini.GeminiAPIService;
import com.dino.backend.model.UserMessage;
import com.dino.backend.model.VocabularySet;
import com.dino.backend.repository.MessageRepository;
import com.dino.backend.repository.VocabularySetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VocabularyService {

    private static final Logger logger = LoggerFactory.getLogger(VocabularyService.class);

    private final VocabularySetRepository vocabularySetRepository;
    private final MessageRepository messageRepository;
    private final GeminiAPIService geminiAPIService;

    public VocabularyService(
            VocabularySetRepository vocabularySetRepository,
            MessageRepository messageRepository,
            GeminiAPIService geminiAPIService) {
        this.vocabularySetRepository = vocabularySetRepository;
        this.messageRepository = messageRepository;
        this.geminiAPIService = geminiAPIService;
    }

    @Transactional
    public VocabularySet getDailyVocab(Long userId, String language) {
        LocalDate today = LocalDate.now();
        Date sqlDate = Date.valueOf(today);

        Optional<VocabularySet> existing = vocabularySetRepository.findByUserIdAndDate(userId, sqlDate);
        if (existing.isPresent()) {
            logger.info("Found existing vocabulary set for userId={} on date={}", userId, sqlDate);
            return existing.get();
        }

        List<String> recentMessages = messageRepository.findBySessionUserId(userId)
                .stream()
                .filter(msg -> msg instanceof UserMessage)
                .limit(10)
                .map(msg -> ((UserMessage) msg).getContent())
                .collect(Collectors.toList());

        logger.info("Fetched {} recent messages for userId={}", recentMessages.size(), userId);

        String vocabJson = geminiAPIService.generateVocabulary(userId, recentMessages, language != null ? language : "English");

        VocabularySet vocabularySet = new VocabularySet();
        vocabularySet.setUserId(userId);
        vocabularySet.setDate(sqlDate);
        vocabularySet.setVocabJson(vocabJson);

        VocabularySet savedSet = vocabularySetRepository.save(vocabularySet);
        logger.info("Saved new vocabulary set for userId={} on date={}", userId, sqlDate);

        return savedSet;
    }
}