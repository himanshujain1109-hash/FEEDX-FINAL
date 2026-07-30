import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

const initialForm = {
  title: "",
  category: "Other",
  description: "",
  quantity: "",
  unit: "plates",
  foodType: "veg",
  preparedTime: "",
  expiryTime: "",
  pickupStart: "",
  pickupEnd: "",
  address: "",
  latitude: "",
  longitude: "",
};

export default function AddFood() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((f) => ({
        ...f,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (photo) data.append("photo", photo);

      await api.post("/food", data, { headers: { "Content-Type": "multipart/form-data" } });
      navigate("/donor");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">List surplus food</h1>
      <p className="mt-2 text-ink/60">Fill in the details — nearby verified NGOs will be notified instantly.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {error && <p className="rounded-lg bg-signal/10 px-4 py-3 text-sm text-signal-600">{error}</p>}

        <div>
          <label className="mb-1 block text-sm font-medium text-ink/70">Food title</label>
          <input required className="input-field" value={form.title} onChange={update("title")} placeholder="e.g. Vegetable Biryani" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">Category</label>
            <input className="input-field" value={form.category} onChange={update("category")} placeholder="Rice, Bread, Curry..." />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">Food type</label>
            <select className="input-field" value={form.foodType} onChange={update("foodType")}>
              <option value="veg">Veg</option>
              <option value="non-veg">Non-veg</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">Quantity</label>
            <input required type="number" min="1" className="input-field" value={form.quantity} onChange={update("quantity")} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">Unit</label>
            <select className="input-field" value={form.unit} onChange={update("unit")}>
              <option value="plates">Plates</option>
              <option value="kg">Kg</option>
              <option value="packets">Packets</option>
              <option value="liters">Liters</option>
              <option value="pieces">Pieces</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink/70">Description (optional)</label>
          <textarea className="input-field" rows={3} value={form.description} onChange={update("description")} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">Prepared at</label>
            <input required type="datetime-local" className="input-field" value={form.preparedTime} onChange={update("preparedTime")} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">Expires at</label>
            <input required type="datetime-local" className="input-field" value={form.expiryTime} onChange={update("expiryTime")} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">Pickup window start</label>
            <input required type="datetime-local" className="input-field" value={form.pickupStart} onChange={update("pickupStart")} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">Pickup window end</label>
            <input required type="datetime-local" className="input-field" value={form.pickupEnd} onChange={update("pickupEnd")} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink/70">Pickup address</label>
          <input className="input-field" value={form.address} onChange={update("address")} />
        </div>

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-ink/70">Location</label>
            <p className="text-xs text-ink/50">
              {form.latitude && form.longitude ? `${Number(form.latitude).toFixed(4)}, ${Number(form.longitude).toFixed(4)}` : "Not set"}
            </p>
          </div>
          <button type="button" onClick={useMyLocation} className="btn-secondary !px-4 !py-2 text-sm">
            Use my location
          </button>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink/70">Photo (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} className="text-sm" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? "Publishing..." : "Publish listing"}
        </button>
      </form>
    </div>
  );
}
