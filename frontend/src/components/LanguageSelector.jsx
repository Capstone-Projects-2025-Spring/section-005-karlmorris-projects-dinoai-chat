import { useState } from "react";

export default function LanguageSelector({ onLanguageChange }) {
    const [selectedLanguage, setSelectedLanguage] = useState("English");

    const languageList = [
      { code: "ar", language: "Arabic", flag: "🇦🇪" },
      { code: "bn", language: "Bengali", flag: "🇧🇩" },
      { code: "bg", language: "Bulgarian", flag: "🇧🇬" },
      { code: "zh", language: "Chinese (Simplified & Traditional)", flag: "🇨🇳" },
      { code: "hr", language: "Croatian", flag: "🇭🇷" },
      { code: "cs", language: "Czech", flag: "🇨🇿" },
      { code: "da", language: "Danish", flag: "🇩🇰" },
      { code: "nl", language: "Dutch", flag: "🇳🇱" },
      { code: "en", language: "English", flag: "🇬🇧" },
      { code: "et", language: "Estonian", flag: "🇪🇪" },
      { code: "fi", language: "Finnish", flag: "🇫🇮" },
      { code: "fr", language: "French", flag: "🇫🇷" },
      { code: "de", language: "German", flag: "🇩🇪" },
      { code: "el", language: "Greek", flag: "🇬🇷" },
      { code: "gu", language: "Gujarati", flag: "🇮🇳" },
      { code: "he", language: "Hebrew", flag: "🇮🇱" },
      { code: "hi", language: "Hindi", flag: "🇮🇳" },
      { code: "hu", language: "Hungarian", flag: "🇭🇺" },
      { code: "id", language: "Indonesian", flag: "🇮🇩" },
      { code: "it", language: "Italian", flag: "🇮🇹" },
      { code: "ja", language: "Japanese", flag: "🇯🇵" },
      { code: "kn", language: "Kannada", flag: "🇮🇳" },
      { code: "ko", language: "Korean", flag: "🇰🇷" },
      { code: "lv", language: "Latvian", flag: "🇱🇻" },
      { code: "lt", language: "Lithuanian", flag: "🇱🇹" },
      { code: "ms", language: "Malay", flag: "🇲🇾" },
      { code: "ml", language: "Malayalam", flag: "🇮🇳" },
      { code: "mr", language: "Marathi", flag: "🇮🇳" },
      { code: "no", language: "Norwegian", flag: "🇳🇴" },
      { code: "pl", language: "Polish", flag: "🇵🇱" },
      { code: "pt", language: "Portuguese", flag: "🇵🇹" },
      { code: "ro", language: "Romanian", flag: "🇷🇴" },
      { code: "ru", language: "Russian", flag: "🇷🇺" },
      { code: "sr", language: "Serbian", flag: "🇷🇸" },
      { code: "sk", language: "Slovak", flag: "🇸🇰" },
      { code: "sl", language: "Slovenian", flag: "🇸🇮" },
      { code: "es", language: "Spanish", flag: "🇪🇸" },
      { code: "sw", language: "Swahili", flag: "🇰🇪" },
      { code: "sv", language: "Swedish", flag: "🇸🇪" },
      { code: "ta", language: "Tamil", flag: "🇮🇳" },
      { code: "te", language: "Telugu", flag: "🇮🇳" },
      { code: "th", language: "Thai", flag: "🇹🇭" },
      { code: "tr", language: "Turkish", flag: "🇹🇷" },
      { code: "uk", language: "Ukrainian", flag: "🇺🇦" },
      { code: "ur", language: "Urdu", flag: "🇵🇰" },
      { code: "vi", language: "Vietnamese", flag: "🇻🇳" },
    ];

    const handleLanguageSelect = (e) => {
        const newLanguage = e.target.value;
        setSelectedLanguage(newLanguage);
        onLanguageChange(newLanguage);
    };

    return (
        <div className="mt-2 flex items-center space-x-2 border rounded-lg px-4 py-2 bg-white w-full max-w-[250px] md:max-w-[300px] lg:max-w-[350px]">
            <span className="text-lg md:text-xl" aria-label={`Flag for ${selectedLanguage}`} role="img">
                {languageList.find((lang) => lang.language === selectedLanguage)?.flag || "🌍"}
            </span>

            <select
                className="bg-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 w-[125px] md:w-[150px] lg:w-[175px] truncate"
                value={selectedLanguage}
                onChange={handleLanguageSelect}
                aria-label="Select language"
            >
                {languageList.map((lang) => (
                    <option key={lang.code} value={lang.language} className="truncate">
                        {lang.language}
                    </option>
                ))}
            </select>
        </div>
    );
}
