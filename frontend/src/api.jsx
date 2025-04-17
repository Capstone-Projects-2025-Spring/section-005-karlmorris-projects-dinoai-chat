const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Fetch all messages for a given chat session
export const fetchChatSession = async (sessionId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${API_BASE_URL}/api/messages/session/${sessionId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) throw new Error(`Failed to fetch chat session: ${response.status}`);
  return response.json();
};

// Example stub for listing sessions; you can replace with a real API call later
export const fetchAllSessions = async () => {
  const sessionIds = [1, 2];
  const sessions = await Promise.all(
    sessionIds.map(async (id) => {
      const response = await fetch(`/data/session_${id}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
  );
  return sessions;
};

// Start a new chat session
export const startSession = async (userId, language, topic) => {
  const response = await fetch(
    `${API_BASE_URL}/api/sessions/start?userId=${userId}&languageUsed=${encodeURIComponent(
      language
    )}&sessionTopic=${encodeURIComponent(topic)}`,
    { method: "POST" }
  );
  if (!response.ok) throw new Error(`Failed to start session: ${response.status}`);
  return response.json();
};

// Save a single message (user or bot) to the database
export const saveMessage = async (token, sessionId, content, senderType) => {
  const response = await fetch(`${API_BASE_URL}/api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      chatSession: { sessionId },
      content,
      timestamp: new Date().toISOString(),
      senderType: senderType.toLowerCase(), // "user" or "bot"
    }),
  });
  if (!response.ok) throw new Error(`Failed to save message: ${response.status}`);
  return response.json();
};

// Ask the AI to continue the conversation
export const sendPrompt = async ({ messages, language, sessionId, userId, topic }) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api/prompts/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ sessionId, userId, languageUsed: language, sessionTopic: topic || "General", messages }),
  });
  if (!response.ok) throw new Error(`Prompt failed! Status: ${response.status}`);
  return response.json();
};

// End an existing chat session
export const endSession = async (sessionId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/api/sessions/end/${sessionId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`End session failed: ${response.status}`);
  return response.json();
};

// Add feedback to a session
export const addFeedback = async (sessionId, feedback) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${API_BASE_URL}/api/sessions/feedback/${sessionId}?feedback=${encodeURIComponent(feedback)}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) throw new Error(`Add feedback failed: ${response.status}`);
  return response.json();
};