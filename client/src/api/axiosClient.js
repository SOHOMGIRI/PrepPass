import axios from "axios";
import { tokenStore } from "./tokenStore.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // needed to send / receive the httpOnly refresh cookie
  // NOTE: no global Content-Type default. axios sets it per-request —
  // application/json for plain objects, multipart/form-data (with a boundary)
  // for FormData. A global "application/json" default forces FormData uploads
  // to be serialized as JSON, which breaks multer's multipart parsing (this
  // was the root cause of the Resume Matcher file-upload failure).
});

// Attach the in-memory access token to every outgoing request.
api.interceptors.request.use(
  (config) => {
    const token = tokenStore.get();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshPromise = null;

// Auth endpoints should never trigger the 401 -> refresh flow (prevents loops
// and avoids logging the user out mid-auth-flow).
const AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/verify-otp",
  "/auth/resend-otp",
  "/auth/refresh",
  "/auth/logout",
  "/auth/me",
];

const isAuthPath = (url) =>
  AUTH_PATHS.some((p) => typeof url === "string" && url.includes(p));

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    if (!response || response.status !== 401) {
      return Promise.reject(error);
    }
    // Explicit opt-out (used by AuthContext's mount/restore flow).
    if (config.skipAuthRefresh) {
      return Promise.reject(error);
    }
    // Never auto-refresh off auth endpoints themselves.
    if (isAuthPath(config.url)) {
      return Promise.reject(error);
    }

    // If a refresh is already in flight, wait for it then retry once.
    if (isRefreshing) {
      try {
        await refreshPromise;
        config.headers.Authorization = `Bearer ${tokenStore.get()}`;
        return api(config);
      } catch {
        return Promise.reject(error);
      }
    }

    // Start a single refresh. We use a *bare* axios call (not the `api`
    // instance) so this cannot re-enter the response interceptor -> no loop.
    isRefreshing = true;
    refreshPromise = axios
      .post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true })
      .then((res) => {
        const newAccessToken = res.data?.accessToken;
        if (!newAccessToken) {
          throw new Error("Refresh did not return an access token");
        }
        tokenStore.set(newAccessToken);
        return newAccessToken;
      })
      .finally(() => {
        isRefreshing = false;
      });

    try {
      await refreshPromise;
      config.headers.Authorization = `Bearer ${tokenStore.get()}`;
      // Retry the original request once, now with the fresh token.
      return api(config);
    } catch (refreshError) {
      // Refresh also failed → hard expire: log the user out.
      const handler = tokenStore.getLogoutHandler();
      if (handler) handler();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
