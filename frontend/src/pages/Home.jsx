import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchChatSession,
  saveMessage,
  sendPrompt,
  startSession,
} from "../api";
import ChatInput from "../components/ChatInput";
import ChatWindow from "../components/ChatWindow";
import LanguageSelector from "../components/LanguageSelector";

export default function Home() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [language, setLanguage] = useState("English");
  const [messages, setMessages] = useState([]);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [sessionIdState, setSessionIdState] = useState(sessionId ? parseInt(sessionId) : null);
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).userId : null;
  const token = localStorage.getItem("token");
  const topic = "General";

  useEffect(() => {
    if (sessionId) {
      fetchChatSession(sessionId)
        .then((data) => {
          const transformedMessages = data.messages.map((msg) => ({
            id: msg.message_id,
            content: msg.content,
            isUser: msg.sender_type === "user",
          }));
          setMessages(transformedMessages);
          setIsChatStarted(true);
        })
        .catch((error) => {
          console.error("Fetch chat session error:", error);
        });
    }
  }, [sessionId]);

  const handleInputSubmit = async (inputText) => {
    setIsChatStarted(true);
  
    const userMessage = {
      id: Date.now(),
      content: inputText,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);
  
    try {
      let currentSessionId = sessionIdState;
  
      if (!currentSessionId) {
        const session = await startSession(userId, language, topic);
        currentSessionId = session.sessionId;
        setSessionIdState(currentSessionId);
        navigate(`/chat/${currentSessionId}`);
      }
  
      const formattedMessages = [...messages, userMessage].map((msg) => ({
        content: msg.content,
        senderType: msg.isUser ? "USER" : "BOT",
      }));
  
      const result = await sendPrompt({
        messages: formattedMessages,
        language,
        sessionId: currentSessionId,
        userId,
        topic,
      });
  
      // ✅ 安全解析 Gemini 返回的 JSON 字符串
      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      let parsedResult;
  
      try {
        const cleanedText = rawText
          .trim()
          .replace(/^```json/, "")
          .replace(/^```/, "")
          .replace(/```$/, "")
          .trim();
  
        parsedResult = JSON.parse(cleanedText);
      } catch (err) {
        console.error("❌ Failed to parse bot reply JSON:", err, "\nrawText:", rawText);
        parsedResult = {
          conversation: "⚠️ DinoAI failed to understand the response format.",
          feedback: "[Error: Could not parse AI reply. Please try again.]",
        };
      }
  
      const botReply = `${parsedResult.conversation}\n\n📝 ${parsedResult.feedback}`;
  
      const aiMessage = {
        id: Date.now() + 1,
        content: botReply,
        isUser: false,
      };
      setMessages((prev) => [...prev, aiMessage]);
  
      await saveMessage(token, currentSessionId, inputText, "user");
      console.log("✅ User message saved!");
  
      await saveMessage(token, currentSessionId, botReply, "bot");
      console.log("✅ Bot message saved!");
  
    } catch (err) {
      console.error("Gemini prompt failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          content: "⚠️ Error talking to DinoAI. Please try again.",
          isUser: false,
        },
      ]);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-8 md:py-6 px-8 md:px-12 mb-6">
      {!isChatStarted && (
        <div className="min-h-auto flex flex-col items-center justify-center py-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-violet-500 bg-clip-text text-transparent">
            DinoAI
          </h1>

          <p className="text-gray-400 mt-2 text-base md:text-lg italic">
            "Your language journey starts here."
          </p>

          <h2 className="text-lg font-semibold mt-6">Language</h2>
          <LanguageSelector onLanguageChange={setLanguage} />
        </div>
      )}

      {isChatStarted && (
        <div className="w-full max-w-4xl mt-6 mb-24 items-center">
          <ChatWindow messages={messages} />
        </div>
      )}

      {/* Chat Input */}
      <div className="bottom-10 left-1/2 transform -translate-x-1/2 fixed w-3/4">
        <ChatInput onInputSubmit={handleInputSubmit} />
      </div>
    </div>
  );
}
