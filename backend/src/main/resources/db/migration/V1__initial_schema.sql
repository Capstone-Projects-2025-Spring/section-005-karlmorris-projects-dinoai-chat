-- User Table
CREATE TABLE dino_user (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    learning_language VARCHAR(50) NOT NULL,
    native_language VARCHAR(50) NOT NULL,
    profile_pic_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    reminder_interval INTEGER
);

-- Chat Session Table
CREATE TABLE dino_chat_session (
    session_id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    language_used VARCHAR(50) NOT NULL,
    session_topic VARCHAR(255),
    feedback_summary TEXT,
    FOREIGN KEY (user_id) REFERENCES dino_user(user_id) ON DELETE CASCADE
);

-- Message Table
CREATE TABLE dino_message (
    message_id SERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL,
    sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('user', 'bot')),
    content TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    corrected_content TEXT,
    FOREIGN KEY (session_id) REFERENCES dino_chat_session(session_id) ON DELETE CASCADE
);

--Vocabulary Table
CREATE TABLE dino_vocabulary_set (
    voacb_id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    date DATE NOT NULL,
    vocab_json TEXT NOT NULL,
    UNIQUE(user_id, date)
);


-- Indexes for performance
CREATE INDEX idx_user_username ON dino_user (username);
CREATE INDEX idx_user_email ON dino_user (email);
CREATE INDEX idx_session_user_id ON dino_chat_session (user_id);
CREATE INDEX idx_message_session_id ON dino_message (session_id);
CREATE INDEX idx_message_timestamp ON dino_message(timestamp);