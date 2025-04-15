package com.dino.backend.model;

import com.fasterxml.jackson.annotation.JsonTypeName;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@JsonTypeName("bot")
@DiscriminatorValue("bot")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class BotMessage extends Message {

    @Column(name = "corrected_content", nullable = true)
    private String correctedContent;

    public String generateCorrection(String input) {
        return "Corrected version of: " + input;
    }
}

