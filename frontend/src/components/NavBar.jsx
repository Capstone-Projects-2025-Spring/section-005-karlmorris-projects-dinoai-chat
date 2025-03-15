import { NavLink } from "react-router-dom";

export default function NavBar() {

    const navList = [
        { title: 'Home', href: '/'},
        { title: 'Quizzes', href: '/quizzes' },
        { title: 'Practice', href: '/practice' },
        { title: 'Vocabulary', href: '/vocabulary' },
    ];

    return (
        <nav className="hidden md:flex items-center space-x-4">
            {navList.map((link) => (
                <NavLink
                    key={link.title}
                    to={link.href}
                    className={({ isActive }) =>
                        `font-medium transition-colors duration-300 ease-in-out ${
                            isActive ? "text-black font-bold" : "text-gray-500 hover:text-black"
                        }`
                    }
                >
                    {link.title}
                </NavLink>
            ))}
        </nav>
    )

}