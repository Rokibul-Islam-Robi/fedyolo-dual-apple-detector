import { useEffect, useState } from "react";
import { API_BASE_URL, checkHealth } from "../api.js";
import UploadDetector from "../components/UploadDetector.jsx";
import LiveDetector from "../components/LiveDetector.jsx";

export default function Detect() {
  const [mode, setMode] = useState("upload");
  const [health, setHealth] = useState({ status: "checking" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await checkHealth();
      if (cancelled) return;
      setHealth(res.ok ? { status: "up", demo_mode: res.demo_mode } : { status: "down", error: res.error });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-mildew mb-4">Live Detection</p>
      <h1 className="font-display text-3xl mb-4">Detect apple pathology</h1>

      <HealthBanner health={health} />

      <div className="inline-flex border border-white/15 rounded-lg overflow-hidden mb-10 mt-6">
        {[
          { key: "upload", label: "Upload photo" },
          { key: "live", label: "Live camera" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setMode(tab.key)}
            className={`px-5 py-2 text-sm transition-colors ${
              mode === tab.key ? "bg-leaf text-bark" : "text-mist hover:text-parchment"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode === "upload" ? <UploadDetector /> : <LiveDetector />}
    </div>
  );
}

function HealthBanner({ health }) {
  if (health.status === "checking") {
    return <p className="text-xs font-mono text-mist">Checking detection API at {API_BASE_URL}…</p>;
  }
  if (health.status === "down") {
    return (
      <div className="text-xs font-mono text-scab border border-scab/40 bg-scab/10 rounded-lg px-3 py-2">
        API unreachable: {health.error}
      </div>
    );
  }
  if (health.demo_mode) {
    return (
      <div className="text-xs font-mono text-mildew border border-mildew/40 bg-mildew/10 rounded-lg px-3 py-2">
        API is up, but running in DEMO MODE (no trained weights loaded on the server).
      </div>
    );
  }
  return <p className="text-xs font-mono text-leaf-light">API is up and serving real detections.</p>;
}
