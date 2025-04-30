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
import java.util.*;

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
        String endpoint = geminiApiUrl + "?key=" + apiKey;
        HttpEntity<Map<String, Object>> entity = buildRequest(input);
        ResponseEntity<String> response = restTemplate.postForEntity(endpoint, entity, String.class);
        return response.getBody();
    }

    @Override
    public String getGrammarFeedback(String input) {
        String endpoint = geminiApiUrl + "?key=" + apiKey;
        HttpEntity<Map<String, Object>> entity = buildRequest("Provide grammar feedback for: " + input);
        ResponseEntity<String> response = restTemplate.postForEntity(endpoint, entity, String.class);
        return response.getBody();
    }

    public String generateVocabulary(Long userId, List<String> recentMessages, String language) {
        try {
            Resource promptResource = resourceLoader.getResource("classpath:prompts/vocabulary_prompt.txt");
            String promptTemplate = new String(promptResource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

            String chatHistory = recentMessages.isEmpty() ? "No recent messages." : String.join("\n", recentMessages);
            String prompt = String.format(promptTemplate, chatHistory, language != null ? language : "English");

            return generateVocabulary(prompt);

        } catch (IOException e) {
            throw new RuntimeException("Failed to load vocabulary prompt", e);
        }
    }

    public String generateVocabulary(String prompt) {
        String endpoint = geminiApiUrl + "?key=" + apiKey;
        HttpEntity<Map<String, Object>> entity = buildRequest(prompt);
        ResponseEntity<String> response = restTemplate.postForEntity(endpoint, entity, String.class);
        String jsonArray = extractJsonArray(response.getBody());

        // ✅ Ensure it's a valid JSON array before saving
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode parsed = mapper.readTree(jsonArray);
            if (!parsed.isArray()) {
                logger.error("Gemini response was not a valid JSON array: {}", jsonArray);
                return "[]";
            }
        } catch (Exception e) {
            logger.error("Gemini returned invalid JSON: {}", jsonArray);
            return "[]";
        }

        return jsonArray;
    }

    private HttpEntity<Map<String, Object>> buildRequest(String text) {
        Map<String, Object> part = new HashMap<>();
        part.put("text", text);

        Map<String, Object> content = new HashMap<>();
        content.put("role", "user");
        content.put("parts", Collections.singletonList(part));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", Collections.singletonList(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        return new HttpEntity<>(requestBody, headers);
    }

    private String extractJsonArray(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            JsonNode textNode = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");

            if (textNode.isMissingNode()) {
                return "[]";
            }

            String text = textNode.asText();
            String jsonStartMarker = "```json\n";
            String jsonEndMarker = "\n```";

            int start = text.indexOf(jsonStartMarker) + jsonStartMarker.length();
            int end = text.lastIndexOf(jsonEndMarker);

            if (start >= jsonStartMarker.length() && end > start) {
                String jsonArray = text.substring(start, end).trim();
                mapper.readTree(jsonArray); // validate
                return jsonArray;
            }

            // fallback: try entire text
            mapper.readTree(text);
            return text;

        } catch (Exception e) {
            logger.error("Failed to extract JSON array from response: {}", response, e);
            return "[]";
        }
    }
}
