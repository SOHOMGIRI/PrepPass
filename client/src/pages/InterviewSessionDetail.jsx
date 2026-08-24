import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axiosClient.js";
import SessionResults from "../components/SessionResults.jsx";

export default function InterviewSessionDetail() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/interview/session/${id}`);
        if (cancelled) return;
        setSession(data.session);
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message || "Could not load this session."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-bg px-4 py-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
        <Link
          to="/history"
          className="mb-5 self-start font-mono text-xs text-text-primary/70 hover:underline"
        >
          ← Back to History
        </Link>
        {loading && (
          <div className="ticket-card flex w-full max-w-md items-center gap-3 px-6 py-8 text-text-primary/70">
            <span className="font-mono">•••</span>
            <span>Loading session…</span>
          </div>
        )}
        {error && (
          <div className="ticket-card w-full max-w-md p-6">
            <p className="font-mono text-xs text-stamp-maroon">{error}</p>
            <Link
              to="/dashboard"
              className="mt-4 inline-block text-sm text-text-primary hover:underline"
            >
              Go to Dashboard
            </Link>
          </div>
        )}
        {session && <SessionResults session={session} />}
      </div>
    </div>
  );
}
