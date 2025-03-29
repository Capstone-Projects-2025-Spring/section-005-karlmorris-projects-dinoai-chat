import React, { useState, useEffect } from "react";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editing toggle for email only (username is static)
  const [isEditingEmail, setIsEditingEmail] = useState(false);

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
      if (!token) {
        throw new Error("No auth token found. Please log in.");
      }

      const response = await fetch("http://localhost:8080/auth/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to update email");
      }

      setIsEditingEmail(false);
      console.log("Email updated successfully in the database!");
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Profile Card */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-xl font-bold mb-4">Profile</h1>

        {/* Username Row (Static) */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-4">
            {/* User Icon */}
            <svg
              className="w-6 h-6 text-gray-400"
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
              <h2 className="text-sm font-semibold text-gray-500 uppercase">
                Username
              </h2>
              <p className="text-base text-gray-700">{username}</p>
            </div>
          </div>
          {/* No pencil/edit button here */}
        </div>

        {/* Email Row (Editable) */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-4">
            {/* Envelope Icon */}
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-16 11h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase">
                Email
              </h2>
              {isEditingEmail ? (
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-base text-gray-700 border border-gray-300 rounded p-1"
                />
              ) : (
                <p className="text-base text-gray-700">{email}</p>
              )}
            </div>
          </div>
          {isEditingEmail ? (
            <button
              className="text-gray-400 hover:text-blue-500"
              onClick={handleSaveEmail}
            >
              <span className="text-sm font-medium">Save</span>
            </button>
          ) : (
            <button
              className="text-gray-400 hover:text-blue-500"
              onClick={() => setIsEditingEmail(true)}
            >
              <svg
                className="w-5 h-5"
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
  );
}
