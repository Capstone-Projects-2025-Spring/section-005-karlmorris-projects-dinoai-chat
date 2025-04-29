import React, { useState, useEffect } from 'react';
import GlassBackground from '../components/GlassBackground';
import api from '../api/axios';

const Vocabulary = () => {
  const [language, setLanguage] = useState('Spanish');
  const [vocabList, setVocabList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const languages = ['Spanish', 'French', 'German', 'Japanese'];

  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        const authRes = await api.get('/auth/me');
        console.log("✅ [Frontend] Fetched user:", authRes.data);

        const userId = authRes.data.userId;
        if (!userId) {
          throw new Error("User ID not found in authentication response.");
        }

        const vocabRes = await api.get(`/api/vocabulary/daily/${userId}`);
        console.log("✅ [Frontend] Fetched vocab set:", vocabRes.data);

        const vocabJson = vocabRes.data.vocabJson;
        if (!vocabJson) {
          throw new Error("vocabJson missing in vocabulary response.");
        }

        let parsed;
        try {
          parsed = JSON.parse(vocabJson);
        } catch (e) {
          console.error("❌ Failed to parse vocabJson:", vocabJson);
          throw new Error("Invalid JSON structure from server.");
        }

        console.log("✅ Parsed raw vocab:", parsed);

        const normalized = parsed.map(entry => {
          if (typeof entry === "string" && entry.includes(":")) {
            const [word, definition] = entry.split(":");
            return {
              word: word.trim(),
              definition: definition.trim(),
              score: 0
            };
          } else if (entry.word && entry.definition) {
            return {
              ...entry,
              score: 0
            };
          } else {
            console.warn("⚠️ Skipping malformed vocab entry:", entry);
            return null;
          }
        }).filter(Boolean);

        if (normalized.length === 0) {
          throw new Error(
            "We couldn't generate your flashcards yet. Try chatting with Dino so it can learn what language you're studying and suggest personalized vocabulary!"
          );
        }

        console.log("✅ Final vocab list:", normalized);
        setVocabList(normalized);
        setLoading(false);
      } catch (err) {
        console.error("❌ [Frontend] Failed to load vocabulary:", err);
        setError(err.message || "Unknown error");
        setLoading(false);
      }
    };

    fetchVocabulary();
  }, []);

  const selectNextWord = () => {
    const weights = vocabList.map(item => 1 / (item.score + 1));
    const totalWeight = weights.reduce((acc, w) => acc + w, 0);
    const rand = Math.random() * totalWeight;

    let cumulative = 0;
    for (let i = 0; i < vocabList.length; i++) {
      cumulative += weights[i];
      if (rand < cumulative) {
        setCurrentIndex(i);
        break;
      }
    }

    setRevealed(false);
  };

  if (loading) {
    return <div className="text-center text-xl mt-20">Loading your vocabulary...</div>;
  }

  if (error) {
    return (
      <div className="text-center max-w-xl mx-auto mt-20 bg-yellow-100 border border-yellow-300 text-yellow-800 px-6 py-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">📚 Ready to Learn?</h2>
        <p>{error}</p>
        <p className="mt-2">Open the Dino chat and tell it what language you're learning. After a few messages, come back here to get personalized flashcards!</p>
      </div>
    );
  }

  const currentWord = vocabList[currentIndex];

  if (!currentWord || !currentWord.word || !currentWord.definition) {
    return (
      <div className="text-center text-red-500 text-xl mt-20">
        ⚠️ Invalid vocab data: no word or definition found.
      </div>
    );
  }

  return (
    <GlassBackground>
      <div className="mx-auto pt-10 w-full max-w-3xl space-y-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">🧠 Vocabulary Practice</h1>

        {/* Language Selector */}
        <div className="flex justify-center">
          <label htmlFor="language-select" className="text-lg mr-3 mt-1">Choose a language:</label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm text-base"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md h-4 bg-gray-200 rounded-full mx-auto">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / vocabList.length) * 100}%` }}
          ></div>
        </div>

        {/* Flashcard */}
        <div className="bg-white rounded-xl shadow-xl px-8 py-10 max-w-md mx-auto space-y-4">
          <h2 className="text-2xl font-semibold text-blue-600">{currentWord.word}</h2>

          {revealed ? (
            <>
              <p className="text-lg text-gray-800">
                <strong>Definition:</strong> {currentWord.definition}
              </p>
              <button
                onClick={selectNextWord}
                className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next Word →
              </button>
            </>
          ) : (
            <button
              onClick={() => setRevealed(true)}
              className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reveal Definition
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white/70 border border-gray-200 p-6 rounded-lg max-w-md mx-auto text-left">
          <h3 className="text-lg font-semibold mb-2">📝 How to Use</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Look at the foreign word.</li>
            <li>Say the meaning out loud in your native language.</li>
            <li>Click <strong>Reveal</strong> to check your answer.</li>
            <li>Click <strong>Next Word</strong> to continue.</li>
          </ul>
        </div>
      </div>
    </GlassBackground>
  );
};

export default Vocabulary;