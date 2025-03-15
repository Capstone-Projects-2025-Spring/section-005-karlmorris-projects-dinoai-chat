

export default function Home() {

    return (
        <div className="min-h-screen bg-white">
      {/* Content */}
      <div className="flex flex-col items-center mt-12">
        {/* Language Selector */}
        <label className="text-lg font-semibold">Language</label>
        <select className="mt-2 w-72 p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
          <option>Select a language</option>
        </select>

        {/* Conversation Themes */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-center">Conversation Themes</h2>
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            {["Travel", "Business", "Food", "Culture", "Health", "Technology", "Entertainment", "Education", "Sports", "Family"].map(theme => (
              <button key={theme} className="px-6 py-2 bg-gray-100 rounded-lg text-gray-700">
                {theme}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
    )

}