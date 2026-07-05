/**
 * Signature element for the site: one incoming frame, split down a diagonal
 * seam into a "leaf pathology stream" (green) and "fruit pathology stream"
 * (red/amber), with bounding-box marks on each half. This is a static/CSS
 * animated stand-in for the real thing shown live on the Detect page.
 */
export default function OrganSplitViz() {
  return (
    <div className="relative aspect-[4/3] w-full max-w-xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
      <svg viewBox="0 0 400 300" className="w-full h-full" role="img" aria-label="Organ-aware dual-stream detection preview">
        <defs>
          <clipPath id="leafHalf">
            <polygon points="0,0 240,0 160,300 0,300" />
          </clipPath>
          <clipPath id="fruitHalf">
            <polygon points="240,0 400,0 400,300 160,300" />
          </clipPath>
        </defs>

        <rect width="400" height="300" fill="#16241A" />

        <g clipPath="url(#leafHalf)">
          <rect width="400" height="300" fill="#1B2B1F" />
          <path
            d="M40 220 C 30 140, 90 60, 190 40 C 170 110, 150 190, 110 260 Z"
            fill="#2E4632"
            stroke="#7FAE82"
            strokeWidth="2"
          />
          <rect x="70" y="150" width="34" height="26" fill="none" stroke="#D6A94B" strokeWidth="1.5" />
          <text x="70" y="145" fill="#D6A94B" fontSize="8" fontFamily="IBM Plex Mono">
            Scab 0.94
          </text>
        </g>

        <g clipPath="url(#fruitHalf)">
          <rect width="400" height="300" fill="#241717" />
          <circle cx="300" cy="150" r="70" fill="#7A3B2E" stroke="#C1443C" strokeWidth="2" />
          <rect x="270" y="120" width="30" height="24" fill="none" stroke="#EFE9DB" strokeWidth="1.5" />
          <text x="266" y="115" fill="#EFE9DB" fontSize="8" fontFamily="IBM Plex Mono">
            Black_Rot 0.91
          </text>
        </g>

        <line x1="240" y1="0" x2="160" y2="300" stroke="#EFE9DB" strokeWidth="1.5" strokeDasharray="4 5" opacity="0.6" />

        <text x="20" y="285" fill="#9CB2A0" fontSize="9" fontFamily="IBM Plex Mono">
          leaf-stream
        </text>
        <text x="330" y="285" fill="#9CB2A0" fontSize="9" fontFamily="IBM Plex Mono" textAnchor="end">
          fruit-stream
        </text>
      </svg>
    </div>
  );
}
