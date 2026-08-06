// In-memory token store shared with the axios interceptor.
// The access token is NEVER persisted to localStorage — it lives only in
// React state and this module's closure for the lifetime of the tab.
let accessToken = null;
let logoutHandler = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token) => {
    accessToken = token;
  },
  clear: () => {
    accessToken = null;
  },
  getLogoutHandler: () => logoutHandler,
  setLogoutHandler: (fn) => {
    logoutHandler = fn;
  },
};
