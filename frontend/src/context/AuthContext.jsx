import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe, loginUser, registerUser, logoutUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("blogsphere_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { user } = await fetchMe();
        setUser(user);
      } catch {
        localStorage.removeItem("blogsphere_token");
        localStorage.removeItem("blogsphere_user");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (identifier, password) => {
    const data = await loginUser({ identifier, password });
    localStorage.setItem("blogsphere_token", data.token);
    localStorage.setItem("blogsphere_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    localStorage.setItem("blogsphere_token", data.token);
    localStorage.setItem("blogsphere_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem("blogsphere_token");
    localStorage.removeItem("blogsphere_user");
    setUser(null);
  };

  const updateLocalUser = (updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem("blogsphere_user", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateLocalUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
