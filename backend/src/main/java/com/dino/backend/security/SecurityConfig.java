package com.dino.backend.security;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.dino.backend.config.CorsProperties;
import com.dino.backend.model.User;
import com.dino.backend.repository.UserRepository;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtRequestFilter jwtRequestFilter;
    
    @Autowired
    private CorsProperties corsProperties;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Configure CORS with the customizer
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Disable CSRF with the customizer
            .csrf(csrf -> csrf.disable())
            
            // Configure request authorization with the lambda
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/test", "/auth/signup", "/auth/login").permitAll()
                .requestMatchers("/api/sessions/**", "/api/messages/**", "/api/prompts/**").authenticated()
                .anyRequest().authenticated()
            )
            
            // Configure session management with the customizer
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
            
        // Add JWT filter
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
            
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Use the configured values
        configuration.setAllowedOrigins(corsProperties.getAllowedOrigins());
        configuration.setAllowedMethods(corsProperties.getAllowedMethods());
        configuration.setAllowedHeaders(corsProperties.getAllowedHeaders());
        configuration.setExposedHeaders(corsProperties.getExposedHeaders());
        configuration.setAllowCredentials(corsProperties.isAllowCredentials());
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return usernameOrEmail -> {
            // Try to find by email first
            Optional<User> userOptional = userRepository.findByEmail(usernameOrEmail);
            
            // If not found by email, try by username
            if (userOptional.isEmpty()) {
                userOptional = userRepository.findByUsername(usernameOrEmail);
            }
            
            User user = userOptional.orElseThrow(() -> 
                new UsernameNotFoundException("User not found with email or username: " + usernameOrEmail));
            
            return org.springframework.security.core.userdetails.User
                .withUsername(usernameOrEmail)  // Use the input value as the principal
                .password(user.getPassword())
                .roles("USER")
                .build();
        };
    }    
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
    
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}