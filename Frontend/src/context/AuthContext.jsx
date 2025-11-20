import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Keep axios Authorization automatically updated
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Sync user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // LOGIN
  const login = async (email, password) => {
    const res = await axios.post("http://localhost:8000/auth/login", {
      email,
      password,
    });

    const access = res.data.access_token;
    setToken(access);

    // Fetch the full user info
    const userRes = await axios.get(`http://localhost:8000/users/${email}`);
    setUser(userRes.data);
  };

  // REGISTER
  const register = async (data) => {
    await axios.post("http://localhost:8000/auth/register", data);
  };

  // LOGOUT
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        setUser, // IMPORTANT: so EditProfile and AvatarUpload can update instantly
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
