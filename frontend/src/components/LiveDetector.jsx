import { useEffect, useRef, useState } from "react";
import { detectFromBase64 } from "../api.js";
import DetectionCanvas from "./DetectionCanvas.jsx";
import ResultsPanel from "./ResultsPanel.jsx";

const CAPTURE_INTERVAL_MS = 1500;

export default function LiveDetector() {
  const videoRef = useRef(null);
  const captureCanvasRef = useRef(document.createElement("canvas"));
  const [running, setRunning] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const intervalRef = useRef(null);
  const busyRef = useRef(false);

  async function start() {
    setError(null);

    if (!window.isSecureContext) {
      setError(
        "Camera access requires HTTPS (or localhost). This page is being served over plain HTTP — deploy behind HTTPS to use the live camera."
      );
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("This browser doesn't support camera access (getUserMedia unavailable).");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      const video = videoRef.current;
      video.srcObject = stream;

      // videoWidth/videoHeight are only reliable once metadata has loaded —
      // reading them immediately after play() is a race condition that
      // silently produces a 0x0 canvas on some browsers.
      await new Promise((resolve) => {
        video.onloadedmetadata = () => resolve();
      });
      await video.play();
      setDims({ w: video.videoWidth, h: video.videoHeight });

      setRunning(true);
      intervalRef.current = setInterval(captureAndSend, CAPTURE_INTERVAL_MS);
    } catch (e) {
      if (e.name === "NotAllowedError") {
        setError("Camera permission was denied. Allow camera access in your browser's site settings and try again.");
      } else if (e.name === "NotFoundError") {
        setError("No camera was found on this device.");
      } else {
        setError(`Could not access the camera (${e.name || "unknown error"}).`);
      }
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
    if (!video || video.readyState < 2 || busyRef.current) return;
    const canvas = captureCanvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg", 0.7);

    busyRef.current = true;
    setBusy(true);
    try {
      const data = await detectFromBase64(base64);
      setResult(data);
      setError(null);
    } catch (e) {
      setError(e.message || "Live detection request failed.");
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  useEffect(() => () => stop(), []);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 aspect-video">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-contain" />
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
