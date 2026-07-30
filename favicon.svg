import { useEffect, useState } from "react";
import api from "../api/client";
import FoodCard from "../components/FoodCard";
import ChatPanel from "../components/ChatPanel";
import socket from "../socket";
import { useAuth } from "../context/AuthContext";

export default function ReceiverDashboard() {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [requests, setRequests] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [tab, setTab] = useState("nearby");
  const [busyId, setBusyId] = useState(null);
  const [codeInput, setCodeInput] = useState({});
  const [chatRequest, setChatRequest] = useState(null);

  const loadAll = async () => {
    const [foodsRes, reqRes, analyticsRes] = await Promise.all([
      api.get("/food", { params: { status: "available" } }),
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

  // Live refresh: donor accepting, marking out for delivery, etc. should show
  // up here immediately, same as a delivery app tracking screen.
  useEffect(() => {
    socket.on("request_updated", loadAll);
    socket.on("chat_message", loadAll);
    return () => {
      socket.off("request_updated", loadAll);
      socket.off("chat_message", loadAll);
    };
  }, []);

  useEffect(() => {
    if (!chatRequest) return;
    const fresh = requests.find((r) => r._id === chatRequest._id);
    if (fresh) setChatRequest(fresh);
  }, [requests]); // eslint-disable-line react-hooks/exhaustive-deps

  const complete = async (requestId) => {
    setBusyId(requestId);
    try {
      await api.put(`/requests/${requestId}/complete`, { code: codeInput[requestId] || "" });
      await loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Could not confirm pickup");
    } finally {
      setBusyId(null);
    }
  };

  const cancel = async (requestId) => {
    setBusyId(requestId);
    try {
      await api.put(`/requests/${requestId}/cancel`);
      await loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Could not cancel request");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">Receiver dashboard</h1>
      <p className="mt-1 text-ink/60">
        {user?.verified ? "Your organization is verified — you can request food." : "Your account is pending admin verification."}
      </p>

      {analytics && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="card">
            <p className="font-display text-3xl font-semibold text-canopy-600">{analytics.totalReceived}</p>
            <p className="text-sm text-ink/60">Pickups completed</p>
          </div>
          <div className="card">
            <p className="font-display text-3xl font-semibold text-canopy-600">{analytics.totalPeopleFed}</p>
            <p className="text-sm text-ink/60">Meals received</p>
          </div>
        </div>
      )}

      <div className="mt-10 flex gap-2 border-b border-mint">
        {["nearby", "requests"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold capitalize ${
              tab === t ? "border-b-2 border-canopy text-canopy" : "text-ink/50"
            }`}
          >
            {t === "nearby" ? "Nearby food" : "My requests"}
          </button>
        ))}
      </div>

      {tab === "nearby" && (
        <div className="mt-6">
          {foods.length === 0 ? (
            <div className="rounded-xl2 border border-dashed border-mint p-10 text-center text-ink/60">
              No available food right now. Check back soon.
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
              You haven't requested any food yet.
            </div>
          ) : (
            requests.map((r) => (
              <div key={r._id} className="card flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-display font-semibold text-ink">{r.food?.title}</p>
                  <p className="text-sm text-ink/60">
                    From {r.restaurant?.restaurantName} · <span className="capitalize">{r.status}</span>
                  </p>
                  {r.status === "accepted" && r.food?.address && (
                    <p className="mt-1 text-sm text-ink/70">Pickup address: {r.food.address}</p>
                  )}
                </div>
                {r.status === "accepted" && (
                  <div className="flex items-center gap-2">
                    <input
                      className="input-field !w-36 text-sm"
                      placeholder="Confirmation code"
                      value={codeInput[r._id] || ""}
                      onChange={(e) => setCodeInput({ ...codeInput, [r._id]: e.target.value })}
                    />
                    <button
                      disabled={busyId === r._id}
                      onClick={() => complete(r._id)}
                      className="btn-primary !px-4 !py-2 text-sm"
                    >
                      Confirm pickup
                    </button>
                  </div>
                )}
                {["pending", "accepted"].includes(r.status) && (
                  <button
                    disabled={busyId === r._id}
                    onClick={() => cancel(r._id)}
                    className="btn-secondary !px-4 !py-2 text-sm"
                  >
                    Cancel
                  </button>
                )}
                {!["rejected", "cancelled"].includes(r.status) && (
                  <button
                    onClick={() => setChatRequest(r)}
                    className="btn-secondary !px-4 !py-2 text-sm"
                  >
                    Chat
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {chatRequest && <ChatPanel request={chatRequest} onClose={() => setChatRequest(null)} />}
    </div>
  );
}
