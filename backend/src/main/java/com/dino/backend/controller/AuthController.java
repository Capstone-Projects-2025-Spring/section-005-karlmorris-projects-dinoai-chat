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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

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

    /**
     * Sign up a new user (no authentication required).
     */
    @PostMapping("/signup")
public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
    try {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already in use."));
        }

        // Check for existing username
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already taken."));
        }
        
        // Create and save new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setLearningLanguage(request.getLearningLanguage());
        user.setNativeLanguage(request.getNativeLanguage());
        user.setCreatedAt(LocalDateTime.now());
        user = userRepository.save(user);
        
        // Generate JWT token directly rather than attempting auto-login
        String jwt = jwtUtil.generateToken(user.getUsername());
        
        // Create response with token and user info
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
        // Log the exception
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "An error occurred during signup. Please try again later."));
    }
}

    /**
     * Log in a user (no authentication required).
     * Returns a JWT token and user info.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Attempt to authenticate with email/password
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            // If successful, load user from DB
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Update last login time
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);

            // Generate JWT token using the username as the subject
            String jwt = jwtUtil.generateToken(user.getUsername());

            // Build response
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Return the current user’s profile (requires authentication).
     * The JWT’s subject should match the User’s username in your DB.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMe(Authentication authentication) {
        // If no user is authenticated, return 401
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        // The authentication’s name is typically the username
        String username = authentication.getName();

        // Find the user by username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Build a map or return a DTO; here we simply return a map of fields
        Map<String, Object> userData = new HashMap<>();
        userData.put("userId", user.getUserId());
        userData.put("username", user.getUsername());
        userData.put("email", user.getEmail());
        userData.put("learningLanguage", user.getLearningLanguage());
        userData.put("nativeLanguage", user.getNativeLanguage());
        userData.put("lastLogin", user.getLastLogin());

        return ResponseEntity.ok(userData);
    }
}
