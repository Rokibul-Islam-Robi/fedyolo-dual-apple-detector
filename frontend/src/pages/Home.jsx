import { Link } from "react-router-dom";
import OrganSplitViz from "../components/OrganSplitViz.jsx";
import StatCard from "../components/StatCard.jsx";

export default function Home() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-mildew mb-4">
            Organ-aware · Federated · Explainable
          </p>
          <h1 className="font-display text-2xl md:text-3xl leading-[1.25] mb-4">
            Multi-Class Apple Leaf and Fruit Disease Detection for Agro-Pathology Driven by a
            Privacy-Preserving Federated Learning Framework with{" "}
            <span className="text-leaf-light">Organ-Aware Dual-Stream YOLO</span> and Explainable AI
          </h1>
          <p className="text-mist leading-relaxed mb-8 max-w-md">
            FedYOLO-Dual detects eight apple leaf and fruit pathology classes from a single
            YOLO backbone, routes each finding into a leaf report and a fruit report, and tells
            farmers what to do next — without moving a single photo off the orchard where it
            was taken.
          </p>
          <div className="flex gap-4">
            <Link
              to="/detect"
              className="px-6 py-3 rounded-lg bg-leaf text-bark font-medium hover:bg-leaf-light transition-colors"
            >
              Run live detection →
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 rounded-lg border border-white/15 text-parchment hover:border-white/40 transition-colors"
            >
              Read the method
            </Link>
          </div>
        </div>
        <OrganSplitViz />
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="vein-divider mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value="95.50%" label="Centralized mAP@0.5 (YOLO11n)" />
          <StatCard value="92.73%" label="Federated mAP@0.5 (4 rounds)" accentClass="text-mildew" />
          <StatCard value="2.3 ms" label="Inference / image" accentClass="text-rust" />
          <StatCard value="8 classes" label="Leaf + fruit pathology" accentClass="text-scab" />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Organ-aware routing",
            body: "Detections are split post-hoc into leaf-tissue and fruit-tissue streams by class identity — no backbone changes required.",
          },
          {
            title: "Federated averaging",
            body: "Three simulated farm clients train locally; only weight tensors synchronize, never raw imagery.",
          },
          {
            title: "Field-ready edge model",
            body: "YOLO11n runs at 2.3 ms/image with ~2.58M parameters — light enough for drones, mobile apps, and fixed orchard cameras.",
          },
        ].map((card) => (
          <div key={card.title} className="border border-white/10 rounded-xl p-6 bg-canopy/40">
            <h3 className="font-display text-lg mb-2 text-leaf-light">{card.title}</h3>
            <p className="text-sm text-mist leading-relaxed">{card.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
