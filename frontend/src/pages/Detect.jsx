import { useState } from "react";
import UploadDetector from "../components/UploadDetector.jsx";
import LiveDetector from "../components/LiveDetector.jsx";

export default function Detect() {
  const [mode, setMode] = useState("upload");

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-mildew mb-4">Live Detection</p>
      <h1 className="font-display text-3xl mb-6">Detect apple pathology</h1>

      <div className="inline-flex border border-white/15 rounded-lg overflow-hidden mb-10">
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
