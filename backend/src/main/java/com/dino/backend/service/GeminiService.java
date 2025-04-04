package com.dino.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dino.backend.dto.PromptRequest;
import com.dino.backend.integration.gemini.GeminiAPI;
import com.dino.backend.model.User;
import com.dino.backend.repository.UserRepository;

import java.io.IOException;

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
            // Load the static system prompt from file
            String systemPrompt = promptLoaderService.loadSystemPrompt();

            // Extract the latest user message
            String userMessage = "";
            if (request.getMessages() != null && !request.getMessages().isEmpty()) {
                // Get the latest user message with senderType = USER
                for (int i = request.getMessages().size() - 1; i >= 0; i--) {
                    PromptRequest.Message message = request.getMessages().get(i);
                    if ("USER".equals(message.getSenderType())) {
                        userMessage = message.getContent();
                        break;
                    }
                }
            }

            // Fetch user data from database
            User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUserId()));

            // Build the JSON input to match the expected format
            String jsonInput = String.format(
                "{" +
                "  \"userData\": {" +
                "    \"UserID\": \"%s\"," +
                "    \"Username\": \"%s\"," +
                "    \"nativeLanguage\": \"%s\"," +
                "    \"learningLanguage\": \"%s\"" +
                "  }," +
                "  \"chatData\": {" +
                "    \"SessionTopic\": \"%s\"," +
                "    \"userMessage\": \"%s\"" +
                "  }" +
                "}", 
                user.getUserId(),
                user.getUsername(),
                user.getNativeLanguage(),
                request.getLanguageUsed() != null ? request.getLanguageUsed() : user.getLearningLanguage(),
                request.getSessionTopic() != null ? request.getSessionTopic() : "null",
                userMessage
            );

            // Combine system prompt and user input
            String fullPrompt = systemPrompt + "\n\n" + jsonInput;

            // Get the raw response from Gemini as plain text
            String fullResponse = geminiAPI.getResponse(fullPrompt);

            // Return the entire response
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