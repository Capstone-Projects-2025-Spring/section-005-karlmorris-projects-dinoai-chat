import ChatBubble from "./ChatBubble";
export default function ChatWindow({ messages }) {
  return (
      <div className="flex flex-col p-4 h-[500px] overflow-y-auto">
          {messages.map((msg, index) => (
              <ChatBubble key={index} message={msg.text} isUser={msg.isUser} />
          ))}
      </div>
  );
}
