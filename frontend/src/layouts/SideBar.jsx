import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteSession, fetchAllSessions } from "../api";

export default function Sidebar() {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllSessions()
      .then((fetchedSessions) => {
        const sorted = fetchedSessions.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        setSessions(sorted);
      })
      .catch((error) => console.error("Error fetching sessions:", error));
  }, []);

  const handleSelectSession = (session) => {
    navigate(`/chat/${session.sessionId}`);
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await deleteSession(sessionId);
      setSessions(sessions.filter((session) => session.sessionId !== sessionId));
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Failed to delete session. Please try again.");
    }
  };

  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer" className="drawer-overlay"></label>
      <ul className="menu bg-base-200 text-base-content p-4 w-80 min-h-full">
        <h2 className="text-xl mb-4 font-bold">Conversation Logs</h2>
        {sessions.length === 0 ? (
          <p>No History</p>
        ) : (
          sessions.map((session) => (
            <li key={session.sessionId} className="group relative">
              <button
                className="w-full text-left"
                onClick={() => handleSelectSession(session)}
              >
                <div>
                  <span className="font-bold">{session.sessionTopic}</span>
                </div>
                <div className="text-sm">
                  {new Date(session.startTime).toLocaleString()}
                </div>
              </button>
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 text-error hover:text-error-content"
                onClick={() => handleDeleteSession(session.sessionId)}
                title="Delete conversation"
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}