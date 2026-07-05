const rows = [
  ["YOLOv8n (centralized)", "93.76%", "78.60%", "3.8 ms"],
  ["YOLO11n (centralized)", "95.50%", "79.40%", "2.3 ms"],
  ["YOLO11s (centralized)", "93.88%", "78.80%", "11.2 ms"],
  ["FedYOLO-Dual (federated)", "92.73%", "77.40%", "3.7 ms*"],
];

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-mildew mb-4">The Research</p>
      <h1 className="font-display text-3xl mb-6">FedYOLO-Dual</h1>
      <p className="text-mist leading-relaxed mb-6">
        A privacy-preserving, organ-aware apple pathology detector built on lightweight YOLO
        backbones (YOLOv8n, YOLO11n, YOLO11s), trained on a unified 8-class leaf and fruit
        dataset (6,574 images, 7,803 bounding boxes), and validated under a simulated Federated
        Averaging protocol across three non-IID farm clients.
      </p>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border border-white/10">
          <thead>
            <tr className="bg-canopy/60 text-mist text-left">
              <th className="p-3 font-mono">Model</th>
              <th className="p-3 font-mono">mAP@0.5</th>
              <th className="p-3 font-mono">mAP@0.5:0.95</th>
              <th className="p-3 font-mono">Speed</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-t border-white/5">
                {r.map((cell, i) => (
                  <td key={i} className={`p-3 ${i === 0 ? "text-parchment" : "text-mist font-mono"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-mist mt-2">
          * Federated latency figure is preliminary, as noted in the thesis (Section 5.4).
        </p>
      </div>

      <h2 className="font-display text-xl mb-3 text-leaf-light">What's validated vs. illustrative</h2>
      <p className="text-mist leading-relaxed mb-4">
        The thesis is explicit about separating measured results from planned components. The
        centralized benchmark, the federated convergence result, the organ-aware routing layer, and
        the five-seed statistical robustness check are all empirically validated on the held-out
        test set. The Grad-CAM explainability layer, the severity-to-yield regression, and the
        cross-farm generalization probe are illustrative / in-progress — this demo app's "Live
        Detection" page reflects only the validated detection pipeline.
      </p>

      <h2 className="font-display text-xl mb-3 text-leaf-light">Organ-aware routing rule</h2>
      <p className="text-mist leading-relaxed">
        Healthy, Black Rot, Cedar Apple Rust, Powdery Mildew, Rust, and Scab route to the{" "}
        <span className="text-leaf-light">leaf stream</span>. Healthy, Black Rot, Fresh Apple,
        Rotten Apple, and Scab route to the <span className="text-scab">fruit stream</span>. Black
        Rot and Scab appear in both, since the same fungal agents infect either organ.
      </p>
    </div>
  );
}
