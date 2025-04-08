import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "./Button";
import { checkAuthWithBackend } from "../utils/auth";

export default function AuthButtons() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const verify = async () => {
            const valid = await checkAuthWithBackend();
            setIsLoggedIn(valid);
        };
        verify();
    }, []);

    return (
        <div className="flex gap-x-2">
            <NavLink to="/upgrade">
                <Button variant="primary">
                    Upgrade
                </Button>
            </NavLink>

            {!isLoggedIn && (
                <NavLink to="/login">
                    <Button variant="secondary">
                        Log in
                    </Button>
                </NavLink>
            )}
        </div>
    );
}
