package com.dino.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

@Entity
@DiscriminatorValue("BOT")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class BotMessage extends Message {

    @Column(name = "corrected_content")
    private String correctedContent;

    /**
     * Example method for generating a correction, if needed.
     * This is where you'd integrate with your AI logic.
     */
    public String generateCorrection(String input) {
        // AI logic to correct the input
        return "Corrected version of: " + input;
    }
}
