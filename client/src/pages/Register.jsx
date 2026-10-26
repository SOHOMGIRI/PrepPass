import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PraepPassLogo from "../components/PraepPassLogo.jsx";
import { ArrowRight, ShieldCheck, Check, AlertCircle } from "lucide-react";

const INPUT_CLASS =
  "w-full rounded-xl border border-[#0A1128]/12 bg-transparent relative z-10 px-4 py-3 text-sm text-[#0A1128] placeholder-slate-400 transition-all focus:outline-none focus:bg-white focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 disabled:cursor-not-allowed disabled:opacity-60 shadow-2xs";
const INPUT_ERR_CLASS =
  "w-full rounded-xl border border-red-400 bg-red-50/50 px-4 py-3 text-sm text-[#0A1128] placeholder-slate-400 transition-all focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60";

const PASSWORD_REQS = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Contains letter & digit", test: (p) => /[A-Za-z]/.test(p) && /\d/.test(p) },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = "Full name is required";
    if (!values.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(values.email)) e.email = "Enter a valid email address";
    if (!values.password) e.password = "Password is required";
    else if (values.password.length < 8) e.password = "Password must be at least 8 characters";
    return e;
  };

  const onChange = (key) => (ev) =>
    setValues((v) => ({ ...v, [key]: ev.target.value }));

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const v = validate();
    setErrors(v);
    setServerError("");
    if (Object.keys(v).length) return;
    setSubmitting(true);
    try {
      await register(values.name, values.email, values.password);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setServerError(
        err?.response?.data?.message || "Could not register candidate pass. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent relative z-10 px-4 py-16">
      <div className="ticket-card w-full max-w-md p-8 sm:p-10 border border-[#C5A059]/35 shadow-card">
        {/* Brand Header */}
        <div className="text-center pb-6 border-b border-[#0A1128]/8 mb-6">
          <PraepPassLogo size="md" showTagline={true} className="justify-center" />
          <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mt-3 font-semibold">
            Candidate Admission Registry
          </p>
        </div>

        <h1 className="text-2xl font-heading font-extrabold text-[#0A1128] mb-1">
          Mint Candidate Pass
        </h1>
        <p className="text-slate-600 text-sm mb-6">
          Initialize your accredited talent assessment dossier and access all suites.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-[11px] font-bold tracking-wider text-[#0A1128] mb-1.5 uppercase">
              Full Legal Name
            </label>
            <input
              type="text"
              autoComplete="name"
              placeholder="e.g. SOHOM GIRI"
              value={values.name}
              onChange={onChange("name")}
              disabled={submitting}
              className={errors.name ? INPUT_ERR_CLASS : INPUT_CLASS}
            />
            {errors.name && (
              <p className="text-red-600 text-xs mt-1 font-mono">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold tracking-wider text-[#0A1128] mb-1.5 uppercase">
              University / Personal Email
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="candidate@placement.edu"
              value={values.email}
              onChange={onChange("email")}
              disabled={submitting}
              className={errors.email ? INPUT_ERR_CLASS : INPUT_CLASS}
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1 font-mono">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block font-mono text-[11px] font-bold tracking-wider text-[#0A1128] mb-1.5 uppercase">
              Master Security Key
            </label>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="••••••••••••"
              value={values.password}
              onChange={onChange("password")}
              disabled={submitting}
              className={errors.password ? INPUT_ERR_CLASS : INPUT_CLASS}
            />
            {errors.password && (
              <p className="text-red-600 text-xs mt-1 font-mono">{errors.password}</p>
            )}
            <div className="flex items-center gap-4 mt-2">
              {PASSWORD_REQS.map((r, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                      r.test(values.password)
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    ✓
                  </div>
                  <span>{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          {serverError && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 font-mono text-xs text-red-700 flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-heading text-xs font-bold uppercase tracking-wider bg-[#0A1128] text-white hover:bg-[#1E293B] shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2"
          >
            <span>{submitting ? "Minting Assessment Pass…" : "Register Candidate Pass"}</span>
            <ArrowRight size={15} className="text-[#C5A059]" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#0A1128]/8 text-center">
          <p className="text-xs text-slate-500">
            Already registered?{" "}
            <Link
              to="/login"
              className="text-[#0A1128] font-bold hover:text-[#C5A059] transition-colors"
            >
              Sign in to Candidate Dossier →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
