import { useEffect, useRef, useState } from "react";
import { detectFromBase64 } from "../api.js";
import DetectionCanvas from "./DetectionCanvas.jsx";
import ResultsPanel from "./ResultsPanel.jsx";

const CAPTURE_INTERVAL_MS = 1200;

export default function LiveDetector() {
  const videoRef = useRef(null);
  const captureCanvasRef = useRef(document.createElement("canvas"));
  const [running, setRunning] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const intervalRef = useRef(null);

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setDims({ w: videoRef.current.videoWidth, h: videoRef.current.videoHeight });
      setRunning(true);
      intervalRef.current = setInterval(captureAndSend, CAPTURE_INTERVAL_MS);
    } catch (e) {
      setError("Could not access the camera. Check permissions and that you're on HTTPS (or localhost).");
    }
  }

  function stop() {
    setRunning(false);
    clearInterval(intervalRef.current);
    const stream = videoRef.current?.srcObject;
    stream?.getTracks()?.forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  async function captureAndSend() {
    const video = videoRef.current;
    if (!video || video.readyState < 2 || busy) return;
    const canvas = captureCanvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg", 0.7);

    setBusy(true);
    try {
      const data = await detectFromBase64(base64);
      setResult(data);
    } catch (e) {
      setError(e?.response?.data?.error || "Live detection request failed.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => () => stop(), []);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 aspect-video">
          <video ref={videoRef} className="w-full h-full object-contain" muted playsInline />
          <DetectionCanvas sourceWidth={dims.w} sourceHeight={dims.h} detections={result?.detections} />
        </div>

        <div className="flex gap-3 mt-4">
          {!running ? (
            <button
              onClick={start}
              className="px-5 py-2.5 rounded-lg bg-leaf text-bark font-medium hover:bg-leaf-light transition-colors"
            >
              Start camera
            </button>
          ) : (
            <button
              onClick={stop}
              className="px-5 py-2.5 rounded-lg border border-white/20 hover:border-white/40 transition-colors"
            >
              Stop
            </button>
          )}
          {running && (
            <span className="text-xs font-mono text-mist self-center">
              {busy ? "detecting…" : `polling every ${CAPTURE_INTERVAL_MS / 1000}s`}
            </span>
          )}
        </div>
        {error && <p className="text-xs font-mono text-scab mt-3">{error}</p>}
      </div>

      <ResultsPanel result={result} />
    </div>
  );
}
