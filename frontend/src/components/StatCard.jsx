export default function StatCard({ value, label, accentClass = "text-leaf-light" }) {
  return (
    <div className="border border-white/10 rounded-xl px-5 py-4 bg-canopy/60">
      <div className={`font-display text-3xl ${accentClass}`}>{value}</div>
      <div className="text-xs text-mist mt-1 font-mono uppercase tracking-wide">{label}</div>
    </div>
  );
}
