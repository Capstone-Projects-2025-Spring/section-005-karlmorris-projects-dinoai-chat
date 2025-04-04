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

    

    
    public String generateCorrection(String input) {
       
        return "Corrected version of: " + input;
    }
}
