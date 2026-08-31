import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Feather, LogIn } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.identifier, form.password);
      showToast("Welcome back!");
      navigate(location.state?.from?.pathname || "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm animate-fadeUp">
        <div className="flex flex-col items-center mb-8">
          <span className="w-11 h-11 rounded-full bg-spine-600 flex items-center justify-center mb-3">
            <Feather size={20} className="text-white" />
          </span>
          <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-ink/55 dark:text-ink-light/55 mt-1">Log in to continue writing.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 bg-white dark:bg-paper-darksoft border border-ink/8 dark:border-white/8 rounded-2xl p-6 shadow-card">
          {error && <p className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}
          <Input label="Email or Username" value={form.identifier} onChange={(e) => setForm((f) => ({ ...f, identifier: e.target.value }))} placeholder="you@example.com" required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="••••••••" required />
          <Button type="submit" className="w-full" loading={loading}>
            <LogIn size={15} /> Log In
          </Button>
        </form>

        <p className="text-center text-sm text-ink/55 dark:text-ink-light/55 mt-6">
          Don't have an account? <Link to="/register" className="text-spine-600 dark:text-spine-300 font-medium">Register</Link>
        </p>
        <p className="text-center text-xs text-ink/35 dark:text-ink-light/35 mt-4 font-mono">
          Demo: demo@blogsphere.com / demo1234
        </p>
      </div>
    </div>
  );
};

export default Login;
