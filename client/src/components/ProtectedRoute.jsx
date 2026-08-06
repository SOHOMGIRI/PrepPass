import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function ProtectedRoute({ children }) {
  const { user, accessToken, isLoading } = useAuth();
  const location = useLocation();

  // While we are still checking for a persisted session, don't redirect.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="ticket-card ticket-stamp inline-flex items-center gap-3 px-6 py-4 text-stamp-navy/80">
          <span className="font-mono" aria-label="loading">
            •••
          </span>
          <span>Restoring your session…</span>
        </div>
      </div>
    );
  }

  // Not authenticated → send back to login (preserve the intended destination).
  if (!user && !accessToken) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
