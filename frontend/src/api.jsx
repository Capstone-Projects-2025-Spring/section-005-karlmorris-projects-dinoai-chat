const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const fetchChatSession = async (sessionId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const resp = await fetch(
    `${API_BASE_URL}/api/sessions/${sessionId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!resp.ok) throw new Error(`Fetch session failed: ${resp.status}`);
  return resp.json();
};

export const fetchAllSessions = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user.userId) throw new Error("No user");

  const resp = await fetch(
    `${API_BASE_URL}/api/sessions/user/${user.userId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!resp.ok) throw new Error(`Fetch sessions failed: ${resp.status}`);
  return resp.json();
};


export const startSession = async (userId, language, topic) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${API_BASE_URL}/api/sessions/start?userId=${userId}&languageUsed=${language}&sessionTopic=${topic}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error(`Failed to start session: ${response.status}`);

  return response.json();
};

export const saveMessage = async (token, sessionId, content, senderType) => {
  const response = await fetch(`${API_BASE_URL}/api/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
     },
    body: JSON.stringify({
      chatSession: { sessionId },
      content,
      timestamp: new Date().toISOString(),
      senderType: senderType.toLowerCase(), // user / bot
    }),
  });

  if (!response.ok) throw new Error("Failed to save message");

  console.log("Sending message payload:", {
    chatSession: { sessionId },
    content,
    timestamp: new Date().toISOString(),
    senderType: senderType.toLowerCase(),
  });

  return response.json();
};

export const sendPrompt = async ({ messages, language, sessionId, userId, topic }) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/prompts/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      sessionId: sessionId || null,
      userId,
      languageUsed: language,
      sessionTopic: topic || "General",
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`Prompt failed! Status: ${response.status}`);
  }
  return response.json();
};

export const endSession = async (sessionId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const resp = await fetch(
    `${API_BASE_URL}/api/sessions/end/${sessionId}`,
    { method: "POST", headers: { Authorization: `Bearer ${token}` } }
  );
  if (!resp.ok) throw new Error(`End session failed: ${resp.status}`);
  return resp.json();
};

// new: addFeedback
export const addFeedback = async (sessionId, feedback) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const resp = await fetch(
    `${API_BASE_URL}/api/sessions/feedback/${sessionId}?feedback=${encodeURIComponent(feedback)}`,
    { method: "POST", headers: { Authorization: `Bearer ${token}` } }
  );
  if (!resp.ok) throw new Error(`Add feedback failed: ${resp.status}`);
  return resp.json();
};
