import React, { useState, useEffect } from 'react';
import GlassBackground from '../components/GlassBackground';
import api from '../api/axios';

const Vocabulary = () => {
  const [vocabList, setVocabList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notReady, setNotReady] = useState(false);

  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("🔍 Token:", token);

        const vocabRes = await api.get(`/api/vocabulary/daily`);
        console.log("✅ Response:", vocabRes.data);

        const vocabJson = vocabRes.data.vocabJson;
        if (!vocabJson) {
          console.error("❌ vocabJson is missing");
          throw new Error("No vocabulary found. Chat with Dino to generate vocab.");
        }

        let parsed;
        try {
          const cleaned = typeof vocabJson === "string" ? JSON.parse(vocabJson) : vocabJson;
          parsed = Array.isArray(cleaned) ? cleaned : [];
        } catch (e) {
          console.error("❌ Failed to parse JSON:", vocabJson);
          throw new Error("Vocabulary format is incorrect.");
        }

        console.log("✅ Parsed:", parsed);

        const normalized = parsed.map(entry => {
          if (typeof entry === "string" && entry.includes(":")) {
            const [word, definition] = entry.split(":");
            return { word: word.trim(), definition: definition.trim(), score: 0 };
          } else if (entry.word && entry.definition) {
            return { ...entry, score: 0 };
          } else {
            return null;
          }
        }).filter(Boolean);

        if (normalized.length === 0) {
          console.warn("⚠️ No vocab generated. Prompt user to chat.");
          setNotReady(true);
          setLoading(false);
          return;
        }

        setVocabList(normalized);
        setCurrentIndex(0);
        setRevealed(false);
        setNotReady(false);
        setLoading(false);

      } catch (err) {
        console.error("❌ Failed to fetch vocabulary:", err);
        setError(err.message || "Unknown error");
        setLoading(false);
      }
    };

    fetchVocabulary();
  }, []);

  const selectNextWord = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < vocabList.length) {
      setCurrentIndex(nextIndex);
      setRevealed(false);
    } else {
      // Optionally loop back to the beginning or show a message
      setCurrentIndex(0);
      setRevealed(false);
    }
  };

  if (loading) {
    return <div className="text-center text-xl mt-20">Loading your vocabulary...</div>;
  }

  if (notReady) {
    return (
      <div className="text-center max-w-xl mx-auto mt-20 bg-blue-50 border border-blue-200 text-blue-900 px-6 py-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-3">👋 Welcome to Vocabulary Practice!</h2>
        <p className="text-lg mb-2">
          We don't have any flashcards for you just yet.
        </p>
        <p>
          To get started, go to the <strong>Dino chat</strong> and tell it which language you're learning. 
          Dino will generate personalized vocabulary as you interact.
        </p>
        <p className="mt-3">
          Come back here after a few messages to start studying!
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center max-w-xl mx-auto mt-20 bg-yellow-100 border border-yellow-300 text-yellow-800 px-6 py-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">📚 Ready to Learn?</h2>
        <p>{error}</p>
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
