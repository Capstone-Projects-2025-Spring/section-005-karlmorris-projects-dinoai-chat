import React, { useState } from 'react';
import GlassBackground from '../components/GlassBackground';

const Vocabulary = () => {
  const [language, setLanguage] = useState('Spanish');
  const [vocabList, setVocabList] = useState([
    { word: 'hola', definition: 'hello', score: 0 },
    { word: 'adiós', definition: 'goodbye', score: 0 },
    { word: 'gracias', definition: 'thank you', score: 0 }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const languages = ['Spanish', 'French', 'German', 'Japanese'];

  const selectNextWord = () => {
    const weights = vocabList.map((item) => 1 / (item.score + 1));
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
          <h2 className="text-2xl font-semibold text-blue-600">{vocabList[currentIndex].word}</h2>

          {revealed ? (
            <>
              <p className="text-lg text-gray-800">
                <strong>Definition:</strong> {vocabList[currentIndex].definition}
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
