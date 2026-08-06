import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosClient.js";

function fmtDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "";
  }
}

export default function History() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [iv, rm] = await Promise.all([
        api.get("/interview/history"),
        api.get("/resume/history"),
      ]);
      setInterviews(iv.data?.sessions || []);
      setMatches(rm.data?.matches || []);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not load your history."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-cream px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          to="/dashboard"
          className="font-mono text-xs text-stamp-navy/70 hover:underline"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="mt-4 font-heading text-2xl text-stamp-navy">
          Your history
        </h1>

        {error && (
          <p className="mt-4 rounded-lg bg-gold/10 px-4 py-3 font-mono text-xs text-stamp-maroon">
            {error}
          </p>
        )}

        {loading ? (
          <div className="ticket-card mt-6 flex items-center gap-3 px-6 py-8 text-stamp-navy/70">
            <span className="font-mono">•••</span>
            <span>Loading your history…</span>
          </div>
        ) : (
          <>
            <section className="mt-8">
              <h2 className="font-heading text-sm uppercase tracking-wider text-stamp-navy/70">
                Interviews
              </h2>
              {interviews.length === 0 ? (
                <p className="ticket-card mt-3 p-6 text-sm text-ink/60">
                  No interviews yet. Start one from the dashboard.
                </p>
              ) : (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {interviews.map((s) => (
                    <button
                      key={s._id}
                      type="button"
                      onClick={() => navigate(`/interview/session/${s._id}`)}
                      className="ticket-card p-5 text-left transition hover:border-stamp-navy/50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="ticket-stamp inline-block rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-stamp-navy">
                          {s.role}
                        </span>
                        <span className="score font-heading text-lg text-gold">
                          {s.overallReadinessScore != null
                            ? `${s.overallReadinessScore} / 10`
                            : "—"}
                        </span>
                      </div>
                      <p className="mt-3 font-mono text-[10px] text-stamp-navy/50">
                        {fmtDate(s.startedAt)}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase text-stamp-navy/50">
                        {s.status}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-10">
              <h2 className="font-heading text-sm uppercase tracking-wider text-stamp-navy/70">
                Resume matches
              </h2>
              {matches.length === 0 ? (
                <p className="ticket-card mt-3 p-6 text-sm text-ink/60">
                  No resume matches yet.
                </p>
              ) : (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {matches.map((m) => (
                    <div key={m._id} className="ticket-card p-5">
                      <div className="flex items-center justify-between">
                        <span className="ticket-stamp inline-block rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-stamp-navy">
                          RESUME MATCH
                        </span>
                        <span className="score font-heading text-lg text-gold">
                          {m.matchScorePercent}%
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm text-ink/75">
                        {m.jobDescription}
                      </p>
                      <p className="mt-2 font-mono text-[10px] text-stamp-navy/50">
                        {fmtDate(m.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
