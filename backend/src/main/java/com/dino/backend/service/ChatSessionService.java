package com.dino.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dino.backend.model.ChatSession;
import com.dino.backend.model.User;
import com.dino.backend.repository.ChatSessionRepository;
import com.dino.backend.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class ChatSessionService {

    @Autowired
    private ChatSessionRepository chatSessionRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ChatSession> getSessionsByUserId(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        return userOpt.map(chatSessionRepository::findByUser).orElse(null);
    }

    public ChatSession startSession(Long userId, String languageUsed, String sessionTopic) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        ChatSession session = new ChatSession();
        session.setUser(user);
        session.setStartTime(LocalDateTime.now());
        session.setLanguageUsed(languageUsed);
        session.setSessionTopic(sessionTopic);
        return chatSessionRepository.save(session);
    }

    @Transactional
    public ChatSession endSession(Long sessionId) {
        ChatSession session = chatSessionRepository.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found"));
        session.setEndTime(LocalDateTime.now());
        return session;
    }

    public ChatSession updateFeedback(Long sessionId, String feedback) {
        ChatSession session = chatSessionRepository.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found"));
        session.setFeedbackSummary(feedback);
        return chatSessionRepository.save(session);
    }

    public ChatSession getSessionById(Long sessionId) {
        return chatSessionRepository.findById(sessionId).orElse(null);
    }
}
