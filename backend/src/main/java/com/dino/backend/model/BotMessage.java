package com.dino.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("bot")
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
