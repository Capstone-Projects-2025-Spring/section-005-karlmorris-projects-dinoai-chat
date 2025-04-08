package com.dino.backend.controller;

import com.dino.backend.model.ChatSession;
import com.dino.backend.service.ChatSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class ChatSessionController {

    @Autowired
    private ChatSessionService chatSessionService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ChatSession>> getSessionsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(chatSessionService.getSessionsByUserId(userId));
    }

    @PostMapping("/start")
    public ResponseEntity<ChatSession> startSession(@RequestParam Long userId,
                                                    @RequestParam String languageUsed,
                                                    @RequestParam String sessionTopic) {
        return ResponseEntity.ok(chatSessionService.startSession(userId, languageUsed, sessionTopic));
    }

    @PostMapping("/end/{sessionId}")
    public ResponseEntity<ChatSession> endSession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(chatSessionService.endSession(sessionId));
    }

    @PostMapping("/feedback/{sessionId}")
    public ResponseEntity<ChatSession> addFeedback(@PathVariable Long sessionId, @RequestParam String feedback) {
        return ResponseEntity.ok(chatSessionService.updateFeedback(sessionId, feedback));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<ChatSession> getSession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(chatSessionService.getSessionById(sessionId));
    }
}