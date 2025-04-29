package com.dino.backend.service;

import com.dino.backend.model.ChatSession;
import com.dino.backend.model.User;
import com.dino.backend.repository.ChatSessionRepository;
import com.dino.backend.repository.MessageRepository;
import com.dino.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ChatSessionService {

    @Autowired
    private ChatSessionRepository chatSessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    public ChatSession startSession(Long userId, String languageUsed, String sessionTopic) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        ChatSession session = new ChatSession();
        session.setUser(userOpt.get());
        session.setLanguageUsed(languageUsed);
        session.setSessionTopic(sessionTopic);
        session.setStartTime(LocalDateTime.now());
        return chatSessionRepository.save(session);
    }

    public ChatSession endSession(Long sessionId) {
        Optional<ChatSession> sessionOpt = chatSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            throw new RuntimeException("Session not found");
        }
        ChatSession session = sessionOpt.get();
        session.setEndTime(LocalDateTime.now());
        return chatSessionRepository.save(session);
    }

    public ChatSession updateFeedback(Long sessionId, String feedback) {
        Optional<ChatSession> sessionOpt = chatSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            throw new RuntimeException("Session not found");
        }
        ChatSession session = sessionOpt.get();
        session.setFeedbackSummary(feedback);
        return chatSessionRepository.save(session);
    }

    public ChatSession getSessionById(Long sessionId) {
        return chatSessionRepository.findById(sessionId).orElse(null);
    }

    public List<ChatSession> getSessionsByUserId(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        return userOpt.map(chatSessionRepository::findByUser).orElse(null);
    }

    @Transactional
    public void deleteSession(Long sessionId) {
        Optional<ChatSession> sessionOpt = chatSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            throw new RuntimeException("Session not found");
        }
        
        // Delete associated messages using the correct method
        messageRepository.deleteByChatSessionId(sessionId);
        
        // Delete the session
        chatSessionRepository.deleteById(sessionId);
    }
}