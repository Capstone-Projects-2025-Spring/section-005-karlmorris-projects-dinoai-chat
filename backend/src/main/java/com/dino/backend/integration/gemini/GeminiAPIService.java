package com.dino.backend.integration.gemini;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
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
        
        // Use the same structure as getResponse for consistency
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", Arrays.asList(Collections.singletonMap("parts", Collections.singletonList(Collections.singletonMap("text", input)))));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(endpoint, entity, String.class);
        return response.getBody();
    }
}