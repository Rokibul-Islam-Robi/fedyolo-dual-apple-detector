import { useRef, useState } from "react";
import { detectFromFile } from "../api.js";
import DetectionCanvas from "./DetectionCanvas.jsx";
import ResultsPanel from "./ResultsPanel.jsx";

export default function UploadDetector() {
  const [preview, setPreview] = useState(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const imgRef = useRef(null);

  async function handleFile(file) {
    if (!file) return;
    setError(null);
    setResult(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    setLoading(true);
    try {
      const data = await detectFromFile(file);
      setResult(data);
    } catch (e) {
      setError(e.message || "Detection failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <label className="block border-2 border-dashed border-white/15 rounded-xl p-8 text-center cursor-pointer hover:border-leaf-light/60 transition-colors">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <p className="text-mist text-sm">Click to upload an apple leaf or fruit photo</p>
          <p className="text-xs text-mist/60 mt-1">JPG or PNG</p>
        </label>

        {preview && (
          <div className="relative mt-6 rounded-xl overflow-hidden border border-white/10">
            <img
              ref={imgRef}
              src={preview}
              alt="Uploaded sample"
              className="w-full h-auto block"
              onLoad={(e) => setDims({ w: e.target.naturalWidth, h: e.target.naturalHeight })}
            />
            <DetectionCanvas
              sourceWidth={dims.w}
              sourceHeight={dims.h}
              detections={result?.detections}
            />
          </div>
        )}

        {loading && <p className="text-xs font-mono text-mildew mt-3">Running inference…</p>}
        {error && <p className="text-xs font-mono text-scab mt-3">{error}</p>}
      </div>

      <ResultsPanel result={result} />
    </div>
  );
}
