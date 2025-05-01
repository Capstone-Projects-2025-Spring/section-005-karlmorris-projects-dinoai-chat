import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addFeedback,
  endSession,
  fetchChatSession,
  saveMessage,
  sendPrompt,
  startSession,
} from "../api";
import bronze from '../assets/bronze.svg';
import gold from '../assets/gold.svg';
import poor from '../assets/poor.svg';
import silver from '../assets/silver.svg';
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
  const [score, setScore] = useState(100);
  const feedbackDialog = useRef(null);

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

  const getRating = (sc) => {
    if (sc > 90) return "Excellent";
    if (sc > 75) return "Good";
    if (sc > 50) return "Fair";
    return "Needs Improvement";
  };

  const getBadge = () => {
    if (score > 90) return gold;
    if (score > 75) return silver;
    if (score > 50) return bronze;
    return poor;
  };

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
        // Look for the last JSON object in the response
        let jsonText = rawText;
        
        // Clean up markdown formatting if present
        jsonText = jsonText.replace(/```json\n/g, "").replace(/\n```/g, "");
        
        // If there are multiple JSON objects, get the last complete one
        const lastJsonStartIndex = jsonText.lastIndexOf("{");
        if (lastJsonStartIndex !== -1) {
          jsonText = jsonText.substring(lastJsonStartIndex);
        }
        
        parsedResult = JSON.parse(jsonText);
      } catch (err) {
        console.error("❌ Failed to parse AI reply JSON:", err, "\nrawText:", rawText);
        
        // Fallback: Look for the conversation value directly with regex
        const conversationMatch = rawText.match(/"conversation":\s*"([^"]+)"/);
        const feedbackMatch = rawText.match(/"feedback":\s*"([^"]*?)"/);
        
        parsedResult = {
          conversation: conversationMatch ? conversationMatch[1] : "⚠️ DinoAI didn't return proper JSON.",
          feedback: feedbackMatch ? feedbackMatch[1] : "[Error: Could not parse AI reply.]",
        };
      }

      // Build AI message content
      const botReplyContent = parsedResult.conversation || "No conversation text.";

      // Gather corrections from feedback using our helper function
      const corrections = parseCorrections(parsedResult.feedback);

      // Normalize the feedback text for comparison
      const normalizedFeedback = parsedResult.feedback ? parsedResult.feedback.trim().toLowerCase() : "";

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

      setScore((prev) => {
        const delta = feedbackAlertType === "error" ? -5 : 5;
        const newScore = Math.min(100, Math.max(0, prev + delta));
        return newScore;
      });

      // Save user and AI messages to DB
      await saveMessage(token, currentSessionId, inputText, "user");
      await saveMessage(token, currentSessionId, botReplyContent, "bot");
    } catch (err) {
      console.error("Error in handleInputSubmit:", err);
      let errorMessage = "⚠️ Error talking to DinoAI. Please try again.";
      if (err.message.includes("Not authenticated") || err.message.includes("401")) {
        errorMessage = "⚠️ You are not logged in. Please log in and try again.";
      } else if (err.message.includes("403")) {
        errorMessage = "⚠️ You do not have permission to start this session.";
      } else if (err.message.includes("Failed to start session")) {
        errorMessage = "⚠️ Could not start the chat session. Please try again.";
      }
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          content: errorMessage,
          isUser: false,
        },
      ]);
    }
  };

  const handleEndConversation = () => {
    if (!sessionIdState) return;
    feedbackDialog.current?.showModal();
  };

  const handleSubmitFeedback = async () => {
    try {
      // mark end time
      await endSession(sessionIdState);
      // save feedback summary
      const summary = `${getRating(score)} (${score})`;
      await addFeedback(sessionIdState, summary);
      feedbackDialog.current?.close();
      navigate("/");
      window.location.href = "/";
    } catch (err) {
      console.error("Error submitting feedback:", err);
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

      {/* Feedback Modal */}
      <dialog ref={feedbackDialog} className="modal">
        <div className="modal-box">
          <img src={getBadge()} alt="badge" className="mx-auto w-36 h-36 my-4" />
          <h3 className="font-bold text-lg">Your Score: {score}</h3>
          <p className="py-4">{getRating(score)}</p>
          <div className="modal-action">
            <button className="btn" onClick={handleSubmitFeedback}>
              Close
            </button>
          </div>
        </div>
      </dialog>

      {/* Chat Input */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-transluctant shadow-lg">
        <div className="max-w-4xl mx-auto">
          <ChatInput onInputSubmit={handleInputSubmit} onEndConversation={handleEndConversation} />
        </div>
      </div>
    </div>
  );
}