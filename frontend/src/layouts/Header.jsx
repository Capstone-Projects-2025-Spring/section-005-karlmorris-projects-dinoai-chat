import { NavLink } from "react-router-dom";
import Logo from "../assets/dinoAI.png";
import AuthButtons from '../components/AuthButtons';
import NavBar from '../components/NavBar';
import ToolTip from "../components/ToolTip";

export default function Header() {

    return (
        <header className="w-full flex items-center p-4 bg-transparent border-b border-gray-300">

            <div className="flex-shrink-0 flex">
                <ToolTip text="Open Conversation History" position="right">
                    <label htmlFor="my-drawer" className="drawer-button btn btn-ghost">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Z"
                            />
                        </svg>
                    </label>
                </ToolTip>
                <NavLink 
                className="flex items-center space-x-2 ml-1"
                key='home'
                to='/'>
                    <img src={Logo} alt="DinoAI Logo" className="w-10 h-10" />
                    <span className="font-bold text-lg">DinoAI</span>
                </NavLink>
            </div>

            <div className="flex flex-auto justify-end pr-4">
                <NavBar />
            </div>

            <div className="flex-shrink-0">
                <AuthButtons />
            </div>
        </header>
    )
}