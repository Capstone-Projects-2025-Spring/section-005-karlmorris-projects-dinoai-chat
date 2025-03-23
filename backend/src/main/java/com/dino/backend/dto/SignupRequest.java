package com.dino.backend.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String username;
    private String email;
    private String password;
    private String learningLanguage;
    private String nativeLanguage;
}
