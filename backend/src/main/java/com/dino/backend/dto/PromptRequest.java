package com.dino.backend.dto;

import java.util.List;

public class PromptRequest {
    private Long session_id;
    private Long user_id;
    private String start_time;
    private String end_time;
    private String language_used;
    private String session_topic;
    private String feedback_summary;
    private List<Message> messages;

    // Getters and Setters for PromptRequest
    public Long getSession_id() {
        return session_id;
    }

    public void setSession_id(Long session_id) {
        this.session_id = session_id;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public String getStart_time() {
        return start_time;
    }

    public void setStart_time(String start_time) {
        this.start_time = start_time;
    }

    public String getEnd_time() {
        return end_time;
    }

    public void setEnd_time(String end_time) {
        this.end_time = end_time;
    }

    public String getLanguage_used() {
        return language_used;
    }

    public void setLanguage_used(String language_used) {
        this.language_used = language_used;
    }

    public String getSession_topic() {
        return session_topic;
    }

    public void setSession_topic(String session_topic) {
        this.session_topic = session_topic;
    }

    public String getFeedback_summary() {
        return feedback_summary;
    }

    public void setFeedback_summary(String feedback_summary) {
        this.feedback_summary = feedback_summary;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    // Inner class Message
    public static class Message {
        private Long message_id;
        private Long session_id;
        private String sender_type;
        private String content;
        private String timestamp;
        private String corrected_content;

        // Getters and setters for Message
        public Long getMessage_id() {
            return message_id;
        }

        public void setMessage_id(Long message_id) {
            this.message_id = message_id;
        }

        public Long getSession_id() {
            return session_id;
        }

        public void setSession_id(Long session_id) {
            this.session_id = session_id;
        }

        public String getSender_type() {
            return sender_type;
        }

        public void setSender_type(String sender_type) {
            this.sender_type = sender_type;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(String timestamp) {
            this.timestamp = timestamp;
        }

        public String getCorrected_content() {
            return corrected_content;
        }

        public void setCorrected_content(String corrected_content) {
            this.corrected_content = corrected_content;
        }
    }
}
