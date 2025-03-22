package com.dino.backend.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String username;
    private Long userId;
    private String learningLanguage;
}
