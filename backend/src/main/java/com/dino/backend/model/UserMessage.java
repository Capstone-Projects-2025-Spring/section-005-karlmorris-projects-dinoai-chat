package com.dino.backend.model;

import com.fasterxml.jackson.annotation.JsonTypeName;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;



@Entity
@JsonTypeName("user")
@DiscriminatorValue("user")
@Data
@EqualsAndHashCode(callSuper = false)
public class UserMessage extends Message {

    
  
    public void sendMessage(String content) {
        this.setContent(content);
    }
}
