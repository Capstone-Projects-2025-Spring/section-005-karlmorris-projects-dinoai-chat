import { NavLink } from "react-router-dom";

export default function AuthButtons() {
    return (
        <div className="flex gap-x-2">
            <NavLink to="/upgrade">
                <button className="px-2 md:px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                    Upgrade
                </button>
            </NavLink>

            <NavLink to="/login">
                <button className="px-2 md:px-4 py-2 bg-gray-200 text-black font-medium rounded-lg hover:bg-gray-300 transition">
                    Log in
                </button>
            </NavLink>
        </div>
    )
}