package com.dino.backend.repository;

import com.dino.backend.model.ChatSession;
import com.dino.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    /**
     * 
     *
     * @param chatSession the chat session to search messages for
     * @return a list of messages linked to the specified chat session
     */
    List<Message> findByChatSession(ChatSession chatSession);
}
