package com.dino.backend.integration.gemini;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gemini")
public class GeminiAPIController {

    private final GeminiAPIService geminiAPIService;

    @Autowired
    public GeminiAPIController(GeminiAPIService geminiAPIService) {
        this.geminiAPIService = geminiAPIService;
    }
    @PostMapping("/respnse")
    public ResponseEntity<String> getResponse(@RequestBody InputRequest inputRequest) {
        String response = geminiAPIService.getResponse(inputRequest.getInput());
        return ResponseEntity.ok(response);
    }


    @PostMapping("/grammar")
    public ResponseEntity<String> getGrammarFeedback(@RequestBody InputRequest inputRequest) {
        String response = geminiAPIService.getGrammarFeedback(inputRequest.getInput());
        return ResponseEntity.ok(response);
    }
}
