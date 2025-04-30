package com.dino.backend.service;

import com.dino.backend.integration.gemini.GeminiAPIService;
import com.dino.backend.model.Message;
import com.dino.backend.model.UserMessage;
import com.dino.backend.model.VocabularySet;
import com.dino.backend.repository.MessageRepository;
import com.dino.backend.repository.VocabularySetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VocabularyService {

    private static final Logger logger = LoggerFactory.getLogger(VocabularyService.class);
    private static final String PROMPT_FILE_PATH = "src/main/resources/prompts/vocabulary_prompt.txt";

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
    public VocabularySet getDailyVocab(Long userId, String nativeLanguage) {
        LocalDate today = LocalDate.now();
        Date sqlDate = Date.valueOf(today);

        Optional<VocabularySet> existing = vocabularySetRepository.findByUserIdAndDate(userId, sqlDate);
        if (existing.isPresent()) {
            logger.info("Found existing vocabulary set for userId={} on date={}", userId, sqlDate);
            return existing.get();
        }

        List<Message> allMessages = messageRepository.findBySessionUserId(userId);
        logger.info("📨 Total messages found for userId={}: {}", userId, allMessages.size());
        allMessages.forEach(msg -> logger.debug("📩 class={} | content={}", msg.getClass().getSimpleName(), msg.getContent()));

        List<String> recentMessages = allMessages.stream()
            .filter(msg -> msg instanceof UserMessage)
            .map(msg -> ((UserMessage) msg).getContent())
            .limit(10)
            .collect(Collectors.toList());

        logger.info("✅ Filtered {} user messages for vocab generation for userId={}", recentMessages.size(), userId);
        recentMessages.forEach(msg -> logger.debug("📝 Message: {}", msg));

        if (recentMessages.isEmpty()) {
            logger.warn("❌ No user messages found for vocab generation. Prompt will be skipped.");
        }

        try {
            String chatHistory = String.join("\n", recentMessages);
            String promptTemplate = Files.readString(Paths.get(PROMPT_FILE_PATH));
            String fullPrompt = String.format(promptTemplate, chatHistory, nativeLanguage);

            logger.debug("📤 Prompt sent to Gemini:\n{}", fullPrompt);

            String vocabJson = tryGeminiWithRetry(fullPrompt, 3);

            VocabularySet vocabularySet = new VocabularySet();
            vocabularySet.setUserId(userId);
            vocabularySet.setDate(sqlDate);
            vocabularySet.setVocabJson(vocabJson);

            VocabularySet savedSet = vocabularySetRepository.save(vocabularySet);
            logger.info("📦 Saved new vocabulary set for userId={} on {}", userId, sqlDate);

            return savedSet;

        } catch (Exception e) {
            logger.error("💥 Error generating vocabulary for userId={}", userId, e);
            throw new RuntimeException("Failed to generate vocabulary set");
        }
    }

    private String tryGeminiWithRetry(String prompt, int retries) throws InterruptedException {
        int attempt = 0;
        while (attempt < retries) {
            try {
                return geminiAPIService.generateVocabulary(prompt);
            } catch (Exception e) {
                if (e.getMessage().contains("503")) {
                    logger.warn("🔁 Gemini 503 (overloaded), retrying attempt {}/{}", attempt + 1, retries);
                    Thread.sleep(1000L * (attempt + 1)); // Exponential backoff
                    attempt++;
                } else {
                    throw e; // Non-retryable error
                }
            }
        }
        throw new RuntimeException("❌ Failed to generate vocabulary after " + retries + " retries");
    }
}