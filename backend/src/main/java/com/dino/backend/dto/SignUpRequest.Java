package com.dino.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request object for user sign up
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {
    private String username;
    private String email;
    private String password;
    private String learningLanguage;
    private String nativeLanguage;
    
    // Optional field
    private String profilePicUrl;
}