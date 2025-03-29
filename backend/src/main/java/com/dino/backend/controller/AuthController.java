package com.dino.backend.controller;

import com.dino.backend.dto.LoginRequest;
import com.dino.backend.dto.LoginResponse;
import com.dino.backend.dto.SignupRequest;
import com.dino.backend.model.User;
import com.dino.backend.repository.UserRepository;
import com.dino.backend.security.JwtUtil;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger; 
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

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
        try {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email already in use."));
            }

            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Username already taken."));
            }

            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setLearningLanguage(request.getLearningLanguage());
            user.setNativeLanguage(request.getNativeLanguage());
            user.setCreatedAt(LocalDateTime.now());
            user = userRepository.save(user);

            // Generate token using the user's username as the subject
            String jwt = jwtUtil.generateToken(user.getUsername());

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("userId", user.getUserId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("learningLanguage", user.getLearningLanguage());
            response.put("nativeLanguage", user.getNativeLanguage());
            response.put("success", true);
            response.put("message", "Signup successful!");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Signup failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An error occurred during signup. Please try again later."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);

            // Generate token using the user's username as the subject
            String jwt = jwtUtil.generateToken(user.getUsername());

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
            logger.error("Login failed - bad credentials", e);
            LoginResponse response = new LoginResponse();
            response.setSuccess(false);
            response.setMessage("Invalid credentials");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warn("Unauthorized access to /auth/me");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized"));
        }

        // authentication.getName() returns the username
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("userId", user.getUserId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("learningLanguage", user.getLearningLanguage());
        response.put("nativeLanguage", user.getNativeLanguage());
        response.put("lastLogin", user.getLastLogin());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody Map<String, String> updates, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Unauthorized"));
        }

        // Use the username from the authentication object
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        logger.info("Updating user: " + username + " with updates: " + updates);

        try {
            if (updates.containsKey("email")) {
                String newEmail = updates.get("email");
                user.setEmail(newEmail);
            }
            if (updates.containsKey("username")) {
                String newUsername = updates.get("username");
                user.setUsername(newUsername);
            }
            userRepository.save(user);
        } catch (Exception e) {
            logger.error("Failed to update user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to update email"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User updated successfully");
        response.put("userId", user.getUserId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("learningLanguage", user.getLearningLanguage());
        response.put("nativeLanguage", user.getNativeLanguage());

        return ResponseEntity.ok(response);
    }
}
