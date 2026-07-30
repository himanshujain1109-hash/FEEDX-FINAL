import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import FreshnessRing from "../components/FreshnessRing";
import api from "../api/client";

const STEPS = [
  {
    tag: "Prepare",
    title: "Restaurant lists surplus food",
    body: "Photo, quantity, prepared time, and expiry window — takes under a minute.",
  },
  {
    tag: "Match",
    title: "Nearby needy organizations get notified",
    body: "Only organizations within range and open capacity see the alert, ranked by distance and urgency.",
  },
  {
    tag: "Confirm",
    title: "Needy organization requests, donor accepts",
    body: "A confirmation code locks in the pickup slot and closes out competing requests automatically.",
  },
  {
    tag: "Rescue",
    title: "Pickup, scan, done",
    body: "The needy organization confirms at pickup. Meals saved and people fed update instantly.",
  },
];

export default function Landing() {
  const [demoFraction, setDemoFraction] = useState(0.82);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      setDemoFraction((f) => (f <= 0.05 ? 0.95 : f - 0.015));
    }, 400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let active = true;
    api
      .get("/stats/public")
      .then((res) => {
        if (active) setStats(res.data.stats);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const mealsSaved = stats ? stats.totalMealsSaved.toLocaleString() : "—";
  const verifiedOrgs = stats ? stats.verifiedNgos.toLocaleString() : "—";

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-canopy-700">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div className="animate-floatUp">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-mango">
              Surplus food, redistributed in minutes
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
              Every plate has a<br />
              <span className="text-mango">second chance.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-paper/80">
              FeedX connects restaurants and hotels with verified NGOs the moment food is
              still good — not after it's gone to waste.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register" className="btn-accent">
                List surplus food
              </Link>
              <Link to="/browse" className="btn-secondary !border-paper !text-paper hover:!bg-paper hover:!text-canopy-700">
                Find food nearby
              </Link>
            </div>
          </div>

          <div className="animate-floatUp rounded-xl2 border border-canopy-400 bg-canopy-600 p-8" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-paper/50">Live listing</span>
              <span className="badge bg-mango/20 text-mango">available</span>
            </div>
            <div className="mt-6 flex items-center gap-5">
              <FreshnessRing fraction={demoFraction} size={88} />
              <div>
                <p className="font-display text-xl font-semibold text-paper">Vegetable Biryani</p>
                <p className="font-mono text-sm text-paper/60">25 plates · 1.4 km away</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-canopy-400 pt-6 text-center">
              <div>
                <p className="font-display text-2xl font-semibold text-mango">{mealsSaved}</p>
                <p className="text-xs text-paper/60">meals saved</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-mango">{verifiedOrgs}</p>
                <p className="text-xs text-paper/60">organizations active</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold text-ink">How a rescue happens</h2>
        <p className="mt-2 max-w-xl text-ink/60">
          The same four steps, every time — designed so nothing sits around waiting.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.tag} className="card animate-floatUp" style={{ animationDelay: `${i * 0.08}s` }}>
              <p className="font-mono text-xs uppercase tracking-widest text-mango-600">{step.tag}</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm text-ink/60">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="bg-canopy-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-3xl font-semibold text-ink">Built for three kinds of people</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="card">
              <h3 className="font-display text-lg font-semibold text-canopy-600">Restaurants &amp; hotels</h3>
              <p className="mt-2 text-sm text-ink/60">
                List surplus in under a minute, track every donation, and see your impact add up.
              </p>
              <Link to="/register" className="mt-4 inline-block text-sm font-semibold text-canopy hover:underline">
                Register as a donor →
              </Link>
            </div>
            <div className="card">
              <h3 className="font-display text-lg font-semibold text-canopy-600">NGOs &amp; food banks</h3>
              <p className="mt-2 text-sm text-ink/60">
                See what's available nearby, request it, and confirm pickup with a single code.
              </p>
              <Link to="/register" className="mt-4 inline-block text-sm font-semibold text-canopy hover:underline">
                Register as a receiver →
              </Link>
            </div>
            <div className="card">
              <h3 className="font-display text-lg font-semibold text-canopy-600">Admins</h3>
              <p className="mt-2 text-sm text-ink/60">
                Verify every restaurant and NGO before they can transact, and watch donations happen live.
              </p>
              <Link to="/login" className="mt-4 inline-block text-sm font-semibold text-canopy hover:underline">
                Admin sign in →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-semibold text-ink">Small pickups, real impact</h2>
        <p className="mx-auto mt-2 max-w-xl text-ink/60">
          Every completed request updates these numbers in real time across the platform.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="card">
            <p className="font-display text-4xl font-semibold text-signal-600">{mealsSaved}</p>
            <p className="mt-1 text-sm text-ink/60">Meals rescued</p>
          </div>
          <div className="card">
            <p className="font-display text-4xl font-semibold text-signal-600">{verifiedOrgs}</p>
            <p className="mt-1 text-sm text-ink/60">Verified needy organizations</p>
          </div>
        </div>
      </section>
    </div>
  );
}
