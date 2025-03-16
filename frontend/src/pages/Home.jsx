import ConversationThemes from "../components/ConversationThemes";

import { useState } from "react";

export default function DinoAI() {
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-1/4 border-r p-6">
        

        {/* Chats */}
        <h2 className="mt-6 text-lg font-semibold text-gray-700">Chats</h2>
        <ul className="mt-4 space-y-4 text-gray-600">
          {[
            { lang: "Spanish", time: "15 mins ago" },
            { lang: "French", time: "1 hour ago" },
            { lang: "English", time: "3 hours ago" },
            { lang: "Italian", time: "4 hours ago" },
            { lang: "German", time: "7 hours ago" },
            { lang: "French", time: "9 hours ago" },
          ].map((chat, index) => (
            <li key={index} className="flex flex-col">
              <span className="font-medium">{chat.lang} - {index + 1}st chat</span>
              <span className="text-sm text-gray-500">{chat.time}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-12">
        

        {/* Main Content */}
        <h1 className="text-4xl font-bold mt-6">DinoAI</h1>

        {/* Language Selector */}
        <h2 className="text-lg font-semibold mt-6">Language</h2>
        <div className="mt-2 flex items-center space-x-2 border rounded-lg px-4 py-2 bg-gray-100">
          <span>🇬🇧</span>
          <select
            className="bg-transparent text-gray-700 focus:outline-none"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
            <option>Italian</option>
          </select>
        </div>

        {/* Conversation Themes */}
        <h2 className="text-xl font-semibold mt-8">Conversation Themes</h2>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {["Travel", "Business", "Food", "Culture", "Health", "Technology", "Entertainment", "Education", "Sports", "Family"].map((theme) => (
            <button key={theme} className="px-6 py-2 bg-gray-100 rounded-lg text-gray-700">
              {theme}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="mt-8 w-3/4">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full border rounded-lg px-4 py-3 text-gray-700 focus:outline-none"
          />
        </div>
      </main>
    </div>
  );
}
