import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllSessions } from "../api";

export default function Sidebar() {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllSessions()
      .then(setSessions)
      .catch((error) => console.error("Error fetching sessions:", error));
  }, []);

  const handleSelectSession = (session) => {
    // Use the correct property name (sessionId, not session_id)
    navigate(`/chat/${session.sessionId}`);
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
            <li key={session.sessionId}>
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
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
