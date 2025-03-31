package com.dino.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dino.backend.dto.PromptRequest;

import java.util.List;

@RestController
@RequestMapping("/api/prompts")
public class PromptController {

    @PostMapping("/generate")
    public ResponseEntity<String> generatePrompt(@RequestBody PromptRequest request) {
      String prompt = buildPrompt(request);
      return ResponseEntity.ok(prompt);
    }

    // Optional reusable method if you want more structured formatting
    private String buildPrompt(PromptRequest req) {
        List<PromptRequest.Message> messages = req.getMessages();
        String firstMessage = (messages != null && !messages.isEmpty()) ? messages.get(0).getContent()
        : "";

        return String.format("""
            You are a friendly and intelligent language practice partner.
            The user is learning to speak in %s.
            Today's conversation theme is "%s".

            Speak only in %s unless otherwise asked.
            Keep your responses short, simple, and natural.

            First user message: "%s"
            """,
            req.getLanguage_used(),
            req.getSession_topic(),
            req.getLanguage_used(),
            firstMessage
        );
    }
}
