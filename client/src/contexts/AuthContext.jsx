import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const apiUrl = import.meta.env.VITE_API_URL || "/api";

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');

  const checkSession = async () => {
    try {
      const response = await fetch(apiUrl+"/api/auth/verifySession", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);
      } else {
        throw new Error("Session verification failed");
      }
    } catch (error) {
      console.error(error);
      setIsLoggedIn(false);
    }
  };
  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(storedIsLoggedIn);
    checkSession();
  }, []);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  const login = async (email, password) => {
    try {
      const response = await fetch(apiUrl+"/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      await checkSession();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(apiUrl+"/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }

      await checkSession();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};
