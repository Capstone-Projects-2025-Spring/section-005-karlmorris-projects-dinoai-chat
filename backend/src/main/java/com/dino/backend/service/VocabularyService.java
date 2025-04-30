package com.dino.backend.service;

import com.dino.backend.integration.gemini.GeminiAPIService;
import com.dino.backend.model.UserMessage;
import com.dino.backend.model.VocabularySet;
import com.dino.backend.repository.MessageRepository;
import com.dino.backend.repository.VocabularySetRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

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
        
        // Get ALL messages
        List<String> recentMessages = messageRepository.findBySessionUserId(userId)
                .stream()
                .limit(20)
                .map(msg -> msg.getContent())
                .filter(content -> content != null && !content.trim().isEmpty())
                .collect(Collectors.toList());
                
        logger.info("Fetched {} recent messages for userId={}", recentMessages.size(), userId);
        
        // Check if a vocabulary set exists for today
        Optional<VocabularySet> existingOpt = vocabularySetRepository.findByUserIdAndDate(userId, sqlDate);
        
        // Generate vocabulary content
        String vocabJson;
        if (recentMessages.isEmpty()) {
            // Provide default vocabulary for new users
            vocabJson = getDefaultVocabularyJson(language);
            logger.info("Generated default vocabulary for new user userId={}", userId);
        } else {
            try {
                vocabJson = geminiAPIService.generateVocabulary(userId, recentMessages, language);
                logger.info("Generated custom vocabulary based on {} messages for userId={}", 
                            recentMessages.size(), userId);
                
                // Validate the generated JSON
                if (vocabJson == null || vocabJson.equals("[]") || vocabJson.equals("{}")) {
                    logger.warn("Generated vocabulary was empty. Using default instead for userId={}", userId);
                    vocabJson = getDefaultVocabularyJson(language);
                }
                
                // Try parsing to validate JSON structure
                try {
                    ObjectMapper mapper = new ObjectMapper();
                    JsonNode root = mapper.readTree(vocabJson);
                    if (!root.has("vocabulary") || root.get("vocabulary").size() == 0) {
                        logger.warn("Generated JSON missing vocabulary array. Using default instead for userId={}", userId);
                        vocabJson = getDefaultVocabularyJson(language);
                    }
                } catch (Exception e) {
                    logger.warn("Generated JSON invalid. Using default instead for userId={}", userId);
                    vocabJson = getDefaultVocabularyJson(language);
                }
            } catch (Exception e) {
                logger.error("Error generating vocabulary: {}", e.getMessage());
                vocabJson = getDefaultVocabularyJson(language);
            }
        }
    
        // Now update or create the vocabulary set
        VocabularySet vocabularySet;
        
        if (existingOpt.isPresent()) {
            // Update existing vocabulary set
            vocabularySet = existingOpt.get();
            vocabularySet.setVocabJson(vocabJson);
            logger.info("Updating existing vocabulary set for userId={} on date={}", userId, sqlDate);
        } else {
            // Create new vocabulary set
            vocabularySet = new VocabularySet();
            vocabularySet.setUserId(userId);
            vocabularySet.setDate(sqlDate);
            vocabularySet.setVocabJson(vocabJson);
            logger.info("Creating new vocabulary set for userId={} on date={}", userId, sqlDate);
        }
    
        VocabularySet savedSet = vocabularySetRepository.save(vocabularySet);
        logger.info("Saved vocabulary set for userId={} on date={}", userId, sqlDate);
    
        return savedSet;
    }

    
    private String getDefaultVocabularyJson(String language) {
        // Basic beginner vocabulary for new users
        return "{ \"vocabulary\": [" +
               "  { \"word\": \"hello\", \"definition\": \"A greeting used when meeting someone\" }," +
               "  { \"word\": \"goodbye\", \"definition\": \"A parting phrase used when leaving\" }," +
               "  { \"word\": \"thank you\", \"definition\": \"An expression of gratitude\" }," +
               "  { \"word\": \"please\", \"definition\": \"Used as a polite request\" }," +
               "  { \"word\": \"yes\", \"definition\": \"Used to express agreement or affirmation\" }," +
               "  { \"word\": \"no\", \"definition\": \"Used to express disagreement or negation\" }," +
               "  { \"word\": \"excuse me\", \"definition\": \"Used to politely get attention or apologize\" }," +
               "  { \"word\": \"sorry\", \"definition\": \"Used to express regret or apologize\" }," +
               "  { \"word\": \"help\", \"definition\": \"Assistance or support given to someone\" }," +
               "  { \"word\": \"welcome\", \"definition\": \"A friendly greeting to someone who has arrived\" }" +
               "] }";
    }
}