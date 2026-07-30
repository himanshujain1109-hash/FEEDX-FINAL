import { useEffect, useState } from "react";
import api from "../api/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [tab, setTab] = useState("restaurants");
  const [busyId, setBusyId] = useState(null);

  const loadAll = async () => {
    const [statsRes, restRes, ngoRes] = await Promise.all([
      api.get("/admin/dashboard"),
      api.get("/admin/restaurants", { params: { verified: false } }),
      api.get("/admin/ngos", { params: { verified: false } }),
    ]);
    setStats(statsRes.data.stats);
    setRestaurants(restRes.data.restaurants);
    setNgos(ngoRes.data.ngos);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const verifyRestaurant = async (id) => {
    setBusyId(id);
    try {
      await api.put(`/admin/restaurants/${id}/verify`);
      await loadAll();
    } finally {
      setBusyId(null);
    }
  };

  const verifyNgo = async (id) => {
    setBusyId(id);
    try {
      await api.put(`/admin/ngos/${id}/verify`);
      await loadAll();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">Admin dashboard</h1>
      <p className="mt-1 text-ink/60">Verify accounts and monitor the platform.</p>

      {stats && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["Restaurants", stats.totalRestaurants],
            ["Verified", stats.verifiedRestaurants],
            ["NGOs", stats.totalNgos],
            ["Verified NGOs", stats.verifiedNgos],
            ["Listings", stats.totalFoodListings],
            ["Meals saved", stats.totalMealsSaved],
          ].map(([label, value]) => (
            <div key={label} className="card">
              <p className="font-display text-2xl font-semibold text-canopy-600">{value}</p>
              <p className="text-xs text-ink/60">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 flex gap-2 border-b border-mint">
        {["restaurants", "ngos"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold capitalize ${
              tab === t ? "border-b-2 border-canopy text-canopy" : "text-ink/50"
            }`}
          >
            Pending {t === "restaurants" ? `restaurants (${restaurants.length})` : `NGOs (${ngos.length})`}
          </button>
        ))}
      </div>

      {tab === "restaurants" && (
        <div className="mt-6 flex flex-col gap-4">
          {restaurants.length === 0 ? (
            <div className="rounded-xl2 border border-dashed border-mint p-10 text-center text-ink/60">
              No restaurants awaiting verification.
            </div>
          ) : (
            restaurants.map((r) => (
              <div key={r._id} className="card flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-display font-semibold text-ink">{r.restaurantName}</p>
                  <p className="text-sm text-ink/60">{r.user?.name} · {r.user?.email} · {r.user?.phone}</p>
                </div>
                <button
                  disabled={busyId === r._id}
                  onClick={() => verifyRestaurant(r._id)}
                  className="btn-primary !px-4 !py-2 text-sm"
                >
                  Verify
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "ngos" && (
        <div className="mt-6 flex flex-col gap-4">
          {ngos.length === 0 ? (
            <div className="rounded-xl2 border border-dashed border-mint p-10 text-center text-ink/60">
              No NGOs awaiting verification.
            </div>
          ) : (
            ngos.map((n) => (
              <div key={n._id} className="card flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-display font-semibold text-ink">{n.organizationName}</p>
                  <p className="text-sm text-ink/60">{n.user?.name} · {n.user?.email} · {n.user?.phone}</p>
                </div>
                <button
                  disabled={busyId === n._id}
                  onClick={() => verifyNgo(n._id)}
                  className="btn-primary !px-4 !py-2 text-sm"
                >
                  Verify
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
