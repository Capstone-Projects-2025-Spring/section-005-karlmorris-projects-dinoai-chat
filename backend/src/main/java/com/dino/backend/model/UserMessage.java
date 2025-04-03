package com.dino.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;



@Entity
@DiscriminatorValue("USER")
@Data
@EqualsAndHashCode(callSuper = false)
public class UserMessage extends Message {

    // If you don't need custom fields or constructors here, 
    // just omit @NoArgsConstructor / @AllArgsConstructor
    public void sendMessage(String content) {
        this.setContent(content);
    }
}
