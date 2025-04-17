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


function parseCorrections(feedback = "") {
  
  const pattern = /\[(?!no correction needed\])(.*?)\]/gi;
  const matches = [];
  let match;
  while ((match = pattern.exec(feedback)) !== null) {
    
    const correction = match[1].trim();
    if (correction) {
      matches.push(correction);
    }
  }
  return matches;
}

export default function Home() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [language, setLanguage] = useState("English");
  const [messages, setMessages] = useState([]);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [sessionIdState, setSessionIdState] = useState(
    sessionId ? parseInt(sessionId) : null
  );

  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).userId : null;
  const token = localStorage.getItem("token");
  const topic = "General";

  useEffect(() => {
    if (sessionId) {
      fetchChatSession(sessionId)
        .then(data => {
          const msgs = data.messages.map(msg => ({
            id: msg.messageId,
            content: msg.content,
            isUser: msg.senderType === "user",
          }));
          setMessages(msgs);
          setIsChatStarted(true);
        })
        .catch(console.error);
    }
  }, [sessionId]);

  const handleInputSubmit = async (inputText) => {
    setIsChatStarted(true);

    // Show user message right away
    const userMessage = {
      id: Date.now(),
      content: inputText,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      let currentSessionId = sessionIdState;

      // If no session yet, create it
      if (!currentSessionId) {
        const session = await startSession(userId, language, topic);
        currentSessionId = session.sessionId;
        setSessionIdState(currentSessionId);

        await saveMessage(token, currentSessionId, inputText, "user");
        navigate(`/chat/${currentSessionId}`);
      }

      // Prepare the full message array for the backend
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

      // Safely parse the AI's JSON
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
        console.error("❌ Failed to parse AI reply JSON:", err, "\nrawText:", rawText);
        parsedResult = {
          conversation: "⚠️ DinoAI didn't return proper JSON.",
          feedback: "[Error: Could not parse AI reply.]",
        };
      }

      // Build AI message content
      const botReplyContent = parsedResult.conversation || "No conversation text.";
      
      // Gather corrections from feedback using our helper function
      const corrections = parseCorrections(parsedResult.feedback);
      
      // Normalize the feedback text for comparison
      const normalizedFeedback = parsedResult.feedback.trim().toLowerCase();
      
      



      let feedbackAlertType;
      if (normalizedFeedback.includes("no correction needed") || corrections.length === 0) {
        feedbackAlertType = "success";
      } else {
        feedbackAlertType = "error";
      }

      // Compose the AI message object including feedback data
      const aiMessage = {
        id: Date.now() + 1,
        content: botReplyContent,
        isUser: false,
        feedback: parsedResult.feedback || "",
        corrections: corrections,
        feedbackAlertType: feedbackAlertType,
      };

      // Add the AI message to the conversation
      setMessages((prev) => [...prev, aiMessage]);

      // Save user and AI messages to DB
      await saveMessage(token, currentSessionId, botReplyContent, "bot");
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
