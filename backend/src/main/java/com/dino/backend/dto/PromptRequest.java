package com.dino.backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromptRequest {
    private Long sessionId;
    private Long userId;
    private String startTime;
    private String endTime;
    private String languageUsed;
    private String sessionTopic;
    private String feedbackSummary;

    private List<Message> messages;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Message {
        private Long messageId;
        private Long sessionId;
        private String senderType;
        private String content;
        private String timestamp;
        private String correctedContent;
    }
}
