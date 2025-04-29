package com.dino.backend.integration.gemini;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiAPIService implements GeminiAPI {

    @Value("${gemini.flash.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.flash.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ResourceLoader resourceLoader;

    public GeminiAPIService(ResourceLoader resourceLoader) {
        this.restTemplate = new RestTemplate();
        this.resourceLoader = resourceLoader;
    }

    @Override
    public String getResponse(String input) {
        // Append the API key as a query parameter
        String endpoint = geminiApiUrl + "?key=" + apiKey;

        // Construct the request body in the format Google expects
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, Object> part = new HashMap<>();

        part.put("text", input);
        content.put("parts", Collections.singletonList(part));
        content.put("role", "user");
        requestBody.put("contents", Collections.singletonList(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(endpoint, entity, String.class);
        return response.getBody();
    }

    @Override
    public String getGrammarFeedback(String input) {
        // Append the API key as a query parameter
        String endpoint = geminiApiUrl + "?key=" + apiKey;

        // Construct the request body
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, Object> part = new HashMap<>();

        part.put("text", "Provide grammar feedback for: " + input);
        content.put("parts", Collections.singletonList(part));
        content.put("role", "user");
        requestBody.put("contents", Collections.singletonList(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(endpoint, entity, String.class);
        return response.getBody();
    }

    public String generateVocabulary(Long userId, List<String> recentMessages) {
        try {
            // Load prompt from resources
            Resource promptResource = resourceLoader.getResource("classpath:prompts/vocabulary_prompt.txt");
            String promptTemplate = new String(promptResource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

            // Combine chat history
            String chatHistory = recentMessages.isEmpty() ? "No recent messages." : String.join("\n", recentMessages);

            // Build prompt
            String prompt = String.format(promptTemplate, chatHistory);

            // Append the API key as a query parameter
            String endpoint = geminiApiUrl + "?key=" + apiKey;

            // Construct the request body
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, Object> part = new HashMap<>();

            part.put("text", prompt);
            content.put("parts", Collections.singletonList(part));
            content.put("role", "user");
            requestBody.put("contents", Collections.singletonList(content));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(endpoint, entity, String.class);

            // Parse response to extract JSON array
            return extractJsonArray(response.getBody());
        } catch (IOException e) {
            throw new RuntimeException("Failed to load vocabulary prompt", e);
        }
    }

    private String extractJsonArray(String response) {
        try {
            int start = response.indexOf("[");
            int end = response.lastIndexOf("]");
            if (start != -1 && end != -1) {
                return response.substring(start, end + 1);
            }
            return "[]"; // Fallback to empty array
        } catch (Exception e) {
            return "[]";
        }
    }
}