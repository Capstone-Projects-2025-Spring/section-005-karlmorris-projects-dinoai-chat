package com.dino.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String username;
    private Long userId;
    private String email;
    private String learningLanguage;
    private String nativeLanguage;
    private String message;
    private boolean success;
}