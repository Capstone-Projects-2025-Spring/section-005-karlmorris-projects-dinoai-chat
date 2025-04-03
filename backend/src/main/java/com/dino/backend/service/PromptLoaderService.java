package com.dino.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
public class PromptLoaderService {

    @Value("classpath:prompts/system_prompt.txt")
    private Resource systemPromptResource;

    public String loadSystemPrompt() throws IOException {
        return new String(Files.readAllBytes(Paths.get(systemPromptResource.getURI())));
    }
}
