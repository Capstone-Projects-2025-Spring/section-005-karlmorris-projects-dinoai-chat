import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlassBackground from "../components/GlassBackground";

export default function Profile() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [password, setPassword] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("en");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingLanguage, setIsEditingLanguage] = useState(false);

  const navigate = useNavigate();

  const languages = [
    { code: "ar", name: "Arabic" },
    { code: "bn", name: "Bengali" },
    { code: "bg", name: "Bulgarian" },
    { code: "zh", name: "Chinese (Simplified & Traditional)" },
    { code: "hr", name: "Croatian" },
    { code: "cs", name: "Czech" },
    { code: "da", name: "Danish" },
    { code: "nl", name: "Dutch" },
    { code: "en", name: "English" },
    { code: "et", name: "Estonian" },
    { code: "fi", name: "Finnish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "el", name: "Greek" },
    { code: "gu", name: "Gujarati" },
    { code: "he", name: "Hebrew" },
    { code: "hi", name: "Hindi" },
    { code: "hu", name: "Hungarian" },
    { code: "id", name: "Indonesian" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "kn", name: "Kannada" },
    { code: "ko", name: "Korean" },
    { code: "lv", name: "Latvian" },
    { code: "lt", name: "Lithuanian" },
    { code: "ms", name: "Malay" },
    { code: "ml", name: "Malayalam" },
    { code: "mr", name: "Marathi" },
    { code: "no", name: "Norwegian" },
    { code: "pl", name: "Polish" },
    { code: "pt", name: "Portuguese" },
    { code: "ro", name: "Romanian" },
    { code: "ru", name: "Russian" },
    { code: "sr", name: "Serbian" },
    { code: "sk", name: "Slovak" },
    { code: "sl", name: "Slovenian" },
    { code: "es", name: "Spanish" },
    { code: "sw", name: "Swahili" },
    { code: "sv", name: "Swedish" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "th", name: "Thai" },
    { code: "tr", name: "Turkish" },
    { code: "uk", name: "Ukrainian" },
    { code: "ur", name: "Urdu" },
    { code: "vi", name: "Vietnamese" },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found. Please log in.");

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user profile");

        const data = await response.json();
        setEmail(data.email || "[No email found]");
        setUsername(data.username || "[No username found]");
        setCreatedAt(data.createdAt || "Unknown");
        setNativeLanguage(data.nativeLanguage || "en");
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [API_BASE_URL]);

  const updateField = async (field, value, callback) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found. Please log in.");

      const response = await fetch(`${API_BASE_URL}/auth/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) throw new Error(`Failed to update ${field}`);
      if (callback) callback(false);
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your account?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found. Please log in.");

      const response = await fetch(`${API_BASE_URL}/auth/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete account");

      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <GlassBackground>
      <div className="mx-auto pt-10 w-full max-w-5xl space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Info */}
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
            <p className="text-xl font-bold text-gray-800">{username}</p>
            <p className="text-sm text-gray-600 uppercase tracking-wide">Username</p>
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide">Account Created</p>
              <p className="text-xl text-gray-800">{new Date(createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>

            {/* Email */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="w-full">
                {isEditingEmail ? (
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-1 text-xl text-gray-800 border border-gray-300 rounded p-2"
                  />
                ) : (
                  <p className="text-xl text-gray-800">{email}</p>
                )}
                <p className="text-sm text-gray-600 uppercase tracking-wide">Email</p>
              </div>
              <button
                className="text-blue-500 hover:text-blue-600 font-semibold"
                onClick={() =>
                  isEditingEmail ? updateField("email", email, setIsEditingEmail) : setIsEditingEmail(true)
                }
              >
                {isEditingEmail ? "Save" : "Edit"}
              </button>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="w-full">
                {isEditingPassword ? (
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 text-xl text-gray-800 border border-gray-300 rounded p-2"
                  />
                ) : (
                  <p className="text-xl text-gray-800">********</p>
                )}
                <p className="text-sm text-gray-600 uppercase tracking-wide">Password</p>
              </div>
              <button
                className="text-blue-500 hover:text-blue-600 font-semibold"
                onClick={() =>
                  isEditingPassword
                    ? updateField("password", password, setIsEditingPassword)
                    : setIsEditingPassword(true)
                }
              >
                {isEditingPassword ? "Save" : "Edit"}
              </button>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between">
              <div className="w-full">
                {isEditingLanguage ? (
                  <select
                    value={nativeLanguage}
                    onChange={(e) => setNativeLanguage(e.target.value)}
                    className="w-full mt-1 text-xl text-gray-800 border border-gray-300 rounded p-2"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xl text-gray-800">
                    {languages.find((lang) => lang.code === nativeLanguage)?.name || nativeLanguage}
                  </p>
                )}
                <p className="text-sm text-gray-600 uppercase tracking-wide">Native Language</p>
              </div>
              <button
                className="text-blue-500 hover:text-blue-600 font-semibold"
                onClick={() =>
                  isEditingLanguage
                    ? updateField("nativeLanguage", nativeLanguage, setIsEditingLanguage)
                    : setIsEditingLanguage(true)
                }
              >
                {isEditingLanguage ? "Save" : "Edit"}
              </button>
            </div>
          </div>
        </div>

        {/* Subtle Delete Option */}
        <div className="flex justify-end">
          <button
            className="mt-2 text-sm text-gray-500 hover:text-gray-700 hover:underline"
            onClick={handleDeleteAccount}
          >
            Request Account Deletion
          </button>
        </div>
      </div>
    </GlassBackground>
  );
}