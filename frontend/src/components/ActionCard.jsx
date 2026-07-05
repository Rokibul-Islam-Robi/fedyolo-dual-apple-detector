import { SEVERITY_COLOR, getDiseaseInfo } from "../data/diseaseInfo.js";

export default function ActionCard({ className }) {
  const info = getDiseaseInfo(className);
  if (!info) return null;

  const color = SEVERITY_COLOR[info.severity] || "#9CB2A0";

  return (
    <div className="border border-white/10 rounded-xl p-4 bg-canopy/50">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-display text-sm">{info.label}</h4>
        <span
          className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border"
          style={{ color, borderColor: color }}
        >
          {info.severity === "none" ? "no action" : `${info.severity} priority`}
        </span>
      </div>
      <p className="text-xs text-mist leading-relaxed mb-3">{info.summary}</p>

      {info.severity !== "none" && (
        <>
          <p className="text-xs font-mono uppercase tracking-wide text-leaf-light mb-1">
            Next steps
          </p>
          <ul className="text-xs text-mist list-disc list-inside space-y-1 mb-3">
            {info.nextSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>

          <p className="text-xs font-mono uppercase tracking-wide text-leaf-light mb-1">
            Suggested treatment window
          </p>
          <p className="text-xs text-mist mb-2">{info.treatment}</p>

          <p className="text-xs font-mono uppercase tracking-wide text-leaf-light mb-1">
            Pesticide / fungicide class
          </p>
          <p className="text-xs text-mist">{info.pesticideClass}</p>
        </>
      )}
    </div>
  );
}
