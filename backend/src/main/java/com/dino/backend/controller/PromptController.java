package com.dino.backend.controller;

import com.dino.backend.dto.PromptRequest;
import com.dino.backend.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prompts")
public class PromptController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/generate")
    public ResponseEntity<?> generatePrompt(@RequestBody PromptRequest request) {
        try {
            String aiReply = geminiService.getGeminiResponse(request);
            return ResponseEntity.ok(aiReply);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error generating response: " + e.getMessage());
        }
    }
}
