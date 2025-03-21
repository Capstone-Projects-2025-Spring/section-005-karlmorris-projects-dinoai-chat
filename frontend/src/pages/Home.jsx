import { useState } from "react";
import ChatInput from "../components/ChatInput";
import ConversationThemes from "../components/ConversationThemes";
import LanguageSelector from "../components/LanguageSelector";

export default function Home() {

    const [language, setLanguage] = useState("English");

    const [messages, setMessages] = useState([]);

    const types = ["Travel", "Business", "Food", "Culture", "Health", "Technology", "Entertainment", "Education", "Sports", "Family"];

    const handleInputSubmit = (inputText) => {
        return new Promise((resolve) => {
            setMessages((prev) => [...prev, { id: Date.now(), text: inputText }]);
            setTimeout(() => resolve(), 500);
            });
        };

    return (
        <div className="bg-white flex-1 flex flex-col items-center justify-center py-16 md:py-10 px-8 md:px-12 mb-6">

            <h1 className="text-5xl font-bold mt-2 md:mt-6">DinoAI</h1>

            {/* Language Selector */}
            <h2 className="text-lg font-semibold mt-4 md:mt-6">Language</h2>
            <LanguageSelector onLanguageChange={setLanguage}/>

            {/* Conversation Themes */}
            <ConversationThemes types={types} />

            {/* Chat Input */}
            <div className="bottom-10 left-1/2 transform -translate-x-1/2 fixed w-3/4">
                <ChatInput onInputSubmit={handleInputSubmit} />
            </div>
        </div>
    );
}
