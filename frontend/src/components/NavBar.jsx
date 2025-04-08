import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { checkAuthWithBackend } from "../utils/auth"; // ✅ update path as needed

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const valid = await checkAuthWithBackend();
      setIsLoggedIn(valid);
    };
    verify();
  }, []);

  const navList = [
    { title: "Home", href: "/" },
    { title: "Quizzes", href: "/quizzes" },
    { title: "Vocabulary", href: "/vocabulary" },
  ];

  if (isLoggedIn) {
    navList.push({ title: "Profile", href: "/profile" });
  }

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden lg:flex items-center space-x-4">
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

      {/* Mobile Dropdown */}
      <div className="lg:hidden dropdown">
        <label className="btn btn-ghost btn-sm swap swap-rotate">
          <input type="checkbox" onChange={() => setIsOpen(!isOpen)} checked={isOpen} />
          <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 512 512">
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>
          <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 512 512">
            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
          </svg>
        </label>

        {isOpen && (
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box shadow-lg border-1 border-gray-300 w-48 p-2 mt-2"
          >
            {navList.map((link) => (
              <li key={link.title}>
                <NavLink
                  to={link.href}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                  onClick={() => setIsOpen(false)}
                >
                  {link.title}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
