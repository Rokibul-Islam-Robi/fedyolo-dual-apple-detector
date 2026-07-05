export default function ResultsPanel({ result }) {
  if (!result) {
    return (
      <div className="text-sm text-mist border border-white/10 rounded-xl p-6 bg-canopy/40">
        Run a detection to see the organ-routed report here.
      </div>
    );
  }

  const { leaf_stream = [], fruit_stream = [], counts, inference_ms, demo_mode } = result;

  return (
    <div className="space-y-4">
      {demo_mode && (
        <div className="text-xs font-mono text-mildew border border-mildew/40 bg-mildew/10 rounded-lg px-3 py-2">
          DEMO MODE — no trained weights found on the server. Detections shown are synthetic
          placeholders. Add backend/weights/best.pt to see real predictions.
        </div>
      )}

      <div className="flex gap-4 text-xs font-mono text-mist">
        <span>{counts?.total ?? 0} detections</span>
        <span>·</span>
        <span>{inference_ms} ms inference</span>
      </div>

      <StreamBlock title="Leaf pathology stream" accent="text-leaf-light" items={leaf_stream} />
      <StreamBlock title="Fruit pathology stream" accent="text-scab" items={fruit_stream} />
    </div>
  );
}

function StreamBlock({ title, accent, items }) {
  return (
    <div className="border border-white/10 rounded-xl p-4 bg-canopy/40">
      <h3 className={`font-display text-sm mb-3 ${accent}`}>{title}</h3>
      {items.length === 0 ? (
        <p className="text-xs text-mist">No detections routed to this stream.</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((d, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span style={{ color: d.color }}>{d.class_name.replaceAll("_", " ")}</span>
              <span className="font-mono text-mist">{(d.confidence * 100).toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
