package com.dino.backend.integration.gemini;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class GeminiAPIService implements GeminiAPI {

    @Value("${gemini.flash.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.flash.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public GeminiAPIService() {
        this.restTemplate = new RestTemplate();
    }

    @Override
    public String getResponse(String input) {
        String endpoint = geminiApiUrl + "/response";
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("input", input);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(endpoint, entity, String.class);
        return response.getBody();
    }

    @Override
    public String getGrammarFeedback(String input) {
        String endpoint = geminiApiUrl + "/grammar";
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("input", input);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(endpoint, entity, String.class);
        return response.getBody();
    }
}
