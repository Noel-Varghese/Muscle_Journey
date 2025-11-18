import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    localStorage.setItem("access_token", res.data.access_token);
    localStorage.setItem("refresh_token", res.data.refresh_token);

    setUser({ email });
  };

  const register = async (data) => {
    await api.post("/auth/register", data);
  };

  const logout = async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    if (refresh_token) {
      await api.post("/auth/logout", { refresh_token });
    }
    localStorage.clear();
    setUser(null);
  };

  const refreshToken = async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) return;
    try {
      const res = await api.post("/auth/refresh", { refresh_token });
      localStorage.setItem("access_token", res.data.access_token);
    } catch (err) {
      logout();
    }
  };

  useEffect(() => {
    const interval = setInterval(refreshToken, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
