package com.dino.backend.service;

import com.dino.backend.dto.SignUpRequest;
import com.dino.backend.model.User;
import com.dino.backend.repository.UserRepository;
import com.dino.backend.exception.UserAlreadyExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class that handles business logic for user operations
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Creates a new user account based on the sign-up request
     * 
     * @param signUpRequest the sign-up information
     * @return the created user
     * @throws UserAlreadyExistsException if username or email already exists
     */
    @Transactional
    public User signUp(SignUpRequest signUpRequest) {
        // Check if username already exists
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new UserAlreadyExistsException("Username already taken");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new UserAlreadyExistsException("Email already in use");
        }

        // Create new user entity
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        // Encode password before storing
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setLearningLanguage(signUpRequest.getLearningLanguage());
        user.setNativeLanguage(signUpRequest.getNativeLanguage());
        user.setProfilePicUrl(signUpRequest.getProfilePicUrl());
        // reminderInterval will be null initially unless set

        // Save and return the new user
        return userRepository.save(user);
    }

    /**
     * Finds a user by their username
     * 
     * @param username the username to search for
     * @return the user if found, null otherwise
     */
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    /**
     * Finds a user by their email
     * 
     * @param email the email to search for
     * @return the user if found, null otherwise
     */
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    /**
     * Updates a user's reminder interval setting
     * 
     * @param userId the ID of the user to update
     * @param reminderInterval the new reminder interval in days
     * @return the updated user
     */
    @Transactional
    public User updateReminderInterval(Long userId, Integer reminderInterval) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setReminderInterval(reminderInterval);
        return userRepository.save(user);
    }
}