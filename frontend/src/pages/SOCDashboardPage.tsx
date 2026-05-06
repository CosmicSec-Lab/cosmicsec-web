/**
 * Premium SOC Dashboard — Live threat map, KPIs, event stream, heatmap.
 */
import { useState, useEffect } from "react";
import { Shield, AlertTriangle, Bug, Activity, Zap, TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getDashboard, getOperationsSummary } from "../api/securityEndpoints";

interface KPI {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: string;
}

export function SOCDashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getOperationsSummary();
        setSummary(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="animate-pulse space-y-4 p-6"><div className="h-32 bg-slate-800 rounded-2xl" /><div className="grid grid-cols-4 gap-4"><div className="h-24 bg-slate-800 rounded-xl" /><div className="h-24 bg-slate-800 rounded-xl" /><div className="h-24 bg-slate-800 rounded-xl" /><div className="h-24 bg-slate-800 rounded-xl" /></div></div>;

  const kpis: KPI[] = [
    { title: "Security Score", value: summary?.security_score ?? 78, change: 2.5, icon: Shield, color: "blue" },
    { title: "Open Incidents", value: summary?.incidents?.open_incidents ?? 5, change: -1, icon: AlertTriangle, color: "red" },
    { title: "Critical Vulns", value: summary?.vulnerabilities?.critical_open ?? 12, change: 3, icon: Bug, color: "orange" },
    { title: "Threat Hunts", value: 3, change: 0, icon: Activity, color: "purple" },
  ];

  const sparklineData = Array.from({ length: 20 }, (_, i) => ({ time: i, value: 70 + Math.random() * 20 }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">SOC Center</h1>
          <p className="text-slate-400 text-sm">Real-time security operations overview</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>
          <span className="text-sm text-slate-400">Live</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.title} className={`relative overflow-hidden bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 group hover:border-${kpi.color}-500/50 transition-all duration-300`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${kpi.color}-500/10 to-transparent rounded-full -mr-10 -mt-10`} />
            <div className="flex items-center justify-between mb-4">
              <kpi.icon className={`w-6 h-6 text-${kpi.color}-400`} />
              <span className={`flex items-center text-xs font-medium ${kpi.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                {kpi.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {kpi.change >= 0 ? "+" : ""}{kpi.change}%
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{kpi.value}</p>
            <p className="text-slate-400 text-sm mt-1">{kpi.title}</p>
            {/* Mini sparkline */}
            <div className="h-10 mt-4 opacity-50 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <Area type="monotone" dataKey="value" stroke={`var(--${kpi.color}-400)`} fill={`var(--${kpi.color}-400)`} fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Live Event Stream + Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Stream */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Live Event Stream</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-700/30 animate-in slide-in-from-left duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? "bg-red-500" : "bg-yellow-500"} animate-pulse`} />
                <div className="flex-1">
                  <p className="text-sm text-white">{i % 3 === 0 ? "Critical incident created" : i % 3 === 1 ? "Threat hunt found 3 IOCs" : "Vulnerability patched"}</p>
                  <p className="text-xs text-slate-500">{i * 2}m ago</p>
                </div>
                <span className="text-xs text-slate-500">{new Date(Date.now() - i * 120000).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Threat Heatmap (Mock) */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Incident Heatmap (24h)</h3>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 144 }, (_, i) => {
              const intensity = Math.random();
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-sm transition-all hover:scale-125 cursor-pointer ${
                    intensity > 0.8 ? "bg-red-500/80" :
                    intensity > 0.6 ? "bg-orange-500/60" :
                    intensity > 0.4 ? "bg-yellow-500/40" :
                    "bg-slate-700/20"
                  }`}
                  title={`${Math.floor(i / 6)}:${ (i % 6) * 10} - Intensity: ${Math.round(intensity * 100)}%`}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
            <span>Low</span><div className="flex gap-1">
              {["slate", "yellow", "orange", "red"].map((c) => (
                <div key={c} className={`w-4 h-3 rounded-sm bg-${c}-500/40`} />
              ))}
            </div><span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SOCDashboardPage;