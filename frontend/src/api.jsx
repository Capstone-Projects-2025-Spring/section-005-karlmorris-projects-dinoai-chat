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