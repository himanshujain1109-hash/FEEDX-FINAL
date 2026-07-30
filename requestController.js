import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";
import socket, { joinUserRoom } from "../socket";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("fb_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = user?.id || user?._id;
    if (!userId) return;
    joinUserRoom(userId);
    // socket.io may reconnect (network blip, tab wake) and drop room membership,
    // so re-join on every reconnect too.
    socket.on("connect", () => joinUserRoom(userId));
    return () => socket.off("connect");
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("fb_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem("fb_user", JSON.stringify(res.data.user));
      })
      .catch(() => {
        localStorage.removeItem("fb_token");
        localStorage.removeItem("fb_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("fb_token", res.data.token);
    localStorage.setItem("fb_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    localStorage.setItem("fb_token", res.data.token);
    localStorage.setItem("fb_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("fb_token");
    localStorage.removeItem("fb_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
