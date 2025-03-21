import { useState } from "react";
import ChatInput from "../components/ChatInput";
import ChatWindow from "../components/ChatWindow";
import ConversationThemes from "../components/ConversationThemes";
import LanguageSelector from "../components/LanguageSelector";

export default function Home() {

    const [language, setLanguage] = useState("English");
    const [messages, setMessages] = useState([]);
    const [isChatStarted, setIsChatStarted] = useState(false);

    const types = ["Travel", "Business", "Food", "Culture", "Health", "Technology", "Entertainment", "Education", "Sports", "Family"];

    const handleInputSubmit = (inputText) => {
        setIsChatStarted(true);
        return new Promise((resolve) => {
            setMessages((prev) => [...prev, { id: Date.now(), text: inputText, isUser: true }]);
            setTimeout(() => {
                const simulatedReply = `Gemini API simulator：DO U MEAN "${inputText}"？ Language Selected: ${language}`;
                setMessages((prev) => [
                    ...prev,
                    { id: Date.now() + 1, text: simulatedReply, isUser: false },
                ]);
                resolve();
            }, 
            500);
            });
        };

    return (
        <div className="bg-white flex-1 flex flex-col items-center justify-center py-8 md:py-6 px-8 md:px-12 mb-6">
            {!isChatStarted && (
                <>
                    <h1 className="text-5xl font-bold mt-2 md:mt-6">DinoAI</h1>

                    {/* Language Selector */}
                    <h2 className="text-lg font-semibold mt-4 md:mt-6">Language</h2>
                    <LanguageSelector onLanguageChange={setLanguage}/>

                    {/* Conversation Themes */}
                    <ConversationThemes types={types} />
                </>
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