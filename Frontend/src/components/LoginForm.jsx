import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

// Make sure these files exist in your assets folder!
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

  return (
    <div
      className="relative h-screen w-screen flex items-center justify-end pr-24 transition-all duration-500 overflow-hidden"
    >
      {/* Background Video Element */}
      <video
        key={darkMode ? "dark" : "light"} 
        src={darkMode ? videoDark : videoLight}
        autoPlay
        // CHANGED: Removed the 'loop' attribute here
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      />

      {/* Theme Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 right-6 bg-white/40 backdrop-blur-md rounded-full p-3 text-xl shadow hover:bg-white/60 transition"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      {/* Glass Login Box */}
      <div className="w-[400px] bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-8 flex flex-col gap-6">
        <h2 className="text-3xl font-extrabold text-center text-white tracking-wide drop-shadow">
          LOGIN
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            className="p-3 rounded-full bg-white/90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="p-3 rounded-full bg-white/90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-full font-bold transition-all shadow-md active:scale-95"
          >
            LOGIN
          </button>
        </form>

        <div className="text-center text-sm text-white/90">
          <button className="hover:underline block mx-auto mb-2">
            Forgot Password?
          </button>
          <Link to="/register" className="hover:underline block">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;