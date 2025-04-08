package com.dino.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dino.backend.model.ChatSession;
import com.dino.backend.model.Message;
import com.dino.backend.repository.ChatSessionRepository;
import com.dino.backend.repository.MessageRepository;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatSessionRepository chatSessionRepository;

    public List<Message> getMessagesBySessionId(Long sessionId) {
        Optional<ChatSession> sessionOptional = chatSessionRepository.findById(sessionId);
        if (sessionOptional.isPresent()) {
            return messageRepository.findByChatSession(sessionOptional.get());
        } else {
            throw new IllegalArgumentException("Chat session not found with ID: " + sessionId);
        }
    }

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }
}