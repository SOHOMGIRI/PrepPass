import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient.js";
import InterviewCard from "../components/InterviewCard.jsx";
import SessionResults from "../components/SessionResults.jsx";

const COMPANY_CATEGORIES = ["All", "IT Services", "Product & Tech"];

const ROLE_CATEGORIES = [
  "All",
  "Engineering",
  "Data & AI",
  "Product & Design",
  "Business & Management",
  "Support & Operations",
];

export default function CompanyPrep() {
  const [phase, setPhase] = useState("company-select"); // "company-select" | "role-select" | "live" | "feedback" | "complete"
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyCategory, setCompanyCategory] = useState("All");
  const [companySearch, setCompanySearch] = useState("");

  // Role state
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [roleSearch, setRoleSearch] = useState("");
  const [roleCategory, setRoleCategory] = useState("All");

  // Interview execution state
  const [role, setRole] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState("");
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [last, setLast] = useState(null);
  const [nextQ, setNextQ] = useState("");
  const [full, setFull] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Fetch companies and roles on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCompaniesLoading(true);
      try {
        const { data } = await api.get("/companies");
        if (!cancelled) setCompanies(data.companies || []);
      } catch {
        if (!cancelled) setCompanies([]);
      } finally {
        if (!cancelled) setCompaniesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setRolesLoading(true);
      try {
        const { data } = await api.get("/interview/roles");
        if (!cancelled) setRoles(data.roles || []);
      } catch {
        if (!cancelled) setRoles([]);
      } finally {
        if (!cancelled) setRolesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCompanies = companies.filter((c) => {
    const matchesCat =
      companyCategory === "All" || c.category === companyCategory;
    const matchesSearch =
      !companySearch.trim() ||
      c.name.toLowerCase().includes(companySearch.trim().toLowerCase()) ||
      c.id.toLowerCase().includes(companySearch.trim().toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredRoles = roles.filter((r) => {
    const matchesCat =
      roleCategory === "All" || r.category === roleCategory;
    const matchesSearch =
      !roleSearch.trim() ||
      r.label.toLowerCase().includes(roleSearch.trim().toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSelectCompany = (comp) => {
    setSelectedCompany(comp);
    setRoleSearch("");
    setRoleCategory("All");
    setError("");
    setPhase("role-select");
  };

  const start = async (chosenRole) => {
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/interview/start", {
        role: chosenRole,
        companyId: selectedCompany?.id,
      });
      setRole(chosenRole);
      setSessionId(data.sessionId);
      setQuestion(data.question);
      setStep(0);
      setPhase("live");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not start the interview.");
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!answer.trim()) {
      setError("Please enter an answer.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/interview/answer", {
        sessionId,
        answerText: answer,
      });
      setLast({ score: data.score, feedback: data.feedback || "" });
      setAnswer("");
      if (data.completed) {
        const { data: sd } = await api.get(`/interview/session/${sessionId}`);
        setFull(sd.session);
        setPhase("complete");
      } else {
        setNextQ(data.nextQuestion || "");
        setStep((s) => s + 1);
        setPhase("feedback");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Something went wrong while submitting."
      );
    } finally {
      setBusy(false);
    }
  };

  const next = () => {
    setQuestion(nextQ);
    setPhase("live");
  };

  useEffect(() => {
    if (phase !== "feedback") return;
    const t = setTimeout(() => {
      setQuestion(nextQ);
      setPhase("live");
    }, 5000);
    return () => clearTimeout(t);
  }, [phase, nextQ]);

  if (phase === "complete") {
    return (
      <div className="min-h-screen bg-cream px-4 py-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center">
          <SessionResults session={full} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="font-mono text-xs text-stamp-navy/70 hover:underline"
          >
            ← Back to Dashboard
          </Link>
          {phase === "role-select" && (
            <button
              type="button"
              onClick={() => {
                setSelectedCompany(null);
                setPhase("company-select");
              }}
              className="font-mono text-xs text-stamp-navy/70 hover:underline"
            >
              Browse All Companies
            </button>
          )}
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-gold/10 px-4 py-3 font-mono text-xs text-stamp-maroon">
            {error}
          </p>
        )}

        {/* Phase 1: Select Company */}
        {phase === "company-select" && (
          <div className="ticket-card mt-6 p-6 sm:p-8">
            <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-stamp-navy">
              PREPPASS — COMPANY TRACKS
            </div>
            <h1 className="mt-3 font-heading text-2xl text-stamp-navy">
              Select a company to practice for.
            </h1>
            <p className="mt-1 text-sm text-ink/60">
              Practice interviews tailored to the interview patterns, rounds, and technical depth of top recruiters.
            </p>

            {/* Search Input */}
            <div className="mt-5">
              <input
                type="text"
                placeholder="Search companies (e.g. TCS, Amazon, Google, Infosys)…"
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                className="w-full rounded-lg border border-ink/20 bg-white px-4 py-2.5 text-sm text-ink placeholder-ink/40 focus:border-stamp-navy focus:outline-none focus:ring-2 focus:ring-stamp-navy/30"
              />
            </div>

            {/* Category Pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {COMPANY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCompanyCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] tracking-wide transition ${
                    companyCategory === cat
                      ? "bg-stamp-navy text-white"
                      : "bg-stamp-navy/10 text-stamp-navy hover:bg-stamp-navy/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Company Grid */}
            {companiesLoading ? (
              <p className="mt-8 text-center text-sm text-ink/50">
                Loading company profiles…
              </p>
            ) : filteredCompanies.length === 0 ? (
              <p className="mt-8 text-center text-sm text-ink/50">
                No companies found matching your search.
              </p>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCompanies.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCompany(c)}
                    className="ticket-card group flex flex-col justify-between p-5 text-left transition hover:border-stamp-navy/50"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-stamp-navy/60">
                          {c.category}
                        </span>
                        <span className="font-mono text-[10px] text-stamp-navy/40">
                          {c.typicalRounds?.length || 0} rounds
                        </span>
                      </div>
                      <h2 className="mt-2 font-heading text-base text-stamp-navy">
                        {c.name}
                      </h2>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-dashed border-stamp-navy/10 pt-3">
                      <span className="font-mono text-[11px] text-gold group-hover:underline">
                        Start Track →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Phase 2: Company Overview & Role Select */}
        {phase === "role-select" && selectedCompany && (
          <div className="space-y-6">
            {/* Company Summary Ticket */}
            <div className="ticket-card mt-6 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-stamp-navy">
                  COMPANY PROFILE · {selectedCompany.category}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCompany(null);
                    setPhase("company-select");
                  }}
                  className="font-mono text-xs text-stamp-navy/70 hover:underline"
                >
                  Change Company
                </button>
              </div>

              <h1 className="mt-3 font-heading text-2xl text-stamp-navy">
                {selectedCompany.name}
              </h1>

              {/* Typical Rounds Box */}
              <div className="mt-5 rounded-lg border border-stamp-navy/15 bg-ticket/60 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xs uppercase tracking-wider text-stamp-navy/80">
                    What to Expect — Typical Round Patterns
                  </h2>
                  <span className="font-mono text-[10px] text-stamp-navy/50">
                    For practice purposes
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-ink/60">
                  Commonly reported hiring patterns. Individual recruitment drives may vary.
                </p>
                <div className="mt-3 space-y-2">
                  {selectedCompany.typicalRounds?.map((round, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-ink/80"
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-stamp-navy/15 font-mono text-[10px] font-bold text-stamp-navy">
                        {idx + 1}
                      </span>
                      <span>{round}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Role Selection for Selected Company */}
            <div className="ticket-card p-6 sm:p-8">
              <h2 className="font-heading text-xl text-stamp-navy">
                Select your target role at {selectedCompany.name}.
              </h2>
              <p className="mt-1 text-xs text-ink/60">
                Questions will be tailored to {selectedCompany.name}'s interview style.
              </p>

              {/* Role Search */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Search roles (e.g. Software Engineer, Frontend Developer, Data Analyst)…"
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  className="w-full rounded-lg border border-ink/20 bg-white px-4 py-2.5 text-sm text-ink placeholder-ink/40 focus:border-stamp-navy focus:outline-none focus:ring-2 focus:ring-stamp-navy/30"
                />
              </div>

              {/* Role Category Pills */}
              <div className="mt-3 flex flex-wrap gap-2">
                {ROLE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setRoleCategory(cat)}
                    className={`rounded-full px-3 py-1 font-mono text-[11px] tracking-wide transition ${
                      roleCategory === cat
                        ? "bg-stamp-navy text-white"
                        : "bg-stamp-navy/10 text-stamp-navy hover:bg-stamp-navy/20"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Roles Grid */}
              {rolesLoading ? (
                <p className="mt-6 text-center text-sm text-ink/50">
                  Loading roles…
                </p>
              ) : filteredRoles.length === 0 ? (
                <p className="mt-6 text-center text-sm text-ink/50">
                  No roles found matching your search.
                </p>
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredRoles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => start(r.label)}
                      disabled={busy}
                      className="ticket-card px-4 py-4 text-left transition hover:border-stamp-navy/50 disabled:opacity-60"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-wider text-stamp-navy/50">
                        {r.category}
                      </span>
                      <span className="mt-1 block font-heading text-sm text-stamp-navy">
                        {r.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Phase 3: Live Interview or Feedback */}
        {(phase === "live" || phase === "feedback") && (
          <InterviewCard
            phase={phase}
            role={
              selectedCompany
                ? `${selectedCompany.name} · ${role}`
                : role
            }
            step={step}
            question={question}
            answer={answer}
            setAnswer={setAnswer}
            busy={busy}
            last={last}
            onNext={next}
            onSubmit={submit}
          />
        )}
      </div>
    </div>
  );
}
