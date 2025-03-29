import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlassBackground from "../components/GlassBackground";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [createdAt, setCreatedAt] = useState(""); // For account creation date
  const [password, setPassword] = useState(""); // For password update
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editing toggles for email and password
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No auth token found. Please log in.");
        }
        const response = await fetch("http://localhost:8080/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const data = await response.json();
        console.log("👉 /auth/me response:", data);
        setEmail(data.email || "[No email found]");
        setUsername(data.username || "[No username found]");
        setCreatedAt(data.createdAt || "Unknown");
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSaveEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found. Please log in.");
      const response = await fetch("http://localhost:8080/auth/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Failed to update email");
      setIsEditingEmail(false);
      console.log("✅ Email updated successfully!");
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  const handleSavePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found. Please log in.");
      const response = await fetch("http://localhost:8080/auth/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) throw new Error("Failed to update password");
      setIsEditingPassword(false);
      console.log("✅ Password updated successfully!");
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found. Please log in.");
      const response = await fetch("http://localhost:8080/auth/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to delete account");
      console.log("✅ Account deleted successfully!");
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
          {/* Profile Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
            <div className="flex items-center space-x-4">
              <svg
                className="w-12 h-12 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <p className="text-xl font-bold text-gray-800">{username}</p>
                <p className="text-sm text-gray-600 uppercase tracking-wide">
                  Username
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide">
                Account Created
              </p>
              <p className="text-xl text-gray-800">
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Account Settings Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
            {/* Email Update */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4 w-full">
                <svg
                  className="w-8 h-8 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-16 11h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
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
                  <p className="text-sm text-gray-600 uppercase tracking-wide">
                    Email
                  </p>
                </div>
              </div>
              {isEditingEmail ? (
                <button
                  className="text-blue-500 hover:text-blue-600 font-semibold"
                  onClick={handleSaveEmail}
                >
                  Save
                </button>
              ) : (
                <button
                  className="text-blue-500 hover:text-blue-600"
                  onClick={() => setIsEditingEmail(true)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 4H4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-7"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Password Update */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4 w-full">
                <svg
                  className="w-8 h-8 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 11V7a5 5 0 0110 0v4"
                  />
                </svg>
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
                  <p className="text-sm text-gray-600 uppercase tracking-wide">
                    Password
                  </p>
                </div>
              </div>
              {isEditingPassword ? (
                <button
                  className="text-blue-500 hover:text-blue-600 font-semibold"
                  onClick={handleSavePassword}
                >
                  Save
                </button>
              ) : (
                <button
                  className="text-blue-500 hover:text-blue-600"
                  onClick={() => setIsEditingPassword(true)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 4H4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-7"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </div>
    </GlassBackground>
  );
}
