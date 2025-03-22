package com.dino.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class DinoAiApplication {

	public static void main(String[] args) {
		SpringApplication.run(DinoAiApplication.class, args);
	}

}
