package com.dino.backend.model;

import jakarta.persistence.*; 
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "dino_user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "dino_user_id_seq")
    @SequenceGenerator(name = "dino_user_id_seq", sequenceName = "dino_user_id_seq", allocationSize = 1)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "learning_language", nullable = false)
    private String learningLanguage;

    @Column(name = "native_language", nullable = false)
    private String nativeLanguage;

    @Column(name = "profile_pic_url")
    private String profilePicUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "last_login")
    @UpdateTimestamp
    private LocalDateTime lastLogin;

    @Column(name = "reminder_interval")
    private Integer reminderInterval;
}