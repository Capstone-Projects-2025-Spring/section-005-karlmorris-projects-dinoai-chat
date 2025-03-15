import { NavLink } from "react-router-dom";
import Logo from "../assets/DinoAI.png";
import AuthButtons from '../components/AuthButtons';
import NavBar from '../components/NavBar';

export default function Header() {
    return (
        <header className="w-full flex items-center p-4 bg-white border-b border-gray-300">

            <div className="flex-shrink-0">
                <NavLink 
                className="flex items-center space-x-2" 
                key='home'
                to='/'>
                    <img src={Logo} alt="DinoAI Logo" className="w-10 h-10" />
                    <span className="font-bold text-lg">DinoAI</span>
                </NavLink>
            </div>

            <div className="flex flex-1 justify-end pr-4">
                <NavBar />
            </div>

            <div className="flex-shrink-0">
                <AuthButtons />
            </div>
        </header>
    )
}