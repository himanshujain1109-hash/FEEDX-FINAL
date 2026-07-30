import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  role: "donor",
  name: "",
  email: "",
  phone: "",
  password: "",
  address: "",
  restaurantName: "",
  licenseNumber: "",
  organizationName: "",
  registrationNumber: "",
  capacity: "",
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === "donor" ? "/donor" : "/receiver");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-lg flex-col px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Create your account</h1>
      <p className="mt-2 text-ink/60">Register as a donor or a receiving organization.</p>

      <div className="mt-6 flex gap-2 rounded-full bg-canopy-50 p-1">
        {["donor", "receiver"].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setForm({ ...form, role: r })}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
              form.role === r ? "bg-canopy text-paper" : "text-canopy-600"
            }`}
          >
            {r === "donor" ? "I'm a restaurant / hotel" : "I'm an NGO / receiver"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {error && <p className="rounded-lg bg-signal/10 px-4 py-3 text-sm text-signal-600">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">Your name</label>
            <input required className="input-field" value={form.name} onChange={update("name")} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">Phone</label>
            <input required className="input-field" value={form.phone} onChange={update("phone")} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink/70">Email</label>
          <input type="email" required className="input-field" value={form.email} onChange={update("email")} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink/70">Password</label>
          <input
            type="password"
            required
            minLength={6}
            className="input-field"
            value={form.password}
            onChange={update("password")}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink/70">Address</label>
          <input className="input-field" value={form.address} onChange={update("address")} />
        </div>

        {form.role === "donor" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/70">Restaurant / hotel name</label>
              <input required className="input-field" value={form.restaurantName} onChange={update("restaurantName")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/70">License number (optional)</label>
              <input className="input-field" value={form.licenseNumber} onChange={update("licenseNumber")} />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/70">Organization name</label>
              <input required className="input-field" value={form.organizationName} onChange={update("organizationName")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/70">Registration number (optional)</label>
              <input className="input-field" value={form.registrationNumber} onChange={update("registrationNumber")} />
            </div>
          </div>
        )}

        <p className="text-xs text-ink/50">
          After registering, an admin needs to verify your account before you can list or request food.
        </p>

        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-canopy hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
