package com.dino.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dino.backend.model.ChatSession;
import com.dino.backend.model.User;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    List<ChatSession> findByUser(User user);
}