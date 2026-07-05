export default function ConfidenceBarChart({ detections = [] }) {
  if (detections.length === 0) {
    return <p className="text-xs text-mist">No detections to chart yet.</p>;
  }

  const sorted = [...detections].sort((a, b) => b.confidence - a.confidence);

  return (
    <div className="space-y-2.5">
      {sorted.map((d, i) => (
        <div key={i}>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: d.color }}>{d.class_name.replaceAll("_", " ")}</span>
            <span className="font-mono text-mist">{(d.confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${d.confidence * 100}%`, backgroundColor: d.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
