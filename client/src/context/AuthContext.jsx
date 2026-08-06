import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient.js";
import { tokenStore } from "../api/tokenStore.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(async () => {
    tokenStore.clear();
    setAccessToken(null);
    setUser(null);
    try {
      await api.post("/auth/logout", {}, { skipAuthRefresh: true });
    } catch {
      // ignore — client state is already cleared
    }
    navigate("/login", { replace: true });
  }, [navigate]);

  // Let the axios interceptor trigger a full logout on hard token expiry.
  useEffect(() => {
    tokenStore.setLogoutHandler(logout);
    return () => tokenStore.setLogoutHandler(null);
  }, [logout]);

  const applyToken = (token) => {
    tokenStore.set(token);
    setAccessToken(token);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    applyToken(data.accessToken);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post(
      "/auth/register",
      { name, email, password },
      { skipAuthRefresh: true }
    );
    return data;
  };

  // Restore the session on mount using the httpOnly refresh cookie so a
  // page refresh does not log the user out.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      try {
        const { data } = await api.post(
          "/auth/refresh",
          {},
          { skipAuthRefresh: true }
        );
        if (cancelled) return;

        if (data.accessToken) {
          applyToken(data.accessToken);

          // Fetch the user profile with the restored token so the dashboard
          // can greet them by name. Tolerate failure: the access token alone
          // still counts as authenticated.
          try {
            const { data: meData } = await api.get("/auth/me", {
              skipAuthRefresh: true,
            });
            if (cancelled) return;
            if (meData.user) setUser(meData.user);
          } catch {
            // keep authenticated via token only
          }
        }
      } catch {
        if (cancelled) return;
        tokenStore.clear();
        setAccessToken(null);
        setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isLoading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
