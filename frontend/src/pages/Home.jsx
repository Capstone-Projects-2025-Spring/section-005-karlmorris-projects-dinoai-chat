import ConversationThemes from "../components/ConversationThemes";

export default function Home() {

    const types = ["Travel", "Business", "Food", "Culture", "Health", "Technology", "Entertainment", "Education", "Sports", "Family"];

    return (
        <div className="min-h-screen bg-white">
            <div className="flex flex-col items-center mt-12 mb-6">
                {/* Language Selector */}
                <label className="text-xl font-semibold">Language</label>
                <select className="mt-2 w-72 p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
                    <option>Select a language</option>
                </select>

                {/* Conversation Themes */}
                <ConversationThemes types={types}/>
            </div>
    </div>
    )

}