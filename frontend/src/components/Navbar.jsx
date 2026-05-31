import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Fake News", path: "/fakenews" },
    { name: "Deep Fake", path: "/deepfake" },
  ];

  return (
    <nav className="fixed w-full z-20 backdrop-blur-md bg-gray-900/70 border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Project F2
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative font-medium transition-colors duration-300 ${
                  location.pathname === link.path
                    ? "text-indigo-400"
                    : "text-gray-300 hover:text-indigo-400"
                }`}
              >
                {link.name}
                {/* Active underline */}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-400 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-indigo-400 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden bg-gray-900/90 backdrop-blur-md border-t border-gray-800 transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-4 px-6 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`font-medium transition-colors duration-300 ${
                location.pathname === link.path
                  ? "text-indigo-400"
                  : "text-gray-300 hover:text-indigo-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
