//Attention!!!
//all frontend fetch logic need to be stored in this file

export const fetchChatSession = async (sessionId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:8080/api/messages/session/${sessionId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch chat session`);
  }

  return response.json();
};


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

const API_BASE_URL = "http://localhost:8080";

export const startSession = async (userId, language, topic) => {
  const response = await fetch(`${API_BASE_URL}/api/sessions/start?userId=${userId}&languageUsed=${language}&sessionTopic=${topic}`, {
    method: "POST"
  });

  if (!response.ok) throw new Error("Failed to start session");

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


