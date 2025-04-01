package com.dino.backend.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.dino.backend.dto.PromptRequest;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getGeminiResponse(PromptRequest request) {
        String language = request.getLanguageUsed();
        String topic = (request.getSessionTopic() == null || request.getSessionTopic().isEmpty())
                ? "everyday conversation" : request.getSessionTopic();
        String firstUserMessage = request.getMessages().isEmpty() ? "" : request.getMessages().get(0).getContent();

        String prompt = String.format("""
                You are a friendly and intelligent language practice partner.
                The user is learning to speak in %s.
                Today's conversation theme is "%s".
                Speak only in %s unless otherwise asked.
                Keep your responses short, simple, and natural.
                After each response, include a translation in English.
                First user message: "%s"
                """, language, topic, language, firstUserMessage);

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

        // 构建请求体
        Map<String, Object> part = Map.of("text", prompt);
        Map<String, Object> content = Map.of("parts", List.of(part));
        Map<String, Object> body = Map.of("contents", List.of(content));

        try {
            // 设置请求头
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            // 发起请求
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");

                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> contentMap = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");

                    if (parts != null && !parts.isEmpty()) {
                        return parts.get(0).get("text").toString();
                    }
                }
            }

            return "No valid response from Gemini.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error calling Gemini: " + e.getMessage();
        }
    }
}


