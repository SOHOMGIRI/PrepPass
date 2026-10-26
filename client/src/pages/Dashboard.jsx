import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axiosClient.js";
import GaugeCircle from "../components/GaugeCircle.jsx";
import { Skeleton } from "../components/ui/skeleton.jsx";
import SpotlightCard from "../components/landing/SpotlightCard.jsx";
import PraepPassLogo from "../components/PraepPassLogo.jsx";
import {
  ShieldCheck,
  Award,
  ArrowRight,
  LogOut,
  Target,
  FileCheck,
  FileText,
  Brain,
  Clock,
  Mic,
  Users,
  Building2,
  Layers,
  History as HistoryIcon,
  Sparkles,
} from "lucide-react";

const section1Cards = [
  {
    title: "Resume Analysis",
    desc: "Instant ATS compliance audit and targeted prep recommendations.",
    to: "/resume-analysis",
    stamp: "ATS AUDIT",
    icon: FileCheck,
  },
  {
    title: "Resume Matcher",
    desc: "Cosine similarity matching against target job descriptions.",
    to: "/resume-matcher",
    stamp: "RESUME MATCH",
    icon: Target,
  },
];

const section2Cards = [
  {
    title: "Resume Architect",
    desc: "Create an accredited CV with Google's X-Y-Z bullet points.",
    to: "/resume-builder",
    stamp: "RESUME BUILDER",
    icon: FileText,
  },
];

const section3Cards = [
  {
    title: "Aptitude Drills",
    desc: "Targeted problem sets for Quantitative, Logic & Verbal reasoning.",
    to: "/aptitude",
    stamp: "APTITUDE",
    icon: Brain,
  },
  {
    title: "Test Mode",
    desc: "10-minute proctored MCQ evaluation with integrity tracking.",
    to: "/test-mode",
    stamp: "TEST MODE",
    icon: Clock,
  },
  {
    title: "Mock Interview",
    desc: "Adaptive technical & HR questions with live speech prosody HUD.",
    to: "/interview",
    stamp: "INTERVIEW",
    icon: Mic,
  },
  {
    title: "GD Practice",
    desc: "Group discussion arena with AI rebuttal & synthesis scoring.",
    to: "/gd-practice",
    stamp: "GD PRACTICE",
    icon: Users,
  },
  {
    title: "Company Tracks",
    desc: "Recruitment patterns modeled after FAANG & leading enterprises.",
    to: "/company-prep",
    stamp: "COMPANY PREP",
    icon: Building2,
  },
];

const section4Cards = [
  {
    title: "Revision Deck",
    desc: "Flashcards generated automatically from missed test questions.",
    to: "/revision-deck",
    stamp: "REVISION DECK",
    icon: Layers,
  },
  {
    title: "Assessment History",
    desc: "Review past transcripts, feedback rubrics, and percentile records.",
    to: "/history",
    stamp: "HISTORY",
    icon: HistoryIcon,
  },
];

function fmtDateShort(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

function CustomTrendTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-[#0A1128]/10 bg-white text-[#0A1128] p-3.5 font-mono text-xs shadow-lg space-y-1.5">
        <p className="font-bold text-[#0A1128] pb-1 border-b border-[#0A1128]/8">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color }} className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600">{entry.name}:</span>
            <span className="font-bold ml-auto">{entry.value}%</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function getRecommendation(summary) {
  if (!summary) return null;
  if (!summary.hasResumeAnalysis) {
    return {
      title: "Initiate your candidate assessment with an ATS resume audit",
      desc: "Upload your resume to calculate keyword density match and receive personalized subject recommendations.",
      to: "/resume-matcher",
      buttonText: "Upload Resume",
      badge: "RECOMMENDED ACTION",
    };
  }
  if (summary.interviewCount === 0 && summary.testCount === 0) {
    return {
      title: "Rehearse your initial session — Aptitude Drills or Mock Interview",
      desc: "Calibrate your vocal cadence with real-time prosody in an adaptive 4-question mock interview.",
      to: "/interview",
      buttonText: "Initialize Interview",
      badge: "RECOMMENDED ACTION",
    };
  }
  if (summary.hasWeakAreaCards) {
    return {
      title: "Review identified concept weak spots in your Revision Deck",
      desc: "Reinforce fundamental concepts using spaced-repetition flashcards generated from missed questions.",
      to: "/revision-deck",
      buttonText: "Open Revision Deck",
      badge: "RECOMMENDED ACTION",
    };
  }
  return {
    title: "Continue your rehearsal streak — explore Company Tracks or GD Practice",
    desc: "Sharpen specific recruitment patterns for top recruiters or practice taking the floor in group discussions.",
    to: "/company-prep",
    buttonText: "Explore Tracks",
    badge: "RECOMMENDED ACTION",
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [avg, setAvg] = useState(null);
  const [count, setCount] = useState(0);
  const [trendData, setTrendData] = useState([]);
  const [hasInterview, setHasInterview] = useState(false);
  const [hasTest, setHasTest] = useState(false);
  const [hasGd, setHasGd] = useState(false);
  const [loadingTrend, setLoadingTrend] = useState(true);
  const [summary, setSummary] = useState(null);
  const displayName = user?.name?.split(" ")[0] || "Candidate";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [ivRes, trendRes, summaryRes] = await Promise.all([
          api.get("/interview/history"),
          api.get("/analytics/trend"),
          api.get("/dashboard/summary"),
        ]);

        if (cancelled) return;

        if (summaryRes?.data) setSummary(summaryRes.data);

        const scores = (ivRes.data?.sessions || [])
          .map((s) => s.overallReadinessScore)
          .filter((v) => typeof v === "number");
        setCount(scores.length);
        if (scores.length) {
          const sum = scores.reduce((a, b) => a + b, 0);
          setAvg(Math.round((sum / scores.length) * 10) / 10);
        } else {
          setAvg(null);
        }

        const { interviewTrend = [], testTrend = [], gdTrend = [] } = trendRes.data || {};
        setHasInterview(interviewTrend.length > 0);
        setHasTest(testTrend.length > 0);
        setHasGd(gdTrend.length > 0);

        const mergedMap = new Map();
        const addPoint = (item, type, score) => {
          if (!item.date || typeof score !== "number") return;
          const key = new Date(item.date).toISOString().slice(0, 16);
          const dateLabel = fmtDateShort(item.date);
          const current = mergedMap.get(key) || { date: item.date, displayDate: dateLabel };
          current[type] = score;
          mergedMap.set(key, current);
        };

        interviewTrend.forEach((i) =>
          addPoint(i, "interview", Math.round(i.score <= 10 ? i.score * 10 : i.score))
        );
        testTrend.forEach((t) => addPoint(t, "test", Math.round(t.score)));
        gdTrend.forEach((g) =>
          addPoint(g, "gd", Math.round(g.score <= 10 ? g.score * 10 : g.score))
        );

        const chronological = Array.from(mergedMap.values()).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setTrendData(chronological);
      } catch {
        if (!cancelled) {
          setAvg(null);
          setTrendData([]);
        }
      } finally {
        if (!cancelled) setLoadingTrend(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasAnyTrend = hasInterview || hasTest || hasGd;
  const recommendation = getRecommendation(summary);

  return (
    <div className="min-h-screen bg-[#FDFBF7] px-6 py-12">
      <motion.div
        className="mx-auto max-w-5xl space-y-9"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Header Navigation & User Profile */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#0A1128]/8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1128]/5 border border-[#0A1128]/10 font-mono text-[10px] uppercase tracking-widest text-[#0A1128] font-bold mb-2">
              <ShieldCheck size={12} className="text-[#C5A059]" />
              <span>ACCREDITED CANDIDATE DOSSIER</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0A1128]">
              Welcome back, {displayName}.
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Your candidate assessment pass is active. Rehearse technical rounds and track your readiness curve.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/interview"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider bg-[#0A1128] text-white hover:bg-[#1E293B] shadow-sm transition-all"
            >
              <span>Launch Mock Interview</span>
              <ArrowRight size={14} className="text-[#C5A059]" />
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#0A1128]/15 bg-white px-4 py-2.5 font-mono text-xs font-semibold text-slate-700 hover:bg-[#0A1128]/5 transition-colors"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>

        {/* Dynamic Action Recommendation */}
        {recommendation && (
          <motion.div
            variants={itemVariants}
            className="ticket-card p-6 sm:p-7 border border-[#C5A059]/40 bg-gradient-to-r from-white via-white to-[#F7F4EB] shadow-card"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#9E7B35] bg-[#C5A059]/15 px-2.5 py-0.5 rounded border border-[#C5A059]/30">
                    {recommendation.badge}
                  </span>
                </div>
                <h2 className="font-heading text-lg font-bold text-[#0A1128]">
                  {recommendation.title}
                </h2>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  {recommendation.desc}
                </p>
              </div>
              <Link
                to={recommendation.to}
                className="inline-flex items-center justify-center shrink-0 gap-2 rounded-xl bg-[#0A1128] px-6 py-3 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1E293B] shadow-sm transition"
              >
                <span>{recommendation.buttonText}</span>
                <ArrowRight size={14} className="text-[#C5A059]" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Readiness Score Card */}
        <motion.div
          variants={itemVariants}
          className="ticket-card flex flex-col items-center gap-6 p-7 sm:flex-row sm:justify-between border border-[#0A1128]/8 shadow-card"
        >
          {avg != null ? (
            <>
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#9E7B35] font-bold bg-[#C5A059]/10 px-2.5 py-1 rounded border border-[#C5A059]/20">
                  COMPOSITE READINESS RATING
                </span>
                <h3 className="font-heading text-xl font-bold text-[#0A1128] mt-2">
                  Candidate Readiness Index
                </h3>
                <p className="mt-1 max-w-sm text-sm text-slate-600 leading-relaxed">
                  Calculated from <CountUp end={count} duration={1} /> completed interview evaluation session
                  {count === 1 ? "" : "s"} across technical and behavioral dimensions.
                </p>
              </div>
              <div className="transition-transform duration-700 ease-out">
                <GaugeCircle value={avg} max={10} size={135} caption="Readiness Grade" />
              </div>
            </>
          ) : (
            <div className="mx-auto max-w-md text-center py-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[#9E7B35] font-bold bg-[#C5A059]/10 px-2.5 py-1 rounded border border-[#C5A059]/20">
                INITIAL ASSESSMENT PENDING
              </span>
              <h3 className="font-heading text-xl font-bold text-[#0A1128] mt-3">
                Zero Assessment Records
              </h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                Your composite readiness grade will be minted immediately upon concluding your first mock interview or proctored test.
              </p>
              <div className="mt-4">
                <Link
                  to="/interview"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider bg-[#0A1128] text-white hover:bg-[#1E293B]"
                >
                  <span>Start First Mock Session</span>
                  <ArrowRight size={14} className="text-[#C5A059]" />
                </Link>
              </div>
            </div>
          )}
        </motion.div>

        {/* Section 1: Know Where You Stand */}
        <motion.div variants={itemVariants} className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#C5A059] uppercase tracking-wider">01</span>
            <h2 className="font-heading text-lg font-bold text-[#0A1128]">
              Diagnostic Audit & ATS Compliance
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {section1Cards.map((c) => {
              const Icon = c.icon;
              return (
                <SpotlightCard key={c.to} to={c.to} className="p-7">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#9E7B35] bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/20">
                      {c.stamp}
                    </span>
                    <Icon size={18} className="text-[#0A1128]" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#0A1128] mb-1">{c.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{c.desc}</p>
                </SpotlightCard>
              );
            })}
          </div>
        </motion.div>

        {/* Section 2: Build & Improve */}
        <motion.div variants={itemVariants} className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#C5A059] uppercase tracking-wider">02</span>
            <h2 className="font-heading text-lg font-bold text-[#0A1128]">
              Resume Engineering & Optimization
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {section2Cards.map((c) => {
              const Icon = c.icon;
              return (
                <SpotlightCard key={c.to} to={c.to} className="p-7">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#9E7B35] bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/20">
                      {c.stamp}
                    </span>
                    <Icon size={18} className="text-[#0A1128]" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#0A1128] mb-1">{c.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{c.desc}</p>
                </SpotlightCard>
              );
            })}
          </div>
        </motion.div>

        {/* Section 3: Practice & Rehearse */}
        <motion.div variants={itemVariants} className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#C5A059] uppercase tracking-wider">03</span>
            <h2 className="font-heading text-lg font-bold text-[#0A1128]">
              High-Fidelity Practice & Proctored Simulations
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {section3Cards.map((c) => {
              const Icon = c.icon;
              return (
                <SpotlightCard key={c.to} to={c.to} className="p-7">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#9E7B35] bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/20">
                      {c.stamp}
                    </span>
                    <Icon size={18} className="text-[#0A1128]" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#0A1128] mb-1">{c.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{c.desc}</p>
                </SpotlightCard>
              );
            })}
          </div>
        </motion.div>

        {/* Section 4: Performance Analytics & Revision */}
        <motion.div variants={itemVariants} className="space-y-6 pt-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#C5A059] uppercase tracking-wider">04</span>
            <h2 className="font-heading text-lg font-bold text-[#0A1128]">
              Telemetry Curves & Concept Reinforcement
            </h2>
          </div>

          <div className="ticket-card p-6 sm:p-8 space-y-5 border border-[#0A1128]/8 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-[#0A1128]/8">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#9E7B35] bg-[#C5A059]/10 px-2.5 py-0.5 rounded border border-[#C5A059]/20">
                  LONGITUDINAL TELEMETRY
                </span>
                <h3 className="font-heading text-xl font-bold text-[#0A1128] mt-1.5">
                  Candidate Growth & Accuracy Trajectory
                </h3>
              </div>
              {hasAnyTrend && (
                <span className="font-mono text-xs text-slate-500 hidden sm:inline font-semibold">
                  Normalized Accuracy & Readiness (0–100%)
                </span>
              )}
            </div>

            {loadingTrend ? (
              <div className="space-y-4 p-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-56 w-full rounded-xl" />
              </div>
            ) : !hasAnyTrend ? (
              <div className="flex h-44 flex-col items-center justify-center text-center p-4">
                <p className="font-mono text-xs text-slate-500 max-w-sm">
                  No activity trend recorded yet. Complete an interview, proctored test, or GD session to visualize your progress over time!
                </p>
              </div>
            ) : (
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(10, 17, 40, 0.06)" />
                    <XAxis
                      dataKey="displayDate"
                      tick={{ fontSize: 11, fill: "#64748B", fontFamily: "monospace" }}
                      stroke="#CBD5E1"
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: "#64748B", fontFamily: "monospace" }}
                      stroke="#CBD5E1"
                      unit="%"
                    />
                    <Tooltip content={<CustomTrendTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "12px", fontFamily: "monospace", paddingTop: "8px" }} />
                    {hasInterview && (
                      <Line
                        type="monotone"
                        dataKey="interview"
                        name="Interview Readiness"
                        stroke="#0A1128"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#0A1128" }}
                        activeDot={{ r: 6 }}
                        connectNulls
                      />
                    )}
                    {hasTest && (
                      <Line
                        type="monotone"
                        dataKey="test"
                        name="Test Accuracy"
                        stroke="#C5A059"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#C5A059" }}
                        activeDot={{ r: 6 }}
                        connectNulls
                      />
                    )}
                    {hasGd && (
                      <Line
                        type="monotone"
                        dataKey="gd"
                        name="GD Articulation"
                        stroke="#059669"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#059669" }}
                        activeDot={{ r: 6 }}
                        connectNulls
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {section4Cards.map((c) => {
              const Icon = c.icon;
              return (
                <SpotlightCard key={c.to} to={c.to} className="p-7">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#9E7B35] bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/20">
                      {c.stamp}
                    </span>
                    <Icon size={18} className="text-[#0A1128]" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#0A1128] mb-1">{c.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{c.desc}</p>
                </SpotlightCard>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
