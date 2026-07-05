/**
 * Farmer-facing agronomic reference for each of the 8 pathology classes.
 * This is general horticultural extension guidance (not a prescription) —
 * always show the disclaimer alongside it. Sources: standard apple IPM
 * (integrated pest management) extension guidance referenced in the
 * thesis's background section (apple scab / Venturia inaequalis, black rot /
 * Botryosphaeria obtusa, cedar apple rust / Gymnosporangium juniperi-virginianae).
 */

export const DISEASE_INFO = {
  Healthy: {
    label: "Healthy",
    organ: "Leaf / Fruit",
    severity: "none",
    summary: "No visible disease symptoms detected.",
    nextSteps: [
      "Continue routine scouting every 7–10 days during the growing season.",
      "Maintain good airflow by pruning dense canopy interiors.",
    ],
    treatment: "No treatment needed.",
    pesticideClass: "None",
  },
  Black_Rot: {
    label: "Black Rot",
    organ: "Leaf / Fruit",
    severity: "high",
    summary:
      "Fungal disease (Botryosphaeria obtusa) causing leaf-spot ('frogeye') and fruit rot, often entering through wounds or dead wood.",
    nextSteps: [
      "Remove and destroy mummified fruit, cankers, and dead wood — these are the main overwintering source.",
      "Prune out infected branches during dry weather to limit spore spread.",
      "Improve orchard sanitation: clear fallen leaves and fruit debris each season.",
    ],
    treatment: "Protective fungicide program timed from bud break through summer.",
    pesticideClass: "Captan- or mancozeb-based protectant fungicides; copper sprays during dormancy.",
  },
  Cedar_Apple_Rust: {
    label: "Cedar Apple Rust",
    organ: "Leaf",
    severity: "medium",
    summary:
      "Fungal disease (Gymnosporangium juniperi-virginianae) requiring a nearby juniper/cedar host to complete its life cycle; shows as yellow-orange leaf spots.",
    nextSteps: [
      "Where feasible, remove nearby juniper/cedar hosts within a few hundred meters of the orchard.",
      "Monitor closely in wet spring weather, when spore release peaks.",
    ],
    treatment: "Preventive fungicide application from pink bud stage through petal fall.",
    pesticideClass: "Myclobutanil- or triadimefon-class (DMI) fungicides; sulfur as an organic option.",
  },
  Powdery_Mildew: {
    label: "Powdery Mildew",
    organ: "Leaf",
    severity: "medium",
    summary:
      "Fungal disease producing a white, powdery coating on leaves and shoots; spreads fastest in warm, dry conditions with high humidity at night.",
    nextSteps: [
      "Prune to improve light penetration and airflow through the canopy.",
      "Remove and destroy heavily infected shoot tips at pruning time.",
    ],
    treatment: "Fungicide application starting at green tip, repeated on a 7–10 day interval in high-pressure seasons.",
    pesticideClass: "Sulfur or potassium bicarbonate sprays; myclobutanil for heavier pressure.",
  },
  Rust: {
    label: "Rust",
    organ: "Leaf",
    severity: "medium",
    summary: "General rust-type fungal infection presenting as orange/brown leaf pustules, weakening the tree over time.",
    nextSteps: [
      "Scout surrounding vegetation for alternate hosts.",
      "Remove severely infected leaves where practical to reduce spore load.",
    ],
    treatment: "Preventive fungicide rotation during the wet spring window.",
    pesticideClass: "Sulfur-based sprays or DMI-class fungicides, rotated to avoid resistance.",
  },
  Scab: {
    label: "Scab",
    organ: "Leaf / Fruit",
    severity: "high",
    summary:
      "Apple scab (Venturia inaequalis) — dark, scabby lesions on leaves and fruit; one of the most economically damaging apple diseases.",
    nextSteps: [
      "Rake and destroy fallen leaves in autumn to reduce overwintering spores.",
      "Apply protective fungicide before rain events during the primary infection period (green tip to petal fall).",
      "Prioritize resistant rootstock/cultivars for future plantings if scab pressure is chronic.",
    ],
    treatment: "Fungicide program from green tip through second cover spray, timed around rainfall.",
    pesticideClass: "Captan or mancozeb protectants; myclobutanil for curative action after early infection.",
  },
  Fresh_Apple: {
    label: "Fresh Apple (no visible disease)",
    organ: "Fruit",
    severity: "none",
    summary: "Fruit surface appears healthy with no visible lesions.",
    nextSteps: ["Continue routine pre-harvest scouting.", "Maintain standard post-harvest handling practices."],
    treatment: "No treatment needed.",
    pesticideClass: "None",
  },
  Rotten_Apple: {
    label: "Rotten Apple",
    organ: "Fruit",
    severity: "high",
    summary: "Fruit showing rot symptoms, commonly linked to black rot, bitter rot, or post-harvest fungal decay.",
    nextSteps: [
      "Remove and discard affected fruit promptly to prevent spread to healthy fruit in storage.",
      "Check storage humidity and temperature — cool, dry conditions slow rot spread.",
      "Trace back to orchard-stage infection (black rot / scab) if rot is widespread, not isolated.",
    ],
    treatment: "Remove affected fruit; address underlying orchard-stage fungal source with a protectant program.",
    pesticideClass: "Post-harvest fungicide dips (thiabendazole-class) are an industry option where locally approved.",
  },
};

export const SEVERITY_COLOR = {
  none: "#4C7A56",
  medium: "#D6A94B",
  high: "#C1443C",
};

export function getDiseaseInfo(className) {
  return DISEASE_INFO[className] || null;
}
