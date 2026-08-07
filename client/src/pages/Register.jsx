import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const INPUT_CLASS =
  "w-full rounded-lg border border-ink/20 bg-white px-4 py-3 text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-stamp-navy/30 focus:border-stamp-navy disabled:cursor-not-allowed disabled:opacity-60";
const INPUT_ERR_CLASS = `${INPUT_CLASS} border-gold focus:border-gold focus:ring-gold/50`;

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
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="ticket-card w-full max-w-md p-8">
        <div className="ticket-stamp inline-block px-3 py-1 rounded text-stamp-navy font-mono text-xs mb-6">
          PREPPASS — NEW ADMIT CARD
        </div>
        <h1 className="text-2xl font-heading text-stamp-navy mb-1">
          Create your account.
        </h1>
        <p className="text-ink/60 text-sm mb-6">
          Register to get your personalized exam passport.
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block font-mono text-xs text-stamp-navy/70 mb-1">
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
              <p className="text-gold text-xs mt-1 font-mono">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block font-mono text-xs text-stamp-navy/70 mb-1">
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
              <p className="text-gold text-xs mt-1 font-mono">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block font-mono text-xs text-stamp-navy/70 mb-1">
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
            <ul className="mt-2 space-y-1 text-xs text-ink/60">
              {PASSWORD_REQS.map((r) => {
                const ok = pwdValid(r);
                return (
                  <li key={r.label} className="flex items-center gap-2">
                    <span className={ok ? "text-gold" : "text-ink/30"}>
                      {ok ? "✓" : "○"}
                    </span>
                    <span className="font-mono">{r.label}</span>
                  </li>
                );
              })}
            </ul>
            {errors.password && (
              <p className="text-gold text-xs mt-1 font-mono">{errors.password}</p>
            )}
          </div>

          {serverError && (
            <p className="text-gold text-xs font-mono">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-lg font-semibold text-white bg-stamp-navy hover:bg-stamp-navy/90 focus:outline-none focus:ring-2 focus:ring-stamp-navy/50 focus:ring-offset-2 w-full py-3"
          >
            {submitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-ink/70">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-stamp-navy font-medium hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
