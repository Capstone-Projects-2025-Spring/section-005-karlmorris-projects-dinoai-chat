package com.dino.backend.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dino.backend.dto.PromptRequest;
import com.dino.backend.integration.gemini.GeminiAPI;
import com.dino.backend.model.User;
import com.dino.backend.repository.UserRepository;

@Service
public class GeminiService {

    @Autowired
    private GeminiAPI geminiAPI;

    @Autowired
    private PromptLoaderService promptLoaderService;

    @Autowired
    private UserRepository userRepository;

    public String getGeminiResponse(PromptRequest request) {
        try {
            // Load system prompt
            String systemPrompt = promptLoaderService.loadSystemPrompt();

            // Fetch user
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUserId()));

            // Build conversation history from all messages
            StringBuilder conversationHistory = new StringBuilder();
            for (PromptRequest.Message message : request.getMessages()) {
                if ("USER".equalsIgnoreCase(message.getSenderType())) {
                    conversationHistory.append("User: ").append(message.getContent()).append("\n");
                } else {
                    conversationHistory.append("AI: ").append(message.getContent()).append("\n");
                }
            }

            // Add language instruction to enforce language consistency
            String languageInstruction = String.format(
                    "The user's native language is %s. The user is learning %s. You must reply in %s.",
                    user.getNativeLanguage(),
                    request.getLanguageUsed() != null ? request.getLanguageUsed() : user.getLearningLanguage(),
                    request.getLanguageUsed() != null ? request.getLanguageUsed() : user.getLearningLanguage()
            );

            // Combine all to form final prompt
            String fullPrompt = systemPrompt
                    + "\n\n" + languageInstruction
                    + "\n\nPlease respond with plain JSON, do not include markdown formatting like ```json."
                    + "\n\n" + conversationHistory.toString().trim();

            // Send to Gemini
            String fullResponse = geminiAPI.getResponse(fullPrompt);
            return fullResponse;

        } catch (IOException e) {
            e.printStackTrace();
            return "Error loading system prompt: " + e.getMessage();
        } catch (RuntimeException e) {
            e.printStackTrace();
            return "Error processing request: " + e.getMessage();
        }
    }
}