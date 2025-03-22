export default function ChatBubble({ message, isUser }) {
    return (
        <div className={`chat ${isUser ? "chat-end" : "chat-start"}`}>
            <div className={`chat-bubble break-words ${isUser ? "bg-lime-200" : ""}`}>
                {message}
            </div>
        </div>
    );
}
