import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import RippleButton from "../components/ui/RippleButton.jsx";

const INPUT_CLASS =
  "w-full rounded-t-md border-b-2 border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition-colors focus:outline-none focus:bg-white/10 focus:border-gold disabled:cursor-not-allowed disabled:opacity-60";
const INPUT_ERROR_CLASS =
  "w-full rounded-t-md border-b-2 border-gold bg-red-500/10 px-4 py-3 text-white placeholder-white/40 transition-colors focus:outline-none focus:bg-gold/10 focus:border-gold disabled:cursor-not-allowed disabled:opacity-60";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!values.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(values.email))
      e.email = "Enter a valid email address";
    if (!values.password) e.password = "Password is required";
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
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(
        err?.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="ticket-card w-full max-w-md p-8">
        <div className="ticket-stamp inline-block px-3 py-1 rounded text-text-primary font-mono text-xs mb-6 border border-white/10">
          PREPPASS — ADMIT CARD LOGIN
        </div>
        <h1 className="text-2xl font-heading text-text-primary mb-1">
          Welcome back.
        </h1>
        <p className="text-text-secondary/60 text-sm mb-6">
          Sign in to continue your prep.
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
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
              className={errors.email ? INPUT_ERROR_CLASS : INPUT_CLASS}
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
              autoComplete="current-password"
              placeholder="••••••••"
              value={values.password}
              onChange={onChange("password")}
              disabled={submitting}
              className={errors.password ? INPUT_ERROR_CLASS : INPUT_CLASS}
            />
            {errors.password && (
              <p className="text-white text-xs mt-1 font-mono">{errors.password}</p>
            )}
          </div>

          {serverError && (
            <p className="text-white text-xs font-mono">{serverError}</p>
          )}

          <RippleButton
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gold text-[#0B0A14] hover:bg-gold-dark"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </RippleButton>
        </form>

        <p className="mt-6 text-sm text-center text-text-secondary/70">
          No account?{" "}
          <Link
            to="/register"
            className="text-text-primary font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

