//Attention!!!
//all frontend fetch logic need to be stored in this file

export const fetchChatSession = async (sessionId) => {
    const response = await fetch(`/data/session_${sessionId}.json`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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

export const sendPrompt = async (message, language) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/prompts/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      sessionId: 1, // You can update this later if dynamic
      userId: 1,    // Replace with actual user ID if needed
      languageUsed: language,
      messages: [
        {
          content: message,
          senderType: "USER",
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Prompt failed! Status: ${response.status}`);
  }

  return response.json();
};
