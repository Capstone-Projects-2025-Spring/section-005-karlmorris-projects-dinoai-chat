import ConversationThemes from "../components/ConversationThemes";
import LanguageSelector from "../components/LanguageSelector";


export default function Home() {

    const types = ["Travel", "Business", "Food", "Culture", "Health", "Technology", "Entertainment", "Education", "Sports", "Family"];

    return (
        <div className="bg-white flex-1 flex flex-col items-center justify-center py-16 md:py-10 px-8 md:px-12 mb-6">

            <h1 className="text-5xl font-bold mt-2 md:mt-6">DinoAI</h1>

            {/* Language Selector */}
            <h2 className="text-lg font-semibold mt-4 md:mt-6">Language</h2>
            <LanguageSelector />
            

            {/* Conversation Themes */}
            <ConversationThemes types={types} />
            

            {/* Chat Input */}
            <div className="mt-8 md:mt-10 w-3/4">
            <input
                type="text"
                placeholder="Type a message..."
                className="w-full border rounded-lg px-4 py-3 text-gray-700 focus:outline-none"
            />
            </div>
        </div>
    );
}
