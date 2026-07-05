import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Overview" },
  { to: "/detect", label: "Live Detection" },
  { to: "/about", label: "The Research" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-bark/80 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 group">
          <span className="w-2.5 h-2.5 rounded-full bg-leaf-light group-hover:bg-mildew transition-colors" />
          <span className="font-display text-lg tracking-tight">
            FedYOLO<span className="text-leaf-light">-Dual</span>
          </span>
        </NavLink>
        <nav className="flex items-center gap-6 text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `transition-colors ${isActive ? "text-mildew" : "text-mist hover:text-parchment"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
