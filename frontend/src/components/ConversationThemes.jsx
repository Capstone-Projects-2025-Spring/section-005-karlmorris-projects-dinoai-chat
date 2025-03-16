export default function ConversationThemes({types = ["default"]}) {
    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-center">Conversation Themes</h2>
            <div className="grid grid-cols-2 gap-2 mt-2 md:grid-cols-3 gap-4 mt-4 text-center">
                {types.map(theme => (
                <button key={theme} className="px-6 py-2 bg-gray-100 rounded-lg text-gray-700">
                    {theme}
                </button>
                ))}
            </div>
        </div>
    )
}