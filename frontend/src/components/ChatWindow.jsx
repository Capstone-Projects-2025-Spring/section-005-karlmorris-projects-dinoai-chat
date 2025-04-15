import React from "react";
import ChatBubble from "./ChatBubble";

export default function ChatWindow({ messages }) {
  return (
    <div className="chat-window flex flex-col gap-4">
      {messages.map((msg) => (
        <div key={msg.id}>
          <ChatBubble message={msg.content} isUser={msg.isUser} />
          
          {/* Render an alert below the AI message if it has feedback */}
          {!msg.isUser && msg.feedbackAlertType && (
            <div
              className={`alert shadow-lg my-2 ${
                msg.feedbackAlertType === "success"
                  ? "alert-success"
                  : "alert-error"
              }`}
            >
              <div>
                {msg.feedbackAlertType === "success" && (
                  <span>No grammar errors found. Great job!</span>
                )}
                {msg.feedbackAlertType === "error" && msg.corrections?.length > 0 && (
                  <div>
                    <span>There are grammar/spelling issues:</span>
                    <ul className="list-disc ml-5">
                      {msg.corrections.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
