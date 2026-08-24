import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosClient.js";

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export default function History() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [testSessions, setTestSessions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [iv, tm, rm, ra] = await Promise.all([
        api.get("/interview/history"),
        api.get("/test/history"),
        api.get("/resume/history"),
        api.get("/resume/analyze/history").catch(() => ({ data: { analyses: [] } })),
      ]);
      setInterviews(iv.data?.sessions || []);
      setTestSessions(tm.data?.sessions || []);
      setMatches(rm.data?.matches || []);
      setAnalyses(ra.data?.analyses || []);
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
    <div className="min-h-screen bg-bg px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          to="/dashboard"
          className="font-mono text-xs text-text-primary/70 hover:underline"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="mt-4 font-heading text-2xl text-text-primary">
          Your history
        </h1>

        {error && (
          <p className="mt-4 rounded-lg bg-gold/10 px-4 py-3 font-mono text-xs text-stamp-maroon">
            {error}
          </p>
        )}

        {loading ? (
          <div className="ticket-card mt-6 flex items-center gap-3 px-6 py-8 text-text-primary/70">
            <span className="font-mono animate-pulse">...</span>
            <span>Loading your history...</span>
          </div>
        ) : (
          <>
            <section className="mt-8">
              <h2 className="font-heading text-sm uppercase tracking-wider text-text-primary/70">
                Interviews
              </h2>
              {interviews.length === 0 ? (
                <p className="ticket-card mt-3 p-6 text-sm text-text-secondary/60">
                  No interviews yet. Start one from the dashboard.
                </p>
              ) : (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {interviews.map((s) => (
                    <button
                      key={s._id}
                      type="button"
                      onClick={() => navigate(`/interview/session/${s._id}`)}
                      className="ticket-card p-5 text-left transition hover:border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {s.companyId && (
                            <span className="ticket-stamp inline-block rounded bg-gold/20 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-text-primary">
                              {s.companyId.toUpperCase()}
                            </span>
                          )}
                          <span className="ticket-stamp inline-block rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-text-primary">
                            {s.role}
                          </span>
                        </div>
                        <span className="score font-heading text-lg text-white">
                          {s.overallReadinessScore != null
                            ? `${s.overallReadinessScore} / 10`
                            : "—"}
                        </span>
                      </div>
                      <p className="mt-3 font-mono text-[10px] text-text-primary/50">
                        {fmtDate(s.startedAt)}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase text-text-primary/50">
                        {s.status}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-10">
              <h2 className="font-heading text-sm uppercase tracking-wider text-text-primary/70">
                Proctored Tests
              </h2>
              {testSessions.length === 0 ? (
                <p className="ticket-card mt-3 p-6 text-sm text-text-secondary/60">
                  No proctored tests taken yet. Start one from the dashboard.
                </p>
              ) : (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {testSessions.map((t) => (
                    <div key={t._id} className="ticket-card p-5">
                      <div className="flex items-center justify-between">
                        <span className="ticket-stamp inline-block rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-text-primary">
                          {t.subjects?.join(" • ") || "TEST"}
                        </span>
                        <span className="score font-heading text-lg text-white">
                          {t.scorePercent != null ? `${t.scorePercent}%` : "—"}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        {t.mode === "practice" ? (
                          <span className="rounded bg-gold/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-text-primary">
                            Practice Mode
                          </span>
                        ) : (
                          <span
                            className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                              t.trustScore === 100
                                ? "bg-green-100 text-green-800"
                                : t.trustScore === 70
                                ? "bg-yellow-100 text-yellow-800"
                                : t.trustScore === 40
                                ? "bg-gold text-[#0B0A14]"
                                : "bg-red-100 text-stamp-maroon"
                            }`}
                          >
                            {t.trustScore}% Trust Score
                          </span>
                        )}
                        <span className="font-mono text-[10px] uppercase text-text-primary/50">
                          {t.status}
                        </span>
                      </div>
                      <p className="mt-2 font-mono text-[10px] text-text-primary/50">
                        {fmtDate(t.startedAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-10">
              <h2 className="font-heading text-sm uppercase tracking-wider text-text-primary/70">
                Resume ATS Audits
              </h2>
              {analyses.length === 0 ? (
                <p className="ticket-card mt-3 p-6 text-sm text-text-secondary/60">
                  No ATS audits yet.
                </p>
              ) : (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {analyses.map((a) => (
                    <div key={a._id} className="ticket-card p-5">
                      <div className="flex items-center justify-between">
                        <span className="ticket-stamp inline-block rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-text-primary">
                          ATS AUDIT
                        </span>
                        <span className="score font-heading text-lg text-white">
                          {a.atsScore}%
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm text-text-secondary/75 font-mono">
                        {a.suggestedSubjects?.join(', ') || 'No topics identified'}
                      </p>
                      <p className="mt-2 font-mono text-[10px] text-text-primary/50">
                        {fmtDate(a.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-10 mb-10">
              <h2 className="font-heading text-sm uppercase tracking-wider text-text-primary/70">
                Resume matches
              </h2>
              {matches.length === 0 ? (
                <p className="ticket-card mt-3 p-6 text-sm text-text-secondary/60">
                  No resume matches yet.
                </p>
              ) : (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {matches.map((m) => (
                    <div key={m._id} className="ticket-card p-5">
                      <div className="flex items-center justify-between">
                        <span className="ticket-stamp inline-block rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-text-primary">
                          RESUME MATCH
                        </span>
                        <span className="score font-heading text-lg text-white">
                          {m.matchScorePercent}%
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm text-text-secondary/75">
                        {m.jobDescription}
                      </p>
                      <p className="mt-2 font-mono text-[10px] text-text-primary/50">
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
