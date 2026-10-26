import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient.js";
import InterviewCard from "../components/InterviewCard.jsx";
import SessionResults from "../components/SessionResults.jsx";
import { Building2, Search, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Layers } from "lucide-react";

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
    const matchesCategory = companyCategory === "All" || c.category === companyCategory;
    const matchesSearch =
      !companySearch.trim() ||
      c.name.toLowerCase().includes(companySearch.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredRoles = roles.filter((r) => {
    const matchesCategory = roleCategory === "All" || r.category === roleCategory;
    const matchesSearch =
      !roleSearch.trim() ||
      r.label.toLowerCase().includes(roleSearch.trim().toLowerCase());
    return matchesCategory && matchesSearch;
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
      setError(err?.response?.data?.message || "Could not initialize tailored company session.");
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!answer.trim()) {
      setError("Please articulate or enter a response.");
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
        err?.response?.data?.message || "Something went wrong while evaluating."
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
      <div className="min-h-screen bg-[#FDFBF7] px-4 py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <SessionResults session={full} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] px-4 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Candidate Dossier
          </Link>
          {phase === "role-select" && (
            <button
              type="button"
              onClick={() => {
                setSelectedCompany(null);
                setPhase("company-select");
              }}
              className="font-mono text-xs text-[#0A1128] hover:text-[#C5A059] font-bold"
            >
              Browse All Companies →
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 font-mono text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Phase 1: Select Company */}
        {phase === "company-select" && (
          <div className="ticket-card mt-6 p-6 sm:p-10 border border-[#C5A059]/30 shadow-card">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1128]/5 border border-[#0A1128]/10 font-mono text-[10px] uppercase tracking-widest text-[#0A1128] font-bold">
              <Building2 size={12} className="text-[#C5A059]" />
              <span>PRÆPPASS — ENTERPRISE RECRUITMENT TRACKS</span>
            </div>
            <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-[#0A1128]">
              Target Enterprise Recruitment Suites
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Rehearse interview questions tailored to the reported assessment patterns, rounds, and technical depth of premier employers.
            </p>

            {/* Search Input */}
            <div className="mt-6 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search recruiters (e.g. TCS, Amazon, Google, Infosys, Microsoft)…"
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                className="w-full rounded-xl border border-[#0A1128]/10 bg-white pl-11 pr-4 py-3 text-sm text-[#0A1128] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] shadow-2xs"
              />
            </div>

            {/* Category Pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {COMPANY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCompanyCategory(cat)}
                  className={`rounded-xl px-4 py-1.5 font-mono text-[11px] tracking-wide transition-all ${
                    companyCategory === cat
                      ? "bg-[#0A1128] text-white font-bold"
                      : "bg-[#0A1128]/5 text-slate-600 hover:bg-[#0A1128]/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Company Grid */}
            {companiesLoading ? (
              <p className="mt-8 text-center text-sm font-mono text-slate-400">
                Loading enterprise recruitment tracks…
              </p>
            ) : filteredCompanies.length === 0 ? (
              <p className="mt-8 text-center text-sm font-mono text-slate-400">
                No matching enterprise tracks found.
              </p>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCompanies.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCompany(c)}
                    className="ticket-card group flex flex-col justify-between p-6 text-left transition hover:border-[#C5A059]/60 hover:shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E7B35] font-bold bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/20">
                          {c.category}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {c.typicalRounds?.length || 0} rounds
                        </span>
                      </div>
                      <h2 className="mt-3 font-heading text-lg font-bold text-[#0A1128]">
                        {c.name}
                      </h2>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-dashed border-[#0A1128]/10 pt-3">
                      <span className="font-mono text-[11px] font-bold text-[#0A1128] group-hover:text-[#9E7B35] flex items-center gap-1">
                        Select Track <ArrowRight size={13} className="text-[#C5A059]" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Phase 2: Role Select for Chosen Company */}
        {phase === "role-select" && selectedCompany && (
          <div className="space-y-6">
            <div className="ticket-card mt-6 p-6 sm:p-8 border border-[#C5A059]/30 shadow-card">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#9E7B35] bg-[#C5A059]/10 px-2.5 py-1 rounded border border-[#C5A059]/20">
                  ENTERPRISE PROFILE · {selectedCompany.category}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCompany(null);
                    setPhase("company-select");
                  }}
                  className="font-mono text-xs text-[#0A1128] hover:text-[#C5A059] font-bold"
                >
                  Change Recruiter
                </button>
              </div>

              <h1 className="mt-3 font-heading text-2xl font-extrabold text-[#0A1128]">
                {selectedCompany.name}
              </h1>

              {/* Typical Rounds Box */}
              <div className="mt-5 rounded-xl border border-[#0A1128]/8 bg-[#FDFBF7] p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xs uppercase tracking-wider font-bold text-[#0A1128]">
                    Hiring Pipeline Overview
                  </h2>
                  <span className="font-mono text-[10px] text-slate-400">
                    Accredited Simulation Standard
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {selectedCompany.typicalRounds?.map((round, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-slate-700"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0A1128] font-mono text-[10px] font-bold text-[#C5A059]">
                        {idx + 1}
                      </span>
                      <span className="mt-0.5">{round}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Role selection */}
            <div className="ticket-card p-6 sm:p-8 border border-[#0A1128]/8 shadow-card">
              <h2 className="font-heading text-xl font-bold text-[#0A1128]">
                Select Target Candidate Role at {selectedCompany.name}
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Evaluation rubrics and question difficulty will align with {selectedCompany.name}'s standards.
              </p>

              <div className="mt-4 relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter roles (e.g. Software Engineer, Frontend Developer, Data Analyst)…"
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  className="w-full rounded-xl border border-[#0A1128]/10 bg-white pl-11 pr-4 py-2.5 text-sm text-[#0A1128] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059]"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {ROLE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setRoleCategory(cat)}
                    className={`rounded-xl px-3.5 py-1 font-mono text-[11px] tracking-wide transition ${
                      roleCategory === cat
                        ? "bg-[#0A1128] text-white font-bold"
                        : "bg-[#0A1128]/5 text-slate-600 hover:bg-[#0A1128]/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {rolesLoading ? (
                <p className="mt-6 text-center text-sm font-mono text-slate-400">Loading accredited roles…</p>
              ) : filteredRoles.length === 0 ? (
                <p className="mt-6 text-center text-sm font-mono text-slate-400">No matching roles located.</p>
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredRoles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => start(r.label)}
                      disabled={busy}
                      className="ticket-card p-4 text-left transition hover:border-[#C5A059]/60 hover:shadow-xs disabled:opacity-60"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block">
                        {r.category}
                      </span>
                      <span className="mt-1 block font-heading text-sm font-bold text-[#0A1128]">
                        {r.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Phase 3: Live Interview */}
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
            voiceEnabled={true}
            isSpeechSupported={true}
          />
        )}
      </div>
    </div>
  );
}
