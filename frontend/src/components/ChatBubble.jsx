export default function ChatBubble({ message, isUser }) {
  return (
      <div className={`chat ${isUser ? "chat-end" : "chat-start"}`}>
          <div className={`chat-bubble ${isUser ? "chat-bubble-info" : "chat-bubble-"}`}>
              {message}
          </div>
      </div>
  );
}
