/**
 * Vulnerability Manager — Risk-scored table, EPSS visualizer, remediation planner.
 */
import { useState } from "react";
import { Bug, Search, Filter, Download, AlertTriangle, Shield, CheckCircle, Clock, TrendingDown, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Vulnerability {
  id: string;
  cve: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  cvss: number;
  epss: number;
  status: "open" | "in_progress" | "patched";
  assetCount: number;
  daysOpen: number;
}

const mockVulns: Vulnerability[] = [
  { id: "VUL-001", cve: "CVE-2024-0001", title: "RCE in Apache Struts", severity: "critical", cvss: 9.8, epss: 0.92, status: "open", assetCount: 5, daysOpen: 12 },
  { id: "VUL-002", cve: "CVE-2024-0002", title: "SQL Injection in Login", severity: "high", cvss: 8.5, epss: 0.45, status: "in_progress", assetCount: 2, daysOpen: 5 },
  { id: "VUL-003", cve: "CVE-2024-0003", title: "XSS in Profile Page", severity: "medium", cvss: 6.1, epss: 0.12, status: "open", assetCount: 8, daysOpen: 20 },
  { id: "VUL-004", cve: "CVE-2024-0004", title: "Privilege Escalation", severity: "critical", cvss: 8.8, epss: 0.78, status: "open", assetCount: 3, daysOpen: 2 },
  { id: "VUL-005", cve: "CVE-2024-0005", title: "CSRF Token Missing", severity: "medium", cvss: 6.5, epss: 0.08, status: "patched", assetCount: 1, daysOpen: 0 },
];

export function VulnManagerPage() {
  const [vulns, setVulns] = useState<Vulnerability[]>(mockVulns);
  const [filter, setFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = vulns.filter((v) => {
    if (filter && !v.title.toLowerCase().includes(filter.toLowerCase()) && !v.cve.toLowerCase().includes(filter.toLowerCase())) return false;
    if (severityFilter && v.severity !== severityFilter) return false;
    if (statusFilter && v.status !== statusFilter) return false;
    return true;
  });

  const riskScore = (v: Vulnerability) => {
    const cvssWeight = v.cvss / 10;
    const epssWeight = v.epss;
    return Math.round((cvssWeight * 0.6 + epssWeight * 0.4) * 100);
  };

  const getSeverityBadge = (s: string) => {
    const map: Record<string, string> = {
      critical: "bg-red-500/20 text-red-400 border-red-500/30",
      high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      low: "bg-green-500/20 text-green-400 border-green-500/30",
    };
    return <span className={`px-2 py-0.5 rounded text-xs border ${map[s] || map.low}`}>{s}</span>;
  };

  const getStatusBadge = (s: string) => {
    const map: Record<string, string> = {
      open: "bg-red-500/20 text-red-400",
      in_progress: "bg-blue-500/20 text-blue-400",
      patched: "bg-green-500/20 text-green-400",
    };
    const icons: Record<string, JSX.Element> = {
      open: <AlertTriangle className="w-3 h-3" />,
      in_progress: <Clock className="w-3 h-3" />,
      patched: <CheckCircle className="w-3 h-3" />,
    };
    return <span className={`flex items-center gap-1 text-xs ${map[s] || ""}`}>{icons[s]}{s.replace("_", " ")}</span>;
  };

  const barData = filtered.map((v) => ({ name: v.cve.slice(-4), cvss: v.cvss, epss: v.epss * 10, risk: riskScore(v) }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Vulnerability Manager</h1>
          <p className="text-slate-400 text-sm">Track, prioritize, and remediate vulnerabilities</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20">
            <Bug className="w-4 h-4" /> Scan Now
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Critical", count: vulns.filter((v) => v.severity === "critical").length, color: "red" },
          { label: "High", count: vulns.filter((v) => v.severity === "high").length, color: "orange" },
          { label: "Open", count: vulns.filter((v) => v.status === "open").length, color: "blue" },
          { label: "Patched", count: vulns.filter((v) => v.status === "patched").length, color: "green" },
        ].map((stat) => (
          <div key={stat.label} className={`bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">{stat.label}</span>
              <div className={`w-2 h-8 bg-${stat.color}-500 rounded-full`} />
            </div>
            <p className="text-3xl font-bold text-white">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* EPSS/CVSS Chart */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Risk vs EPSS Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }} />
            <Bar dataKey="cvss" fill="#3b82f6" name="CVSS" />
            <Bar dataKey="epss" fill="#a855f7" name="EPSS x10" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search CVE or title..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
        >
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="patched">Patched</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr>
              {["CVE", "Title", "Severity", "CVSS", "EPSS", "Risk", "Status", "Assets", "Days Open"].map((h) => (
                <th key={h} className="text-left p-4 text-xs font-medium text-slate-400 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id} className="border-t border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                <td className="p-4">
                  <span className="text-xs font-mono text-blue-400">{v.cve}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-white">{v.title}</span>
                </td>
                <td className="p-4">{getSeverityBadge(v.severity)}</td>
                <td className="p-4">
                  <span className={`text-sm font-bold ${v.cvss >= 9 ? "text-red-400" : v.cvss >= 7 ? "text-orange-400" : "text-yellow-400"}`}>
                    {v.cvss}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: `${v.epss * 100}%` }} />
                    </div>
                    <span className="text-xs text-slate-400">{(v.epss * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${riskScore(v) > 70 ? "bg-red-500" : riskScore(v) > 40 ? "bg-yellow-500" : "bg-green-500"}`} />
                    <span className="text-sm text-white">{riskScore(v)}</span>
                  </div>
                </td>
                <td className="p-4">{getStatusBadge(v.status)}</td>
                <td className="p-4">
                  <span className="text-sm text-slate-300">{v.assetCount}</span>
                </td>
                <td className="p-4">
                  <span className={`text-sm ${v.daysOpen > 30 ? "text-red-400" : v.daysOpen > 14 ? "text-yellow-400" : "text-slate-400"}`}>
                    {v.daysOpen}d
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VulnManagerPage;
