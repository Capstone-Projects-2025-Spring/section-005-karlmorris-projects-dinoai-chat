package com.dino.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;



@Entity
@DiscriminatorValue("USER")
@Data
@EqualsAndHashCode(callSuper = false)
public class UserMessage extends Message {

    
  
    public void sendMessage(String content) {
        this.setContent(content);
    }
}
