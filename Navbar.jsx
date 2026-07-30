import { Link } from "react-router-dom";
import FreshnessRing from "./FreshnessRing";

const STATUS_STYLES = {
  available: "bg-canopy-50 text-canopy-600",
  requested: "bg-mango/20 text-mango-600",
  reserved: "bg-mango/30 text-mango-600",
  picked: "bg-canopy-100 text-canopy-600",
  completed: "bg-canopy-100 text-canopy-600",
  expired: "bg-signal/10 text-signal-600",
  cancelled: "bg-ink/10 text-ink/50",
};

function freshnessFraction(prepared, expiry) {
  const now = Date.now();
  const total = new Date(expiry).getTime() - new Date(prepared).getTime();
  const remaining = new Date(expiry).getTime() - now;
  if (total <= 0) return 0;
  return Math.max(0, Math.min(1, remaining / total));
}

function timeLeftLabel(expiry) {
  const ms = new Date(expiry).getTime() - Date.now();
  if (ms <= 0) return "Expired";
  const hrs = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  return hrs > 0 ? `${hrs}h ${mins}m left` : `${mins}m left`;
}

export default function FoodCard({ food }) {
  const fraction = freshnessFraction(food.preparedTime, food.expiryTime);

  return (
    <Link
      to={`/food/${food._id}`}
      className="card group flex flex-col gap-4 transition hover:-translate-y-0.5 hover:shadow-md animate-floatUp"
    >
      {food.photo ? (
        <img
          src={food.photo}
          alt={food.title}
          className="h-40 w-full rounded-xl2 object-cover"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center rounded-xl2 bg-canopy-50 text-sm text-ink/40">
          No photo
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink group-hover:text-canopy">{food.title}</h3>
          <p className="text-sm text-ink/60">{food.restaurant?.restaurantName}</p>
        </div>
        <span className={`badge shrink-0 ${STATUS_STYLES[food.status] || "bg-ink/10"}`}>{food.status}</span>
      </div>

      <div className="flex items-center justify-between">
        <FreshnessRing fraction={fraction} size={56} sublabel={timeLeftLabel(food.expiryTime)} />
        <div className="text-right">
          <p className="font-display text-xl font-semibold text-ink">
            {food.quantity} <span className="text-sm font-normal text-ink/60">{food.unit}</span>
          </p>
          <p className="text-xs uppercase tracking-wide text-ink/50">{food.foodType}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-ink/60">
        <span>{food.category}</span>
        {typeof food.distanceKm === "number" && <span>{food.distanceKm} km away</span>}
      </div>
    </Link>
  );
}
