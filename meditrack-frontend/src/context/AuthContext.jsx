import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 LOAD FROM LOCALSTORAGE
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");
      const storedUserRaw = localStorage.getItem("user");

      let storedUser = null;

      if (storedUserRaw && storedUserRaw !== "undefined") {
        storedUser = JSON.parse(storedUserRaw);
      }

      if (storedToken) {
        setToken(storedToken);
        setRole(storedRole || null);
        setUser(storedUser || null);
      }

    } catch (err) {
      console.error("Auth load error:", err);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔥 FIXED LOGIN (MAIN CHANGE)
  const login = (newToken, newRole, newUser) => {
    try {
      // ✅ CLEAR OLD SESSION FIRST
      localStorage.clear();

      // ✅ SAVE CLEAN DATA
      localStorage.setItem("token", newToken);
      localStorage.setItem("role", newRole);
      localStorage.setItem("user", JSON.stringify(newUser));

      setToken(newToken);
      setRole(newRole);
      setUser(newUser);

    } catch (err) {
      console.error("Login error:", err);
    }
  };

  // 🔥 FIXED LOGOUT
  const logout = () => {
    localStorage.clear();   // ✅ important

    setToken(null);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);