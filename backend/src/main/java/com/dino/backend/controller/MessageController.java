package com.dino.backend.controller;

import com.dino.backend.model.Message;
import com.dino.backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<Message>> getMessagesBySession(@PathVariable Long sessionId) {
        List<Message> messages = messageService.getMessagesBySessionId(sessionId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping
    public ResponseEntity<Message> createMessage(@RequestBody Message message) {
        Message savedMessage = messageService.saveMessage(message);
        return ResponseEntity.ok(savedMessage);
    }
}