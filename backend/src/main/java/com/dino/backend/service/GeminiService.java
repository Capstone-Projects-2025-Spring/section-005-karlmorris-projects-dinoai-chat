package com.dino.backend.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dino.backend.dto.PromptRequest;
import com.dino.backend.integration.gemini.GeminiAPI;

@Service
public class GeminiService {

    @Autowired
    private GeminiAPI geminiAPI;  // Your centralized Gemini integration service

    @Autowired
    private PromptLoaderService promptLoaderService;

    public String getGeminiResponse(PromptRequest request) {
        try {
            // Load the static system prompt from file.
            String systemPrompt = promptLoaderService.loadSystemPrompt();
    
            // Extract dynamic context from the PromptRequest.
            String language = request.getLanguageUsed();
            String topic = (request.getSessionTopic() == null || request.getSessionTopic().isEmpty())
                    ? "everyday conversation" : request.getSessionTopic();
            String firstUserMessage = (request.getMessages() == null || request.getMessages().isEmpty())
                    ? "" : request.getMessages().get(0).getContent();
    
            // Combine the system prompt with dynamic conversation context.
            String combinedPrompt = systemPrompt + "\n"
                    + "User is learning in: " + language + ".\n"
                    + "Session Topic: " + topic + ".\n"
                    + "First user message: " + firstUserMessage;
    
            // Get the raw response from Gemini
            String fullResponse = geminiAPI.getResponse(combinedPrompt);
    
            // Basic parsing logic: pick the first meaningful line
            String parsedResponse = fullResponse.lines()
                    .filter(line -> line != null && !line.trim().isEmpty())
                    .findFirst()
                    .orElse("No meaningful response from Gemini.");
    
            return parsedResponse;
    
        } catch (IOException e) {
            e.printStackTrace();
            return "Error loading system prompt: " + e.getMessage();
        }
    }
}
