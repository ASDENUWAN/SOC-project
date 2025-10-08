// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { authApi, userApi } from "../api/axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading
  const navigate = useNavigate();

  // Fetch profile on mount (and on refresh)
  useEffect(() => {
    userApi
      .get("/profile")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      await authApi.post("/login", { email, password });
      const { data } = await userApi.get("/profile");
      setUser(data);
      navigate("/profile");
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            alert("Invalid credentials.");
            break;
          case 403:
            alert(err.response.data.message);
            break;
          default:
            alert("Login failed: " + err.response.data.message);
        }
      } else {
        alert("Network error – please try again.");
      }
    }
  };

  const register = async (payload) => {
    await authApi.post("/register", payload);
    navigate("/login");
  };

  const logout = async () => {
    await authApi.post("/logout");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
