import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

// Import both background images
import bgRegisterDark from "../assets/bg-register-dark.png";
import bgRegisterLight from "../assets/bg-register-light.png";

const RegisterForm = () => {
  const { register } = useContext(AuthContext);
  const nav = useNavigate();

  const [darkMode, setDarkMode] = useState(true);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    height: "",
    weight: "",
    age: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
  try {
    await register(form);
    nav("/");
  } catch (err) {
    alert("Registration failed");
  }
  };

  const inputClass = "p-3 rounded-full bg-white/80 backdrop-blur-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white transition-all shadow-inner";

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex items-center justify-end pr-24 transition-all duration-500"
      style={{
        backgroundImage: `url(${darkMode ? bgRegisterDark : bgRegisterLight})`,
      }}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 right-6 bg-white/30 backdrop-blur-md rounded-full p-3 text-xl shadow-lg hover:bg-white/50 transition hover:scale-110 active:scale-95 z-10 border border-white/20"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      {/* Glass Register Box */}
      <div className="w-[500px] bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-right-10 duration-500">
        <h2 className="text-3xl font-black text-center text-white tracking-wide drop-shadow-lg">
          CREATE ACCOUNT
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            className={inputClass}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className={inputClass}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className={inputClass}
            onChange={handleChange}
            required
          />

          {/* Grid Layout */}
          <div className="grid grid-cols-2 gap-4">
            <select
              name="gender"
              className={`${inputClass} appearance-none cursor-pointer`}
              onChange={handleChange}
              required
              defaultValue=""
            >
              <option value="" disabled>Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <input
              name="age"
              type="number"
              placeholder="Age"
              className={inputClass}
              onChange={handleChange}
              required
            />

            <input
              name="height"
              type="number"
              placeholder="Height (cm)"
              className={inputClass}
              onChange={handleChange}
              required
            />

            <input
              name="weight"
              type="number"
              placeholder="Weight (kg)"
              className={inputClass}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white py-3.5 rounded-full font-bold transition-all shadow-lg shadow-teal-900/50 active:scale-95 mt-2 tracking-wide"
          >
            SIGN UP
          </button>
        </form>

        <div className="text-center text-sm text-white/90 font-medium">
          <Link to="/" className="hover:text-teal-300 transition-colors">
            Already have an account? <span className="underline decoration-teal-400">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;