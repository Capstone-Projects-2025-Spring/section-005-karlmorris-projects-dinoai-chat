import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "./Button";
import { checkAuthWithBackend } from "../utils/auth"; // Adjust path if needed

export default function AuthButtons() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            const valid = await checkAuthWithBackend();
            setIsLoggedIn(valid);
        };
        verify();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <div className="flex gap-x-2">
            <NavLink to="/upgrade">
                <Button variant="primary">Upgrade</Button>
            </NavLink>

            {isLoggedIn ? (
                <Button variant="secondary" onClick={handleLogout}>
                    Log out
                </Button>
            ) : (
                <NavLink to="/login">
                    <Button variant="secondary">Log in</Button>
                </NavLink>
            )}
        </div>
    );
}
