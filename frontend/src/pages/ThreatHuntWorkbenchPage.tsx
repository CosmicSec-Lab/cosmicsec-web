/**
 * Threat Hunting Workbench — Query builder, MITRE matrix, campaign manager.
 */
import { useState } from "react";
import { Search, Play, Pause, Plus, Filter, Download, Trash2, Shield, Bug } from "lucide-react";
import { getHuntQueries, runHuntQuery, getHuntCampaigns, createHuntCampaign } from "../api/securityEndpoints";

interface Query {
  query_id: string;
  name: string;
  mitre_tactics: string[];
  severity: string;
  tags: string[];
}

export function ThreatHuntWorkbenchPage() {
  const [queries] = useState<Query[]>([
    { query_id: "q_001", name: "PowerShell Suspicious Execution", mitre_tactics: ["execution"], severity: "high", tags: ["powershell", "lateral"] },
    { query_id: "q_002", name: "RDP Brute Force", mitre_tactics: ["credential_access"], severity: "critical", tags: ["rdp", "brute"] },
    { query_id: "q_003", name: "DNS Tunneling Detection", mitre_tactics: ["c2"], severity: "critical", tags: ["dns", "tunnel"] },
    { query_id: "q_004", name: "Suspicious DLL Loading", mitre_tactics: ["defense_evasion"], severity: "high", tags: ["dll", "sideload"] },
    { query_id: "q_005", name: "Privilege Escalation", mitre_tactics: ["privilege_escalation"], severity: "critical", tags: ["privesc", "token"] },
  ]);

  const [selectedTactic, setSelectedTactic] = useState<string>("");

  const tactics = ["initial_access", "execution", "persistence", "privilege_escalation", "defense_evasion", "credential_access", "discovery", "lateral_movement", "c2", "exfiltration"];

  const filtered = selectedTactic
    ? queries.filter((q) => q.mitre_tactics.includes(selectedTactic))
    : queries;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Threat Hunting Workbench</h1>
          <p className="text-slate-400 text-sm">Build, run, and manage threat hunting queries</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all">
            <Plus className="w-4 h-4" /> New Query
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20">
            <Play className="w-4 h-4" /> Run All
          </button>
        </div>
      </div>

      {/* MITRE Matrix Quick Filter */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 mr-2">MITRE Filter:</span>
          {tactics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTactic(selectedTactic === t ? "" : t)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedTactic === t
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {t.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Query Builder + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query List */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
            <h3 className="font-semibold text-white">Queries ({filtered.length})</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input placeholder="Search queries..." className="pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48" />
              </div>
              <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-700/30 max-h-[500px] overflow-y-auto">
            {filtered.map((q, i) => (
              <div key={q.query_id} className="p-4 hover:bg-slate-700/20 transition-all group cursor-pointer animate-in slide-in-from-left duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${q.severity === "critical" ? "bg-red-500" : q.severity === "high" ? "bg-orange-500" : "bg-yellow-500"}`} />
                    <span className="font-medium text-white text-sm">{q.name}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white"><Play className="w-3 h-3" /></button>
                    <button className="p-1.5 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white"><Download className="w-3 h-3" /></button>
                    <button className="p-1.5 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {q.mitre_tactics.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs border border-purple-500/30">{t}</span>
                  ))}
                  {q.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-slate-700/50 text-slate-400 rounded text-xs">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Manager */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4">Campaigns</h3>
          <div className="space-y-3">
            {[
              { id: "c_001", name: "Q1 Advanced Threats", status: "running", findings: 12 },
              { id: "c_002", name: "Ransomware Hunt", status: "completed", findings: 3 },
              { id: "c_003", name: "Insider Threat", status: "paused", findings: 0 },
            ].map((c) => (
              <div key={c.id} className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white text-sm">{c.name}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    c.status === "running" ? "bg-green-500/20 text-green-400" :
                    c.status === "completed" ? "bg-blue-500/20 text-blue-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{c.findings} findings</p>
                <div className="flex gap-1 mt-2">
                  {c.status === "running" ? (
                    <button className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors"><Pause className="w-3 h-3" /> Pause</button>
                  ) : (
                    <button className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs hover:bg-green-500/30 transition-colors"><Play className="w-3 h-3" /> Resume</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 flex items-center justify-center gap-2 p-3 border border-dashed border-slate-600 rounded-xl text-slate-400 hover:text-white hover:border-slate-400 transition-all">
            <Plus className="w-4 h-4" /> New Campaign
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThreatHuntWorkbenchPage;