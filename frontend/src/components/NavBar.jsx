import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { checkAuthWithBackend } from "../utils/auth";

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
    { title: "Vocabulary", href: "/vocabulary" },
  ];

  if (isLoggedIn) {
    navList.push({ title: "Profile", href: "/profile" });
  }

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden md:flex flex-wrap items-center space-x-4 px-4">
        {navList.map((link) => (
          <NavLink
            key={link.title}
            to={link.href}
            onClick={() => {
              if (link.href === "/") {
                window.location.href = "/";
              }
            }}
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

      {/* Mobile Nav Toggle Button */}
      <div className="md:hidden px-4">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="btn btn-ghost btn-sm"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 5h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <ul className="absolute right-4 top-16 z-50 bg-white border border-gray-300 shadow-md rounded-md w-48 py-2">
            {navList.map((link) => (
              <li key={link.title}>
                <NavLink
                  to={link.href}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    if (link.href === "/") {
                      window.location.href = "/";
                    }
                    setIsOpen(false); // close dropdown on click
                  }}
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

