// The Freshness Ring is FeedX's signature visual: a circular gauge
// showing how much of a food listing's safe window remains, from prepared -> expiry.
// fraction: 1 = just prepared, 0 = expiring now.
export default function FreshnessRing({ fraction = 1, size = 72, label, sublabel }) {
  const clamped = Math.max(0, Math.min(1, fraction));
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);

  const color = clamped > 0.5 ? "#F2A93B" : clamped > 0.2 ? "#E8862F" : "#E85C4A";

  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#CFE0D5" strokeWidth="6" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.6s ease" }}
        />
      </svg>
      {(label || sublabel) && (
        <div className="leading-tight">
          {label && <p className="font-display text-sm font-semibold text-ink">{label}</p>}
          {sublabel && <p className="font-mono text-xs text-ink/60">{sublabel}</p>}
        </div>
      )}
    </div>
  );
}
