// Sidebar.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllSessions } from "../api";

export default function Sidebar() {
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllSessions()
        .then((data) => {
            setSessions(data);
        })
        .catch((error) => console.error("Error fetching sessions:", error));
    }, []);

    const handleSelectSession = (session) => {
        navigate(`/chat/${session.session_id}`);
    };

    return (
        <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 text-base-content p-4 w-80 min-h-full">
                <h2 className="text-xl mb-4 font-bold">
                    Conversation Logs
                </h2>
                {sessions.length === 0 ? (
                <p>
                    <span>No History</span>
                </p>
                ) : (
                sessions.map((session) => (
                    <li key={session.session_id}>
                    <button
                        onClick={() => handleSelectSession(session)}
                        className="w-full text-left"
                    >
                        <div>
                            <span className="font-bold">{session.session_topic}</span>
                        </div>
                        <div className="text-sm">
                            {new Date(session.start_time).toLocaleString()}
                        </div>
                    </button>
                    </li>
                ))
                )}
            </ul>
        </div>
    );
}






