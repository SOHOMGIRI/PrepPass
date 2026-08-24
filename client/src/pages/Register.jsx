import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import RippleButton from "../components/ui/RippleButton.jsx";

const INPUT_CLASS = "w-full rounded-t-md border-b-2 border-white/10 bg-stamp-navy/5 px-4 py-3 text-text-secondary placeholder-white/40 transition-colors focus:outline-none focus:bg-stamp-navy/10 focus:border-gold disabled:cursor-not-allowed disabled:opacity-60";
const INPUT_ERR_CLASS = "w-full rounded-t-md border-b-2 border-gold bg-gold/5 px-4 py-3 text-text-secondary placeholder-white/40 transition-colors focus:outline-none focus:bg-gold/10 focus:border-gold disabled:cursor-not-allowed disabled:opacity-60";

const PASSWORD_REQS = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Contains at least one letter", test: (p) => /[A-Za-z]/.test(p) },
  { label: "Contains at least one number", test: (p) => /\d/.test(p) },
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
    if (!values.name.trim()) e.name = "Name is required";
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
        err?.response?.data?.message || "Could not register. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const pwdValid = (rule) =>
    values.password.length >= 8 && rule.test(values.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="ticket-card w-full max-w-md p-8">
        <div className="ticket-stamp inline-block px-3 py-1 rounded text-text-primary font-mono text-xs mb-6">
          PREPPASS — NEW ADMIT CARD
        </div>
        <h1 className="text-2xl font-heading text-text-primary mb-1">
          Create your account.
        </h1>
        <p className="text-text-secondary/60 text-sm mb-6">
          Register to get your personalized exam passport.
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block font-mono text-xs font-semibold tracking-wider text-text-primary/70 mb-1.5 uppercase">
              Full Name
            </label>
            <input
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              value={values.name}
              onChange={onChange("name")}
              disabled={submitting}
              className={errors.name ? INPUT_ERR_CLASS : INPUT_CLASS}
            />
            {errors.name && (
              <p className="text-white text-xs mt-1 font-mono">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block font-mono text-xs font-semibold tracking-wider text-text-primary/70 mb-1.5 uppercase">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={onChange("email")}
              disabled={submitting}
              className={errors.email ? INPUT_ERR_CLASS : INPUT_CLASS}
            />
            {errors.email && (
              <p className="text-white text-xs mt-1 font-mono">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block font-mono text-xs font-semibold tracking-wider text-text-primary/70 mb-1.5 uppercase">
              Password
            </label>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={values.password}
              onChange={onChange("password")}
              disabled={submitting}
              className={errors.password ? INPUT_ERR_CLASS : INPUT_CLASS}
            />
            <ul className="mt-2 space-y-1 text-xs text-text-secondary/60">
              {PASSWORD_REQS.map((r) => {
                const ok = pwdValid(r);
                return (
                  <li key={r.label} className="flex items-center gap-2">
                    <span className={ok ? "text-white" : "text-text-secondary/30"}>
                      {ok ? "✓" : "○"}
                    </span>
                    <span className="font-mono">{r.label}</span>
                  </li>
                );
              })}
            </ul>
            {errors.password && (
              <p className="text-white text-xs mt-1 font-mono">{errors.password}</p>
            )}
          </div>

          {serverError && (
            <p className="text-white text-xs font-mono">{serverError}</p>
          )}

          <RippleButton type="submit" disabled={submitting} className="w-full py-3.5 bg-gold text-[#0B0A14] hover:bg-gold-dark">{submitting ? "Creating account..." : "Create Account"}</RippleButton>
        </form>

        <p className="mt-6 text-sm text-center text-text-secondary/70">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-text-primary font-medium hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

