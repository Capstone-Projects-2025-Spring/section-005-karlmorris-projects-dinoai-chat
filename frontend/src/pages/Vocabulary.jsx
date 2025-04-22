import React, { useState } from 'react';

const Vocabulary = () => {
  const [language, setLanguage] = useState('Spanish');
  const [vocabList, setVocabList] = useState([
    { word: 'hola', definition: 'hello' },
    { word: 'adiós', definition: 'goodbye' },
    { word: 'gracias', definition: 'thank you' }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const languages = ['Spanish', 'French', 'German', 'Japanese'];

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % vocabList.length);
    setRevealed(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px 20px',
      background: 'linear-gradient(to right, #f0f4f8, #e2eafc)',
      fontFamily: 'Segoe UI, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{
        color: '#333',
        fontSize: '2.5rem',
        marginBottom: '30px'
      }}>🧠 Vocabulary Practice</h1>

      {/* Language Selector */}
      <div style={{ marginBottom: '30px' }}>
        <label
          htmlFor="language-select"
          style={{ marginRight: '12px', fontSize: '1.1rem' }}
        >
          Choose a language:
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            padding: '10px 16px',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      {/* Flashcard */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '40px 30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        textAlign: 'center',
        width: '100%',
        maxWidth: '400px',
        transition: 'all 0.3s ease-in-out'
      }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '20px',
          color: '#0077cc'
        }}>
          {vocabList[currentIndex].word}
        </h2>

        {revealed ? (
          <>
            <p style={{ fontSize: '1.25rem', marginBottom: '20px' }}>
              <strong>Definition:</strong> {vocabList[currentIndex].definition}
            </p>
            <button
              onClick={nextCard}
              style={buttonStyle}
            >
              Next Word →
            </button>
          </>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            style={buttonStyle}
          >
            Reveal Definition
          </button>
        )}
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '12px 24px',
  fontSize: '1rem',
  backgroundColor: '#0077cc',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  marginTop: '15px',
  transition: 'background-color 0.3s ease-in-out'
};

export default Vocabulary;
