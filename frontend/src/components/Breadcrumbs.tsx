/**
 * Breadcrumbs with animation and context.
 */
import { useLocation, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/soc": "SOC Center",
  "/threat-hunt": "Threat Hunting",
  "/incidents": "Incidents",
  "/vulnerabilities": "Vulnerabilities",
  "/compliance": "Compliance",
  "/scans": "Scans",
  "/recon": "Recon",
  "/ai": "AI Analysis",
  "/reports": "Reports",
  "/settings": "Settings",
};

export function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="px-6 py-3 border-b border-slate-800/50 bg-slate-900/30">
      <ol className="flex items-center gap-1 text-sm">
        <li>
          <Link to="/dashboard" className="text-slate-500 hover:text-blue-400 transition-colors">
            Home
          </Link>
        </li>
        {segments.map((seg, i) => {
          const path = "/" + segments.slice(0, i + 1).join("/");
          const label = routeLabels[path] || seg;
          const isLast = i === segments.length - 1;
          return (
            <li key={path} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-slate-600" />
              {isLast ? (
                <span className="text-blue-400 font-medium">{label}</span>
              ) : (
                <Link to={path} className="text-slate-500 hover:text-blue-400 transition-colors">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
