
import React, { createContext, useContext, useState, useEffect } from "react";

//  Exporting AuthContext to use in other components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
      return null;
    }
  });

  const login = (userData) => {
    const {
      id,
      email,
      role,
      token,
      firstName = "",
      lastName = "",
      phone = "",
    } = userData;

    const name =
      userData.name ||
      `${capitalize(firstName)} ${capitalize(lastName)}`.trim() ||
      email ||
      "Unknown";

    const cleanedUser = {
      id,
      email,
      role,
      token,
      firstName,
      lastName,
      phone,
      name,
    };

    localStorage.setItem("user", JSON.stringify(cleanedUser));
    localStorage.setItem("token", token);
    setUser(cleanedUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    } catch (err) {
      console.error("Error restoring user session:", err);
      setUser(null);
    }
  }, []);

  const capitalize = (str) => {
    return str?.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook for convenience
export const useAuth = () => useContext(AuthContext);
