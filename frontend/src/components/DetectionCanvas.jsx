import { useEffect, useRef } from "react";

/**
 * Draws detection boxes on a canvas sized to match the source media's
 * natural resolution, then scaled via CSS to fit the container.
 */
export default function DetectionCanvas({ sourceWidth, sourceHeight, detections }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sourceWidth || !sourceHeight) return;
    canvas.width = sourceWidth;
    canvas.height = sourceHeight;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    (detections || []).forEach((det) => {
      const [x1, y1, x2, y2] = det.box;
      ctx.strokeStyle = det.color || "#7FAE82";
      ctx.lineWidth = Math.max(2, sourceWidth / 300);
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

      const label = `${det.class_name} ${(det.confidence * 100).toFixed(0)}%`;
      ctx.font = `${Math.max(12, sourceWidth / 45)}px "IBM Plex Mono", monospace`;
      const textW = ctx.measureText(label).width + 10;
      const textH = Math.max(16, sourceWidth / 32);
      ctx.fillStyle = det.color || "#7FAE82";
      ctx.fillRect(x1, Math.max(0, y1 - textH), textW, textH);
      ctx.fillStyle = "#0F1912";
      ctx.fillText(label, x1 + 5, Math.max(textH - 4, y1 - 5));
    });
  }, [sourceWidth, sourceHeight, detections]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
