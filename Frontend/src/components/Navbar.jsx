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
    <nav className="bg-gray-900/90 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* LOGO */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <span className="text-3xl">💪</span>
            <span className="text-2xl font-black text-white tracking-tighter group-hover:text-teal-400 transition">
              Health<span className="text-teal-500">Journ</span>
            </span>
          </Link>

          {/* NAVIGATION LINKS */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/dashboard" className="nav-link">Home</Link>
            <Link to="/feed" className="nav-link">Feed</Link>
            <Link to="/friends" className="nav-link">Friends</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </div>

          {/* USER SECTION */}
          <div className="flex items-center gap-4">

            {user && (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-800">

                {/* USER TEXT */}
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-white leading-none">
                    {user.username}
                  </p>
                  <p className="text-xs text-teal-500 font-semibold uppercase tracking-wider">
                    Level 5
                  </p>
                </div>

                {/* AVATAR - FIXED */}
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-500">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white font-bold text-sm">
                      {user.username ? user.username[0].toUpperCase() : "U"}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-500 transition text-xl"
            >
              ⎋
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
