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

          {/* NAV LINKS */}
          <div className="hidden md:flex space-x-8 items-center">
            {["Feed", "Friends", "Workouts", "Profile"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="text-gray-400 hover:text-teal-400 font-bold text-sm uppercase tracking-widest transition"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* USER INFO */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
                
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-white leading-none">
                    {user.username}
                  </p>
                  <p className="text-xs text-teal-500 font-semibold uppercase tracking-wider">
                    Level 5
                  </p>
                </div>

                {/* AVATAR */}
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

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-500 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
