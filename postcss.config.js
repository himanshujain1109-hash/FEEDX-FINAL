import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const path = user.role === "donor" ? "/donor" : user.role === "receiver" ? "/receiver" : "/admin";
      navigate(path);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Welcome back</h1>
      <p className="mt-2 text-ink/60">Log in to manage donations or pickups.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {error && <p className="rounded-lg bg-signal/10 px-4 py-3 text-sm text-signal-600">{error}</p>}
        <div>
          <label className="mb-1 block text-sm font-medium text-ink/70">Email</label>
          <input
            type="email"
            required
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink/70">Password</label>
          <input
            type="password"
            required
            className="input-field"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-canopy hover:underline">
          Register here
        </Link>
      </p>

      <div className="mt-8 rounded-lg border border-mint bg-canopy-50 p-4 text-xs text-ink/60">
        <p className="font-semibold text-canopy-600">Demo accounts (after running the seed script)</p>
        <p className="mt-1 font-mono">admin@feedx.ai / admin123</p>
        <p className="font-mono">donor@demo.com / demo1234</p>
        <p className="font-mono">ngo@demo.com / demo1234</p>
      </div>
    </div>
  );
}
