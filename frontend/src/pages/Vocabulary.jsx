import React, { useState, useEffect } from 'react';
import GlassBackground from '../components/GlassBackground';

const Vocabulary = () => {
  const [vocabList, setVocabList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // Fetch vocabulary from backend
  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Please log in to view vocabulary");
        }

        // Get user ID from auth/me endpoint
        const authRes = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!authRes.ok) {
          throw new Error(`Authentication failed: ${authRes.status}`);
        }
        
        const userData = await authRes.json();
        const userId = userData.userId;
        if (!userId) {
          throw new Error("User ID not found in authentication response");
        }

        // Fetch vocabulary using the user ID
        const vocabRes = await fetch(
          `${API_BASE_URL}/api/vocabulary/daily/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        if (!vocabRes.ok) {
          throw new Error(`Failed to fetch vocabulary: ${vocabRes.status}`);
        }
        
        const vocabData = await vocabRes.json();
        
        if (!vocabData.vocabJson) {
          throw new Error("No vocabulary data received from server");
        }
        
        // Parse the JSON string to get the actual vocabulary items
        const parsedData = JSON.parse(vocabData.vocabJson);
        
        // Extract and normalize vocabulary items
        const vocabulary = parsedData.vocabulary || [];
        const normalizedVocab = vocabulary.map(entry => ({
          word: entry.word.trim(),
          definition: entry.definition.trim(),
          mastered: false
        }));
        
        if (normalizedVocab.length === 0) {
          throw new Error("No vocabulary words found. Chat with Dino to generate personalized vocabulary!");
        }
        
        setVocabList(normalizedVocab);
        setCurrentIndex(0);
        setRevealed(false);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching vocabulary:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVocabulary();
  }, [API_BASE_URL]);

  const goToNextWord = () => {
    if (currentIndex < vocabList.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setRevealed(false);
    }
  };
  
  const goToPreviousWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setRevealed(false);
    }
  };
  
  const markAsMastered = () => {
    const updatedList = [...vocabList];
    updatedList[currentIndex].mastered = !updatedList[currentIndex].mastered;
    setVocabList(updatedList);
  };

  // Calculate completion percentage
  const completionPercentage = vocabList.length > 0 
    ? (vocabList.filter(word => word.mastered).length / vocabList.length) * 100 
    : 0;

  if (loading) {
    return (
      <GlassBackground>
        <div className="mx-auto pt-10 w-full max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Daily Vocabulary</h1>
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
            <p className="text-lg">Loading vocabulary...</p>
            <div className="mt-4 w-full h-2 bg-gray-200 rounded">
              <div className="h-full bg-blue-500 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </GlassBackground>
    );
  }

  if (error) {
    return (
      <GlassBackground>
        <div className="mx-auto pt-10 w-full max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Daily Vocabulary</h1>
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-lg font-medium">{error}</p>
            </div>
          </div>
        </div>
      </GlassBackground>
    );
  }

  return (
    <GlassBackground>
      <div className="mx-auto pt-10 w-full max-w-3xl space-y-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Daily Vocabulary</h1>

        {/* Completion Summary */}
        <div className="bg-white rounded-xl shadow-md p-4 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Completion:</span>
            <span className="text-blue-600 font-bold">{Math.round(completionPercentage)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {vocabList.filter(word => word.mastered).length} of {vocabList.length} words mastered
          </p>
        </div>

        {/* Navigation Progress */}
        <div className="space-y-2">
          <div className="w-full max-w-md h-2 bg-gray-200 rounded-full mx-auto">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / vocabList.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            Word {currentIndex + 1} of {vocabList.length}
          </p>
        </div>

        {/* Flashcard */}
        {vocabList.length > 0 && (
          <div className="bg-white rounded-xl shadow-xl px-8 py-10 max-w-md mx-auto space-y-4 relative">
            {/* Mastered indicator */}
            {vocabList[currentIndex].mastered && (
              <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Mastered
              </div>
            )}
            
            <h2 className="text-2xl font-semibold text-blue-600">{vocabList[currentIndex].word}</h2>

            {revealed ? (
              <p className="text-lg text-gray-800 min-h-[80px] flex items-center justify-center">
                <span>
                  <strong>Definition:</strong> {vocabList[currentIndex].definition}
                </span>
              </p>
            ) : (
              <div className="min-h-[80px] flex items-center justify-center">
                <button
                  onClick={() => setRevealed(true)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Reveal Definition
                </button>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={goToPreviousWord}
                disabled={currentIndex === 0}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  currentIndex === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <button
                onClick={markAsMastered}
                className={`px-4 py-2 rounded-lg ${
                  vocabList[currentIndex].mastered
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {vocabList[currentIndex].mastered ? '✓ Mastered' : 'Mark as Mastered'}
              </button>
              
              <button
                onClick={goToNextWord}
                disabled={currentIndex === vocabList.length - 1}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  currentIndex === vocabList.length - 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* All Words Overview */}
        <div className="bg-white/90 rounded-xl p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-3">All Words</h3>
          <div className="grid grid-cols-5 gap-2">
            {vocabList.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setRevealed(false);
                }}
                className={`w-full py-1 rounded-md text-sm ${
                  index === currentIndex
                    ? 'bg-blue-600 text-white'
                    : item.mastered
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </GlassBackground>
  );
};

export default Vocabulary;