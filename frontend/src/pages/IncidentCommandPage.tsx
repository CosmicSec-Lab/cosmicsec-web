/**
 * Incident Command Center — Kanban board, timelines, SLA trackers.
 */
import { useState } from "react";
import { Plus, Filter, Search, Clock, AlertTriangle, CheckCircle, XCircle, User, Play, Pause, SkipForward } from "lucide-react";
import { DndContext, Draggable, Droppable, DragOverlay } from "@dnd-kit/core"; // stubbed

type IncidentStatus = "open" | "investigating" | "contained" | "resolved" | "closed";
type Severity = "critical" | "high" | "medium" | "low";

interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  assignee?: string;
  sla: "ok" | "warning" | "breach";
  minutesOpen: number;
}

const mockIncidents: Incident[] = [
  { id: "INC-001", title: "Ransomware on WS-001", severity: "critical", status: "open", sla: "breach", minutesOpen: 120 },
  { id: "INC-002", title: "Phishing Campaign", severity: "high", status: "investigating", assignee: "John", sla: "warning", minutesOpen: 45 },
  { id: "INC-003", title: "Data Exfiltration", severity: "critical", status: "contained", assignee: "Sarah", sla: "ok", minutesOpen: 90 },
  { id: "INC-004", title: "Malware Detection", severity: "medium", status: "open", sla: "ok", minutesOpen: 15 },
  { id: "INC-005", title: "DDoS Attack", severity: "high", status: "resolved", assignee: "Mike", sla: "ok", minutesOpen: 60 },
];

const columns: { status: IncidentStatus; label: string; color: string }[] = [
  { status: "open", label: "Open", color: "slate" },
  { status: "investigating", label: "Investigating", color: "blue" },
  { status: "contained", label: "Contained", color: "yellow" },
  { status: "resolved", label: "Resolved", color: "green" },
  { status: "closed", label: "Closed", color: "slate" },
];

export function IncidentCommandPage() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Severity | "">("");

  const getColumnItems = (status: IncidentStatus) =>
    incidents.filter(
      (i) =>
        i.status === status &&
        (search === "" || i.title.toLowerCase().includes(search.toLowerCase())) &&
        (severityFilter === "" || i.severity === severityFilter)
    );

  const getSeverityBadge = (s: Severity) => {
    const map: Record<Severity, string> = {
      critical: "bg-red-500/20 text-red-400 border-red-500/30",
      high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      low: "bg-green-500/20 text-green-400 border-green-500/30",
    };
    return <span className={`px-2 py-0.5 rounded text-xs border ${map[s]}`}>{s}</span>;
  };

  const getSLABadge = (sla: string, minutes: number) => {
    if (sla === "breach") return <span className="flex items-center gap-1 text-xs text-red-400"><XCircle className="w-3 h-3" /> SLA Breach</span>;
    if (sla === "warning") return <span className="flex items-center gap-1 text-xs text-yellow-400"><Clock className="w-3 h-3" /> {minutes}m open</span>;
    return <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle className="w-3 h-3" /> On Track</span>;
  };

  const formatTime = (m: number) => {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return h > 0 ? `${h}h ${mm}m` : `${mm}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Incident Command</h1>
          <p className="text-slate-400 text-sm">Manage incidents with Kanban workflow</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20">
          <Plus className="w-4 h-4" /> New Incident
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search incidents..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as Severity | "")}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
        >
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.status} className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden min-w-[240px]">
            <div className={`p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  col.status === "open" ? "bg-red-500" :
                  col.status === "investigating" ? "bg-blue-500" :
                  col.status === "contained" ? "bg-yellow-500" :
                  col.status === "resolved" ? "bg-green-500" : "bg-slate-500"
                }`} />
                <span className="text-sm font-medium text-white">{col.label}</span>
              </div>
              <span className="px-2 py-0.5 bg-slate-700/50 rounded-full text-xs text-slate-400">
                {getColumnItems(col.status).length}
              </span>
            </div>
            <div className="p-3 space-y-2 min-h-[400px]">
              {getColumnItems(col.status).map((inc) => (
                <div
                  key={inc.id}
                  className="p-3 bg-slate-900/50 border border-slate-700/30 rounded-xl hover:border-slate-600/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-500">{inc.id}</span>
                    {getSeverityBadge(inc.severity)}
                  </div>
                  <p className="text-sm font-medium text-white mb-2">{inc.title}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {inc.assignee ? (
                        <span className="flex items-center gap-1 text-xs text-slate-400"><User className="w-3 h-3" /> {inc.assignee}</span>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Unassigned</span>
                      )}
                    </div>
                    {getSLABadge(inc.sla, inc.minutesOpen)}
                  </div>
                  <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-slate-700 rounded"><Play className="w-3 h-3 text-slate-400" /></button>
                    <button className="p-1 hover:bg-slate-700 rounded"><Pause className="w-3 h-3 text-slate-400" /></button>
                    <button className="p-1 hover:bg-slate-700 rounded"><SkipForward className="w-3 h-3 text-slate-400" /></button>
                  </div>
                </div>
              ))}
              <button className="w-full p-2 border border-dashed border-slate-700 rounded-xl text-xs text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all">
                + Add Incident
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IncidentCommandPage;
