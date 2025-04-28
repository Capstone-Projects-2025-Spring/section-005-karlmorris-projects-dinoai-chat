package com.dino.backend.controller;

import com.dino.backend.model.ChatSession;
import com.dino.backend.model.User;
import com.dino.backend.repository.UserRepository;
import com.dino.backend.service.ChatSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class ChatSessionController {

    @Autowired
    private ChatSessionService chatSessionService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ChatSession>> getSessionsByUser(@PathVariable Long userId) {
        // Get the authenticated user's details
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(null); // Unauthorized
        }

        // Find the user by username from the authentication object
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        // Check if the requested userId matches the authenticated user's ID
        if (!user.getUserId().equals(userId)) {
            return ResponseEntity.status(403).body(null); // Forbidden
        }

        // Proceed to fetch sessions
        List<ChatSession> sessions = chatSessionService.getSessionsByUserId(userId);
        if (sessions == null) {
            return ResponseEntity.status(404).body(null); // Not Found
        }
        return ResponseEntity.ok(sessions);
    }

    @PostMapping("/start")
    public ResponseEntity<ChatSession> startSession(@RequestParam Long userId,
                                                   @RequestParam String languageUsed,
                                                   @RequestParam String sessionTopic) {
        // Get the authenticated user's details
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(null); // Unauthorized
        }

        // Find the user by username
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        // Check if the requested userId matches the authenticated user's ID
        if (!user.getUserId().equals(userId)) {
            return ResponseEntity.status(403).body(null); // Forbidden
        }

        // Start the session
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
        // Get the authenticated user's details
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(null); // Unauthorized
        }

        // Find the user by username
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        // Fetch the session
        ChatSession session = chatSessionService.getSessionById(sessionId);
        if (session == null) {
            return ResponseEntity.status(404).body(null); // Not Found
        }

        // Check if the session belongs to the authenticated user
        if (!session.getUser().getUserId().equals(user.getUserId())) {
            return ResponseEntity.status(403).body(null); // Forbidden
        }

        return ResponseEntity.ok(session);
    }
}