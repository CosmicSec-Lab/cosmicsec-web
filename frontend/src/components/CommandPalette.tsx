/**
 * CommandPalette (Cmd+K) with fuzzy search.
 */
import { useEffect, useState, useRef } from "react";
import { Search, ArrowRight, Zap, Shield, Bug, FileCheck } from "lucide-react";

interface Command {
  icon: React.ElementType;
  label: string;
  path: string;
  shortcut?: string;
}

const commands: Command[] = [
  { icon: Shield, label: "SOC Dashboard", path: "/soc" },
  { icon: Search, label: "Threat Hunting", path: "/threat-hunt" },
  { icon: AlertTriangle, label: "Incidents", path: "/incidents" },
  { icon: Bug, label: "Vulnerabilities", path: "/vulnerabilities" },
  { icon: FileCheck, label: "Compliance", path: "/compliance" },
  { icon: Zap, label: "Run Quick Scan", path: "/scans" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top duration-200">
        <div className="flex items-center gap-3 p-4 border-b border-slate-700">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-white outline-none placeholder-slate-500"
          />
          <kbd className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">ESC</kbd>
        </div>
        <div className="max-h-64 overflow-y-auto p-2">
          {filtered.map((cmd) => (
            <a
              key={cmd.path}
              href={cmd.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all group"
            >
              <cmd.icon className="w-4 h-4 text-blue-400" />
              <span className="flex-1 text-sm">{cmd.label}</span>
              <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
