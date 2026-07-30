import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import FoodCard from "../components/FoodCard";
import { useAuth } from "../context/AuthContext";

export default function DonorDashboard() {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [requests, setRequests] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [tab, setTab] = useState("listings");
  const [busyId, setBusyId] = useState(null);

  const loadAll = async () => {
    const [foodsRes, reqRes, analyticsRes] = await Promise.all([
      api.get("/food/my/listings"),
      api.get("/requests"),
      api.get("/users/analytics"),
    ]);
    setFoods(foodsRes.data.foods);
    setRequests(reqRes.data.requests);
    setAnalytics(analyticsRes.data.analytics);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const act = async (requestId, action) => {
    setBusyId(requestId);
    try {
      await api.put(`/requests/${requestId}/${action}`);
      await loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Donor dashboard</h1>
          <p className="mt-1 text-ink/60">
            {user?.verified ? "Your account is verified — you're good to go." : "Your account is pending admin verification."}
          </p>
        </div>
        <Link to="/donor/add-food" className="btn-primary">
          + List surplus food
        </Link>
      </div>

      {analytics && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="card">
            <p className="font-display text-3xl font-semibold text-canopy-600">{analytics.totalDonations}</p>
            <p className="text-sm text-ink/60">Completed donations</p>
          </div>
          <div className="card">
            <p className="font-display text-3xl font-semibold text-canopy-600">{analytics.totalMealsSaved}</p>
            <p className="text-sm text-ink/60">Meals saved</p>
          </div>
          <div className="card">
            <p className="font-display text-3xl font-semibold text-canopy-600">{analytics.co2SavedKg} kg</p>
            <p className="text-sm text-ink/60">CO₂ avoided</p>
          </div>
        </div>
      )}

      <div className="mt-10 flex gap-2 border-b border-mint">
        {["listings", "requests"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold capitalize ${
              tab === t ? "border-b-2 border-canopy text-canopy" : "text-ink/50"
            }`}
          >
            {t === "requests" ? `Requests${pendingRequests.length ? ` (${pendingRequests.length})` : ""}` : "My listings"}
          </button>
        ))}
      </div>

      {tab === "listings" && (
        <div className="mt-6">
          {foods.length === 0 ? (
            <div className="rounded-xl2 border border-dashed border-mint p-10 text-center text-ink/60">
              You haven't listed any surplus food yet.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {foods.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "requests" && (
        <div className="mt-6 flex flex-col gap-4">
          {requests.length === 0 ? (
            <div className="rounded-xl2 border border-dashed border-mint p-10 text-center text-ink/60">
              No requests yet.
            </div>
          ) : (
            requests.map((r) => (
              <div key={r._id} className="card flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-display font-semibold text-ink">{r.food?.title}</p>
                  <p className="text-sm text-ink/60">
                    Requested by {r.ngo?.organizationName} · <span className="capitalize">{r.status}</span>
                  </p>
                  {r.status === "accepted" && r.qrCode && (
                    <p className="mt-1 font-mono text-xs text-canopy-600">Confirmation code: {r.qrCode}</p>
                  )}
                </div>
                {r.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      disabled={busyId === r._id}
                      onClick={() => act(r._id, "accept")}
                      className="btn-primary !px-4 !py-2 text-sm"
                    >
                      Accept
                    </button>
                    <button
                      disabled={busyId === r._id}
                      onClick={() => act(r._id, "reject")}
                      className="btn-secondary !px-4 !py-2 text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
