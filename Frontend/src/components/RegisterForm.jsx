import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

// Import both background images
import bgRegisterDark from "../assets/bg-register-dark.png";
import bgRegisterLight from "../assets/bg-register-light.png";

const RegisterForm = () => {
  const { register } = useContext(AuthContext);
  const nav = useNavigate();

  // Theme State (Default to Dark)
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

  return (
    <div
      // justify-end moves form to the right side
      className="h-screen w-screen bg-cover bg-center flex items-center justify-end pr-24 transition-all duration-500"
      style={{
        backgroundImage: `url(${darkMode ? bgRegisterDark : bgRegisterLight})`,
      }}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 right-6 bg-white/40 backdrop-blur-md rounded-full p-3 text-xl shadow hover:bg-white/60 transition z-10"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      {/* Glass Register Box */}
      <div className="w-[500px] bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-8 flex flex-col gap-6">
        <h2 className="text-3xl font-extrabold text-center text-white tracking-wide drop-shadow">
          CREATE ACCOUNT
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username */}
          <input
            name="username"
            type="text"
            placeholder="Username"
            className="p-3 rounded-full bg-white/90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            onChange={handleChange}
            required
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="p-3 rounded-full bg-white/90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            onChange={handleChange}
            required
          />

          {/* Password */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="p-3 rounded-full bg-white/90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            onChange={handleChange}
            required
          />

          {/* Grid Layout for shorter inputs */}
          <div className="grid grid-cols-2 gap-4">
            <select
              name="gender"
              className="p-3 rounded-full bg-white/90 text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
              onChange={handleChange}
              required
              defaultValue=""
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <input
              name="age"
              type="number"
              placeholder="Age"
              className="p-3 rounded-full bg-white/90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
              onChange={handleChange}
              required
            />

            <input
              name="height"
              type="number"
              placeholder="Height (cm)"
              className="p-3 rounded-full bg-white/90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
              onChange={handleChange}
              required
            />

            <input
              name="weight"
              type="number"
              placeholder="Weight (kg)"
              className="p-3 rounded-full bg-white/90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-full font-bold transition-all shadow-md active:scale-95 mt-2"
          >
            SIGN UP
          </button>
        </form>

        <div className="text-center text-sm text-white/90">
          <Link to="/" className="hover:underline block">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;