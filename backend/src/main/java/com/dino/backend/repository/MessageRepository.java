package com.dino.backend.repository;

import com.dino.backend.model.ChatSession;
import com.dino.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    /**
     * Finds messages linked to the specified chat session
     *
     * @param chatSession the chat session to search messages for
     * @return a list of messages linked to the specified chat session
     */
    List<Message> findByChatSession(ChatSession chatSession);

    /**
     * Finds messages for a user across all their chat sessions, ordered by ID descending
     *
     * @param userId the ID of the user
     * @return a list of messages for the user
     */
    @Query("SELECT m FROM Message m WHERE m.chatSession.user.userId = :userId ORDER BY m.id DESC")
    List<Message> findBySessionUserId(Long userId);
}