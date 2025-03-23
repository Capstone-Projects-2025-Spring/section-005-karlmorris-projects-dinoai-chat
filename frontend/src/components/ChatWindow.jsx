import ChatBubble from "./ChatBubble";
export default function ChatWindow({ messages }) {
    return (
        <div className="flex flex-col p-4 h-auto">
            {messages.map((msg, index) => (
                <ChatBubble key={index} message={msg.content} isUser={msg.isUser} />
            ))}
        </div>
    );
}
