import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchChatSession } from "../api";
import ChatInput from "../components/ChatInput";
import ChatWindow from "../components/ChatWindow";
import ConversationThemes from "../components/ConversationThemes";
import LanguageSelector from "../components/LanguageSelector";

export default function Home() {

    const { sessionId } = useParams();

    const [language, setLanguage] = useState("English");
    const [messages, setMessages] = useState([]);
    const [isChatStarted, setIsChatStarted] = useState(false);

    const types = ["Travel", "Business", "Food", "Culture", "Health", "Technology", "Entertainment", "Education", "Sports", "Family"];

    useEffect(() => {
        if (sessionId) {
            fetchChatSession(sessionId)
                .then((data) => {
                    
                    const transformedMessages = data.messages.map((msg) => ({
                        id: msg.message_id,
                        content: msg.content,
                        isUser: msg.sender_type === "user"
                    }));

                    setMessages(transformedMessages);
                    console.log(messages);
                    setIsChatStarted(true);
                })
                .catch((error) => {
                console.error("Fetch chat session error:", error);
            });
        }
    }, [sessionId]);

    const handleInputSubmit = (inputText) => {
        setIsChatStarted(true);
        return new Promise((resolve) => {
            setMessages((prev) => [...prev, { id: Date.now(), content: inputText, isUser: true }]);
            setTimeout(() => {
                const simulatedReply = `Gemini API simulator：DO U MEAN "${inputText}"？ Language Selected: ${language}`;
                setMessages((prev) => [
                    ...prev,
                    { id: Date.now() + 1, content: simulatedReply, isUser: false },
                ]);
                resolve();
            }, 
            500);
            });
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
                    <LanguageSelector onLanguageChange={setLanguage}/>
                </div>
            )}

            {isChatStarted && (
                <div className="w-full max-w-4xl mt-6 mb-24 items-center">
                    <ChatWindow messages={messages}/>
                </div>
            )}

            {/* Chat Input */}
            <div className="bottom-10 left-1/2 transform -translate-x-1/2 fixed w-3/4">
            <ChatInput onInputSubmit={handleInputSubmit} />
            </div>
        </div>
    );
}