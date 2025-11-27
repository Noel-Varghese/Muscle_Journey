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

  // Helper for consistent link styling
  const linkClass = "text-gray-300 hover:text-teal-400 font-medium transition-colors text-sm uppercase tracking-wide";

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* LOGO */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform duration-300">💪</span>
            <span className="text-2xl font-black text-white tracking-tighter group-hover:text-teal-400 transition-colors">
              Health<span className="text-teal-500 group-hover:text-teal-300">Journ</span>
            </span>
          </Link>

          {/* NAVIGATION LINKS */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/dashboard" className={linkClass}>Home</Link>
            <Link to="/feed" className={linkClass}>Feed</Link>
            <Link to="/friends" className={linkClass}>Friends</Link>
            <Link to="/log-workout" className={linkClass}>Log</Link>
            <Link to="/my-workouts" className={linkClass}>My Workouts</Link>
            <Link to="/profile" className={linkClass}>Profile</Link>
          </div>

          {/* USER SECTION */}
          <div className="flex items-center gap-4">

            {user && (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-700/50">

                {/* USER TEXT */}
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-white leading-none">
                    {user.username}
                  </p>
                  <p className="text-[10px] text-teal-500 font-bold uppercase tracking-widest mt-1">
                    Level 5
                  </p>
                </div>

                {/* AVATAR */}
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-500 shadow-teal-500/20 shadow-lg">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white font-bold text-sm">
                      {user.username ? user.username[0].toUpperCase() : "U"}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-400 transition-colors text-2xl p-2 hover:bg-red-500/10 rounded-full active:scale-95"
              title="Logout"
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