/**
 * Security Operations Dashboard Component
 * Real-time security metrics, incidents, vulnerabilities display.
 */
import { useState, useEffect } from "react";
import {
  getOperationsSummary,
  getDashboard,
  getIncidents,
  getVulnerabilities,
} from "../api/securityEndpoints";

interface DashboardStats {
  metrics: Record<string, unknown>;
  incidents: Record<string, unknown>;
  vulnerabilities: Record<string, unknown>;
  threat_hunting: Record<string, unknown>;
  security_score: number;
}

interface Incident {
  incident_id: string;
  title: string;
  severity: string;
  status: string;
  created_at: string;
}

interface Vulnerability {
  vuln_id: string;
  cve_id: string | null;
  title: string;
  severity: string;
  cvss_score: number;
  status: string;
}

interface SecurityScoreCardProps {
  score: number;
}

export function SecurityScoreCard({ score }: SecurityScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "At Risk";
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-gray-400 text-sm font-medium">Security Score</h3>
      <div className={`text-4xl font-bold mt-2 ${getScoreColor(score)}`}>
        {score}
      </div>
      <p className="text-gray-500 text-sm mt-1">{getScoreLabel(score)}</p>
      <div className="mt-4 bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  change?: string;
  status?: "success" | "warning" | "danger";
}

export function StatCard({ title, value, change, status }: StatCardProps) {
  const statusColors = {
    success: "text-green-500",
    warning: "text-yellow-500",
    danger: "text-red-500",
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <p className={`text-2xl font-bold mt-2 ${status ? statusColors[status] : "text-white"}`}>
        {value}
      </p>
      {change && (
        <p className={`text-sm mt-1 ${status ? statusColors[status] : "text-gray-500"}`}>
          {change}
        </p>
      )}
    </div>
  );
}

interface SeverityBadgeProps {
  severity: string;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const colors = {
    critical: "bg-red-600",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
    info: "bg-blue-500",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium text-white ${
        colors[severity as keyof typeof colors] || "bg-gray-500"
      }`}
    >
      {severity.toUpperCase()}
    </span>
  );
}

interface IncidentRowProps {
  incident: Incident;
}

export function IncidentRow({ incident }: IncidentRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-700">
      <div className="flex-1">
        <p className="text-white font-medium">{incident.title}</p>
        <p className="text-gray-500 text-sm">{incident.incident_id}</p>
      </div>
      <SeverityBadge severity={incident.severity} />
      <span className="ml-4 text-gray-400 text-sm capitalize">{incident.status}</span>
    </div>
  );
}

interface VulnerabilityRowProps {
  vulnerability: Vulnerability;
}

export function VulnerabilityRow({ vulnerability }: VulnerabilityRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-700">
      <div className="flex-1">
        <p className="text-white font-medium">
          {vulnerability.cve_id || vulnerability.vuln_id}
        </p>
        <p className="text-gray-500 text-sm truncate max-w-md">
          {vulnerability.title}
        </p>
      </div>
      {vulnerability.cvss_score > 0 && (
        <span className="text-yellow-500 font-medium mr-4">
          {vulnerability.cvss_score.toFixed(1)}
        </span>
      )}
      <SeverityBadge severity={vulnerability.severity} />
    </div>
  );
}

interface SecurityDashboardProps {
  refreshInterval?: number;
}

export function SecurityDashboard({ refreshInterval = 30000 }: SecurityDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [summaryData, incidentsData, vulnsData] = await Promise.all([
          getOperationsSummary(),
          getIncidents({ limit: 5 }),
          getVulnerabilities({ limit: 5 }),
        ]);
        
        setStats(summaryData.data);
        setIncidents(incidentsData.data.incidents || []);
        setVulnerabilities(vulnsData.data.vulnerabilities || []);
      } catch (err) {
        setError("Failed to load security data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-800 h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400">
        {error}
      </div>
    );
  }

  const metrics = stats?.metrics as Record<string, unknown> || {};
  const vulnStats = stats?.vulnerabilities as Record<string, unknown> || {};

  return (
    <div className="space-y-6">
      {/* Security Score */}
      <SecurityScoreCard score={stats?.security_score || 0} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Open Incidents"
          value={metrics.open_incidents || 0}
          status="warning"
        />
        <StatCard
          title="Critical Vulns"
          value={vulnStats.critical_open || 0}
          status="danger"
        />
        <StatCard
          title="Avg Response Time"
          value={metrics.avg_response_time || "N/A"}
        />
        <StatCard
          title="Patch Rate"
          value={`${metrics.patch_compliance || 0}%`}
          status="success"
        />
      </div>

      {/* Incidents & Vulnerabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Incidents */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Recent Incidents</h3>
            <a href="/incidents" className="text-blue-500 text-sm hover:underline">
              View All
            </a>
          </div>
          {incidents.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {incidents.map((incident) => (
                <IncidentRow key={incident.incident_id} incident={incident} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent incidents</p>
          )}
        </div>

        {/* Critical Vulnerabilities */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Critical Vulnerabilities</h3>
            <a href="/vulnerabilities" className="text-blue-500 text-sm hover:underline">
              View All
            </a>
          </div>
          {vulnerabilities.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {vulnerabilities.map((vuln) => (
                <VulnerabilityRow key={vuln.vuln_id} vulnerability={vuln} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No vulnerabilities</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SecurityDashboard;