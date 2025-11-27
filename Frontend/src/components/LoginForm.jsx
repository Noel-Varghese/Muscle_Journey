import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

import videoLight from "../assets/video-light.mp4"; 
import videoDark from "../assets/video-dark.mp4";

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      nav("/dashboard");
    } catch (err) {
      alert("Invalid login");
    }
  };

  const inputClass = "p-3 rounded-full bg-white/80 backdrop-blur-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white transition-all shadow-inner";

  return (
    <div
      className="relative h-screen w-screen flex items-center justify-end pr-24 transition-all duration-500 overflow-hidden"
    >
      {/* Background Video Element */}
      <video
        key={darkMode ? "dark" : "light"} 
        src={darkMode ? videoDark : videoLight}
        autoPlay
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      />

      {/* Theme Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 right-6 bg-white/30 backdrop-blur-md rounded-full p-3 text-xl shadow-lg hover:bg-white/50 transition hover:scale-110 active:scale-95 border border-white/20"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      {/* Glass Login Box */}
      <div className="w-[400px] bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-right-10 duration-500">
        <h2 className="text-3xl font-black text-center text-white tracking-wide drop-shadow-lg">
          LOGIN
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            className={inputClass}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className={inputClass}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white py-3.5 rounded-full font-bold transition-all shadow-lg shadow-teal-900/50 active:scale-95 mt-2 tracking-wide"
          >
            LOGIN
          </button>
        </form>

        <div className="text-center text-sm text-white/90 font-medium space-y-2">
          <button className="hover:text-teal-300 transition-colors">
            Forgot Password?
          </button>
          <Link to="/register" className="block hover:text-teal-300 transition-colors">
            New here? <span className="underline decoration-teal-400">Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;