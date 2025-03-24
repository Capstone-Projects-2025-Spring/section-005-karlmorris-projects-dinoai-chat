import React, { useState, useEffect } from 'react';

export default function Profile() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No auth token found. Please log in.');
        }

        // Adjust if your backend is on a different host/port
        const response = await fetch('http://localhost:8080/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        // Only extracting the email
        setEmail(data.email || '');
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, []);

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

        {/* Email Row */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-4">
            {/* Email Icon */}
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
                d="M16 12H8m8 0V8m0 4l-4 4m0-4l4-4m-4 4H8m0 0v4m0-4l-4-4m4 4l4 4"
              />
            </svg>
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase">
                Email
              </h2>
              <p className="text-base text-gray-700">{email}</p>
            </div>
          </div>

          {/* Pencil (Edit) Icon - placeholder */}
          <button className="text-gray-400 hover:text-blue-500">
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
        </div>
      </div>
    </div>
  );
}
