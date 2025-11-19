import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/dashboard" className="text-2xl font-bold text-teal-600 tracking-tighter">
            HealthJourn
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/dashboard" className="text-gray-600 hover:text-teal-600 font-medium transition">
              Feed
            </Link>
            <Link to="/friends" className="text-gray-600 hover:text-teal-600 font-medium transition">
              Friends
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-teal-600 font-medium transition">
              Profile
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-sm">
                  {user.username ? user.username[0].toUpperCase() : "U"}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user.username}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-600 font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;