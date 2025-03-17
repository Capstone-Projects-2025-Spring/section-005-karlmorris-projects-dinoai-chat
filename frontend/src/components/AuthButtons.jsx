import { NavLink } from "react-router-dom";
import Button from "./Button";

export default function AuthButtons() {
    return (
        <div className="flex gap-x-2">
            <NavLink to="/upgrade">
                <Button variant="primary">
                    Upgrade
                </Button>
            </NavLink>

            <NavLink to="/login">
                <Button variant="secondary">
                    Log in
                </Button>
            </NavLink>
        </div>
    )
}
