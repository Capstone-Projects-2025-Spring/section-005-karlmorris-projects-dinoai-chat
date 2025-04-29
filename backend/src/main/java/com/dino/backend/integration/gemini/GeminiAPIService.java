package com.dino.backend.integration.gemini;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

@Service
public class GeminiAPIService implements GeminiAPI {

        private static final Logger logger = LoggerFactory.getLogger(GeminiAPIService.class);


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

    public String generateVocabulary(Long userId, List<String> recentMessages, String language) {
        try {
            Resource promptResource = resourceLoader.getResource("classpath:prompts/vocabulary_prompt.txt");
            String promptTemplate = new String(promptResource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    
            String chatHistory = recentMessages.isEmpty() ? "No recent messages." : String.join("\n", recentMessages);
            String prompt = String.format(promptTemplate, chatHistory, language != null ? language : "English");
    
            String endpoint = geminiApiUrl + "?key=" + apiKey;
    
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
    
            return extractJsonArray(response.getBody());
        } catch (IOException e) {
            throw new RuntimeException("Failed to load vocabulary prompt", e);
        }
    }

private String extractJsonArray(String response) {
    try {
        // Parse the full response to navigate to the text field
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(response);
        JsonNode textNode = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");
        if (textNode.isMissingNode()) {
            return "[]";
        }

        String text = textNode.asText();
        // Extract the JSON array from the markdown code block
        String jsonStartMarker = "```json\n";
        String jsonEndMarker = "\n```";
        int start = text.indexOf(jsonStartMarker) + jsonStartMarker.length();
        int end = text.lastIndexOf(jsonEndMarker);
        if (start >= jsonStartMarker.length() && end > start) {
            String jsonArray = text.substring(start, end).trim();
            // Validate JSON
            mapper.readTree(jsonArray); // Throws if invalid
            return jsonArray;
        }
        return "[]";
    } catch (Exception e) {
        logger.error("Failed to extract JSON array from response: {}", response, e);
        return "[]";
    }
}
}