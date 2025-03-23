package com.dino.backend.controller;

import com.dino.backend.dto.LoginRequest;
import com.dino.backend.dto.LoginResponse;
import com.dino.backend.dto.SignupRequest;
import com.dino.backend.model.User;
import com.dino.backend.repository.UserRepository;
import com.dino.backend.security.JwtUtil;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use.");
        }
        
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already taken.");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setLearningLanguage(request.getLearningLanguage());
        user.setNativeLanguage(request.getNativeLanguage());
        userRepository.save(user);
        
        return ResponseEntity.ok("Signup successful!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Authenticate user credentials
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            
            // If authentication is successful, find the user
            User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Update last login timestamp
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            // Generate JWT token
            String jwt = jwtUtil.generateToken(user.getUsername());
            
            // Create response
            LoginResponse response = new LoginResponse();
            response.setToken(jwt);
            response.setUserId(user.getUserId());
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());
            response.setLearningLanguage(user.getLearningLanguage());
            response.setNativeLanguage(user.getNativeLanguage());
            response.setSuccess(true);
            response.setMessage("Login successful");
            
            return ResponseEntity.ok(response);
            
        } catch (BadCredentialsException e) {
            // Authentication failed
            LoginResponse response = new LoginResponse();
            response.setSuccess(false);
            response.setMessage("Invalid credentials");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
}