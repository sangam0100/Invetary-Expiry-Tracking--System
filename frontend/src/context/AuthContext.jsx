import { createContext, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  const login = (tok, userData) => {
    const updatedUser = {
      ...userData,
      lastLogin: new Date().toISOString()
    };
    localStorage.setItem("token", tok);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setToken(tok);
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
