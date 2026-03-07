import { createContext, useContext, useState, useEffect } from "react";

// =============================================
// 🔐 AUTH CONTEXT (JWT BASED - Flask Compatible)
// =============================================

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =============================================
  // 🔎 SAFE JWT DECODE FUNCTION
  // =============================================
  const decodeToken = (token) => {
    try {
      if (!token) return null;

      const base64Payload = token.split(".")[1];
      if (!base64Payload) return null;

      const payload = JSON.parse(atob(base64Payload));

      // 🔥 Expiration check
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        logout();
        return null;
      }

      return payload;
    } catch (error) {
      console.error("Invalid Token", error);
      return null;
    }
  };

  // =============================================
  // 🔓 LOGIN FUNCTION
  // =============================================
  const login = (token) => {
    if (!token) return;

    localStorage.setItem("token", token);

    const decoded = decodeToken(token);

    if (decoded) {
      setUser({
        email: decoded.sub,      // Flask identity
        role: decoded.role,      // additional_claims
      });
    }
  };

  // =============================================
  // 🔒 LOGOUT FUNCTION
  // =============================================
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  // =============================================
  // 🔄 AUTO LOGIN ON PAGE REFRESH
  // =============================================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = decodeToken(token);

      if (decoded) {
        setUser({
          email: decoded.sub,
          role: decoded.role,
        });
      } else {
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);