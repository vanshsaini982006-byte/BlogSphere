import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Feather, UserPlus } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Register = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (form.username.trim().length < 3) errs.username = "At least 3 characters";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (form.password.length < 6) errs.password = "At least 6 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      showToast("Account created! Welcome to BlogSphere.");
      navigate("/dashboard");
    } catch (err) {
      setErrors({ form: err.response?.data?.message || "Registration failed" });
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
          <h1 className="font-display text-2xl font-semibold">Join BlogSphere</h1>
          <p className="text-sm text-ink/55 dark:text-ink-light/55 mt-1">Create an account to start writing.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 bg-white dark:bg-paper-darksoft border border-ink/8 dark:border-white/8 rounded-2xl p-6 shadow-card">
          {errors.form && <p className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2">{errors.form}</p>}
          <Input label="Full Name" value={form.name} onChange={onChange("name")} error={errors.name} placeholder="Jane Doe" />
          <Input label="Username" value={form.username} onChange={onChange("username")} error={errors.username} placeholder="janedoe" />
          <Input label="Email" type="email" value={form.email} onChange={onChange("email")} error={errors.email} placeholder="you@example.com" />
          <Input label="Password" type="password" value={form.password} onChange={onChange("password")} error={errors.password} placeholder="••••••••" />
          <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={onChange("confirmPassword")} error={errors.confirmPassword} placeholder="••••••••" />
          <Button type="submit" className="w-full" loading={loading}>
            <UserPlus size={15} /> Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-ink/55 dark:text-ink-light/55 mt-6">
          Already have an account? <Link to="/login" className="text-spine-600 dark:text-spine-300 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
