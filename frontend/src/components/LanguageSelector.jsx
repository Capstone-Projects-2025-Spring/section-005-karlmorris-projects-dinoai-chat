import { useState } from "react";

export default function LanguageSelector({}) {
    const [selectedLanguage, setSelectedLanguage] = useState("English");

    const languageList = [
        { language: "English", flag: "\uD83C\uDDEC\uD83C\uDDE7" },
        { language: "Spanish", flag: "\uD83C\uDDEA\uD83C\uDDF8" },
        { language: "French", flag: "\uD83C\uDDEB\uD83C\uDDF7" },
        { language: "German", flag: "\uD83C\uDDE9\uD83C\uDDEA" },
        { language: "Italian", flag: "\uD83C\uDDEE\uD83C\uDDF9" },
        { language: "Chinese", flag: "\uD83C\uDDE8\uD83C\uDDF3" },
        { language: "Japanese", flag: "\uD83C\uDDEF\uD83C\uDDF5" },
        { language: "TEST LANGUAGE FOR NOW 114514 250", flag: ""},
    ];

    return (
        <div className="mt-2 flex items-center space-x-2 border rounded-lg px-4 py-2 bg-gray-100 w-full max-w-[250px] md:max-w-[300px] lg:max-w-[350px]">
            <span className="text-lg md:text-xl">
                {languageList.find((lang) => lang.language === selectedLanguage)?.flag || "🌍"}
            </span>
            
            <select
                className="bg-transparent text-gray-700 focus:outline-none flex-1 w-[125px] md:w-[150px] lg:w-[175px] truncate"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
            >
                {languageList.map((lang) => (
                    <option key={lang.language} value={lang.language} className="truncate">
                        {lang.language}
                    </option>
                ))}
            </select>
        </div>
    );
}