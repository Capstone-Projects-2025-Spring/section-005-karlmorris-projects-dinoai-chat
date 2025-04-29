package com.dino.backend.controller;

import com.dino.backend.model.ChatSession;
import com.dino.backend.model.User;
import com.dino.backend.repository.UserRepository;
import com.dino.backend.service.ChatSessionService;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class ChatSessionController {

    @Autowired
    private ChatSessionService chatSessionService;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(ChatSessionController.class);


@GetMapping("/user/{userId}")
public ResponseEntity<List<ChatSession>> getSessionsByUser(@PathVariable Long userId) {
    // Get the authenticated user's details
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) { // More robust check
        logger.warn("Unauthorized attempt to access sessions for path userId: {}", userId);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // Return 401 if not authenticated
    }

    // Find the user by username from the authentication object
    String username = authentication.getName();
    logger.info("Fetching sessions for path userId: {}. Authenticated principal: {}", userId, username); // First log

    User user = userRepository.findByUsername(username)
            .orElseThrow(() -> {
                 logger.error("Authenticated user '{}' not found in repository!", username); // Log if user lookup fails
                 return new RuntimeException("Authenticated user not found");
            });

    logger.info("Comparing Path userId ({}) with Token's userId ({}) for user '{}'", userId, user.getUserId(), username); // Second log

    // Check if the requested userId matches the authenticated user's ID
    if (!user.getUserId().equals(userId)) {
        logger.warn("Forbidden: Authenticated userId ({}) does not match requested path userId ({}).", user.getUserId(), userId); // Third log
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Forbidden
    }

    // Proceed to fetch sessions
    logger.info("Authorized: Fetching sessions for userId: {}", userId); // Log success
    List<ChatSession> sessions = chatSessionService.getSessionsByUserId(userId);

    
    if (sessions == null) {
         logger.warn("No sessions found for userId: {}", userId);
         // return ResponseEntity.ok(Collections.emptyList());
         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    return ResponseEntity.ok(sessions);
}

    @PostMapping("/start")
    public ResponseEntity<ChatSession> startSession(@RequestParam Long userId,
                                                   @RequestParam String languageUsed,
                                                   @RequestParam String sessionTopic) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(null); // Unauthorized
        }
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        if (!user.getUserId().equals(userId)) {
            return ResponseEntity.status(403).body(null); // Forbidden
        }
        return ResponseEntity.ok(chatSessionService.startSession(userId, languageUsed, sessionTopic));
    }

    @PostMapping("/end/{sessionId}")
    public ResponseEntity<ChatSession> endSession(@PathVariable Long sessionId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(null); // Unauthorized
        }
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        ChatSession session = chatSessionService.getSessionById(sessionId);
        if (session == null) {
            return ResponseEntity.status(404).body(null); // Not Found
        }
        if (!session.getUser().getUserId().equals(user.getUserId())) {
            return ResponseEntity.status(403).body(null); // Forbidden
        }
        return ResponseEntity.ok(chatSessionService.endSession(sessionId));
    }

    @PostMapping("/feedback/{sessionId}")
    public ResponseEntity<ChatSession> addFeedback(@PathVariable Long sessionId, @RequestParam String feedback) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(null); // Unauthorized
        }
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        ChatSession session = chatSessionService.getSessionById(sessionId);
        if (session == null) {
            return ResponseEntity.status(404).body(null); // Not Found
        }
        if (!session.getUser().getUserId().equals(user.getUserId())) {
            return ResponseEntity.status(403).body(null); // Forbidden
        }
        return ResponseEntity.ok(chatSessionService.updateFeedback(sessionId, feedback));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<ChatSession> getSession(@PathVariable Long sessionId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(null); // Unauthorized
        }
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        ChatSession session = chatSessionService.getSessionById(sessionId);
        if (session == null) {
            return ResponseEntity.status(404).body(null); // Not Found
        }
        if (!session.getUser().getUserId().equals(user.getUserId())) {
            return ResponseEntity.status(403).body(null); // Forbidden
        }
        return ResponseEntity.ok(session);
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long sessionId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        ChatSession session = chatSessionService.getSessionById(sessionId);
        if (session == null) {
            return ResponseEntity.status(404).build(); // Not Found
        }
        if (!session.getUser().getUserId().equals(user.getUserId())) {
            return ResponseEntity.status(403).build(); // Forbidden
        }
        chatSessionService.deleteSession(sessionId);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}