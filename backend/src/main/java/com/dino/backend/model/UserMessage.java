package com.dino.backend.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;



@Entity
@DiscriminatorValue("user")
@Data
@EqualsAndHashCode(callSuper = false)
public class UserMessage extends Message {

    
  
    public void sendMessage(String content) {
        this.setContent(content);
    }
}
