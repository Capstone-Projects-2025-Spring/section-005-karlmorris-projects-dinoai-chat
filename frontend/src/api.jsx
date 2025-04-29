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
  console.log("Attempting to fetch sessions...");
  const token = localStorage.getItem("token");
  if (!token) {
      console.error("fetchAllSessions: No token found in localStorage.");
      throw new Error("Not authenticated");
  }
  console.log("fetchAllSessions: Token found.");

  let user;
  try {
      const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`/auth/me response status: ${userResponse.status}`); // Log status
      if (!userResponse.ok) {
          throw new Error(`Fetch user failed: ${userResponse.status}`);
      }
      user = await userResponse.json();
      console.log("User data fetched from /auth/me:", user);
      if (!user || !user.userId) { // Check user and userId
          console.error("fetchAllSessions: No user ID received from /auth/me.");
          throw new Error("No user ID");
      }
  } catch (error) {
      console.error("Error fetching user data in fetchAllSessions:", error);
      throw error; // Re-throw the error
  }

  // Ensure user object and userId are valid before proceeding
  if (!user || !user.userId) {
       console.error("Cannot fetch sessions because user data is invalid after /auth/me call.");
       throw new Error("Invalid user data");
  }

  const sessionUrl = `${API_BASE_URL}/api/sessions/user/${user.userId}`;
  console.log(`Fetching sessions from URL: ${sessionUrl}`); // Log exact URL

  try {
      const resp = await fetch(sessionUrl, {
          headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`/api/sessions/user/${user.userId} response status: ${resp.status}`); // Log status
      if (!resp.ok) {
          // Log more details on failure
          console.error(`Fetch sessions failed for URL: ${sessionUrl} with status ${resp.status}`);
          throw new Error(`Fetch sessions failed: ${resp.status}`);
      }
      console.log("Successfully fetched sessions.");
      return resp.json();
  } catch (error) {
      console.error("Error fetching session data in fetchAllSessions:", error);
      throw error; // Re-throw the error
  }
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

export const deleteSession = async (sessionId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error(`Failed to delete session: ${response.status}`);
  return response; // No content expected (204)
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
