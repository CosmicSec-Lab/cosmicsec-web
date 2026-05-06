/**
 * Compliance Page — Framework status, control grid, compliance score.
 */
import { useState } from "react";
import { FileCheck, Shield, TrendingUp, AlertTriangle, CheckCircle, XCircle, ExternalLink } from "lucide-react";

interface Framework {
  id: string;
  name: string;
  score: number;
  status: "compliant" | "at_risk" | "non_compliant";
  controls: Control[];
}

interface Control {
  id: string;
  title: string;
  status: "compliant" | "non_compliant" | "partial";
}

const frameworks: Framework[] = [
  {
    id: "soc2",
    name: "SOC 2 Type II",
    score: 78,
    status: "at_risk",
    controls: [
      { id: "CC1.1", title: "Control Environment", status: "compliant" },
      { id: "CC6.1", title: "Logical Access", status: "partial" },
      { id: "CC7.1", title: "System Operations", status: "non_compliant" },
    ],
  },
  {
    id: "iso27001",
    name: "ISO/IEC 27001",
    score: 82,
    status: "compliant",
    controls: [
      { id: "A.5.1", title: "Security Policies", status: "compliant" },
      { id: "A.8.1", title: "Asset Management", status: "compliant" },
      { id: "A.12.1", title: "Operations Security", status: "partial" },
    ],
  },
  {
    id: "nist",
    name: "NIST 800-53",
    score: 65,
    status: "at_risk",
    controls: [
      { id: "AC-1", title: "Access Control", status: "partial" },
      { id: "AU-2", title: "Audit Events", status: "non_compliant" },
      { id: "SC-1", title: "System Protection", status: "compliant" },
    ],
  },
];

export function CompliancePage() {
  const [selectedFw, setSelectedFw] = useState(frameworks[0]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; icon: JSX.Element }> = {
      compliant: { bg: "bg-green-500/20", text: "text-green-400", icon: <CheckCircle className="w-3 h-3" /> },
      at_risk: { bg: "bg-yellow-500/20", text: "text-yellow-400", icon: <AlertTriangle className="w-3 h-3" /> },
      non_compliant: { bg: "bg-red-500/20", text: "text-red-400", icon: <XCircle className="w-3 h-3" /> },
    };
    const s = map[status] || map.at_risk;
    return (
      <span className={`flex items-center gap-1 text-xs ${s.text} ${s.bg} px-2 py-0.5 rounded`}>
        {s.icon} {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Compliance Center</h1>
          <p className="text-slate-400 text-sm">Track compliance across frameworks</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20">
          <FileCheck className="w-4 h-4" /> Generate Report
        </button>
      </div>

      {/* Framework Selector */}
      <div className="flex gap-3">
        {frameworks.map((fw) => (
          <button
            key={fw.id}
            onClick={() => setSelectedFw(fw)}
            className={`px-4 py-3 rounded-2xl border transition-all ${
              selectedFw.id === fw.id
                ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/20"
                : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600"
            }`}
          >
            <div className="text-left">
              <p className="font-medium text-sm">{fw.name}</p>
              <p className={`text-xs ${getScoreColor(fw.score)}`}>{fw.score}% Compliant</p>
            </div>
          </button>
        ))}
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Compliance Score</span>
            <Shield className="w-4 h-4 text-blue-400" />
          </div>
          <p className={`text-4xl font-bold ${getScoreColor(selectedFw.score)}`}>{selectedFw.score}%</p>
          <div className="mt-3 bg-slate-700/50 rounded-full h-2 overflow-hidden">
            <div className={`h-full rounded-full ${
              selectedFw.score >= 80 ? "bg-green-500" : selectedFw.score >= 60 ? "bg-yellow-500" : "bg-red-500"
            }`} style={{ width: `${selectedFw.score}%` }} />
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Total Controls</span>
            <FileCheck className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-4xl font-bold text-white">{selectedFw.controls.length}</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Status</span>
            {selectedFw.status === "compliant" ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : selectedFw.status === "at_risk" ? (
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400" />
            )}
          </div>
          <div className="mt-1">{getStatusBadge(selectedFw.status)}</div>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <h3 className="font-semibold text-white">Controls — {selectedFw.name}</h3>
        </div>
        <div className="divide-y divide-slate-700/30">
          {selectedFw.controls.map((c) => (
            <div key={c.id} className="p-4 flex items-center justify-between hover:bg-slate-700/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${
                  c.status === "compliant" ? "bg-green-500" :
                  c.status === "partial" ? "bg-yellow-500" :
                  "bg-red-500"
                }`} />
                <div>
                  <p className="text-sm font-medium text-white">{c.id}</p>
                  <p className="text-xs text-slate-400">{c.title}</p>
                </div>
              </div>
              {getStatusBadge(c.status)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CompliancePage;
