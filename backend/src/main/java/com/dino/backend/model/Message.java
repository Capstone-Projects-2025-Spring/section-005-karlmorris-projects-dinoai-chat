package com.dino.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "dino_message")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "sender_type", discriminatorType = DiscriminatorType.STRING)
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long messageId;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private ChatSession chatSession;

    @Column(name = "content")
    private String content;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    // The column "corrected_content" exists in the table, 
    // but is primarily used by BotMessage. We keep it out of the base class 
    // so only BotMessage has direct access. 
    // If you want it in the abstract class, move it here and remove from BotMessage.

    /**
     * Optional method for editing message content, if needed.
     */
    public void editContent(String newContent) {
        this.content = newContent;
    }
}
