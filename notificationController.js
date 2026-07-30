import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import FreshnessRing from "../components/FreshnessRing";

export default function FoodDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [freshness, setFreshness] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    api.get(`/food/${id}`).then((res) => {
      setFood(res.data.food);
      setFreshness(res.data.freshness);
    });
  }, [id]);

  const handleRequest = async () => {
    setError("");
    setSuccess("");
    setRequesting(true);
    try {
      await api.post("/requests", { foodId: id });
      setSuccess("Request sent! You'll be notified when the donor responds.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not send request.");
    } finally {
      setRequesting(false);
    }
  };

  if (!food) return <div className="mx-auto max-w-3xl px-6 py-16 text-ink/60">Loading...</div>;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <button onClick={() => navigate(-1)} className="text-sm text-canopy hover:underline">
        ← Back
      </button>

      <div className="card mt-4">
        {food.photo && (
          <img
            src={food.photo}
            alt={food.title}
            className="mb-6 h-64 w-full rounded-xl2 object-cover"
          />
        )}

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink">{food.title}</h1>
            <p className="mt-1 text-ink/60">{food.restaurant?.restaurantName}</p>
          </div>
          <span className="badge bg-canopy-50 text-canopy-600">{food.status}</span>
        </div>

        <div className="mt-6 flex items-center gap-4 rounded-xl2 bg-canopy-50 p-4">
          <FreshnessRing fraction={freshness} size={64} />
          <div className="text-sm text-ink/70">
            <p>Prepared: {new Date(food.preparedTime).toLocaleString()}</p>
            <p>Expires: {new Date(food.expiryTime).toLocaleString()}</p>
            <p>Pickup window: {new Date(food.pickupStart).toLocaleTimeString()} – {new Date(food.pickupEnd).toLocaleTimeString()}</p>
          </div>
        </div>

        {food.description && <p className="mt-6 text-ink/80">{food.description}</p>}

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-ink/50">Quantity</p>
            <p className="font-semibold text-ink">{food.quantity} {food.unit}</p>
          </div>
          <div>
            <p className="text-ink/50">Type</p>
            <p className="font-semibold text-ink capitalize">{food.foodType}</p>
          </div>
          <div>
            <p className="text-ink/50">Category</p>
            <p className="font-semibold text-ink">{food.category}</p>
          </div>
          <div>
            <p className="text-ink/50">Pickup address</p>
            <p className="font-semibold text-ink">{food.address || "—"}</p>
          </div>
        </div>

        {error && <p className="mt-4 rounded-lg bg-signal/10 px-4 py-3 text-sm text-signal-600">{error}</p>}
        {success && <p className="mt-4 rounded-lg bg-canopy-50 px-4 py-3 text-sm text-canopy-600">{success}</p>}

        <div className="mt-8">
          {!user && (
            <p className="text-sm text-ink/60">
              <a href="/login" className="font-semibold text-canopy hover:underline">Log in</a> as an NGO to request this food.
            </p>
          )}
          {user?.role === "receiver" && food.status === "available" && (
            <button onClick={handleRequest} disabled={requesting} className="btn-primary">
              {requesting ? "Sending request..." : "Request this food"}
            </button>
          )}
          {user?.role === "donor" && (
            <p className="text-sm text-ink/60">This is one of your own listings — manage it from your dashboard.</p>
          )}
        </div>
      </div>
    </div>
  );
}
