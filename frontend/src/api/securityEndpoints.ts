/**
 * CosmicSec Security API Endpoints
 * 
 * Security operations APIs: metrics, incidents, vulnerabilities, threat hunting, compliance.
 */
import client from "./client";

/* ---------- Security Metrics Types ---------- */
export interface SecurityMetric {
  metric_id: string;
  name: string;
  category: string;
  value: number;
  unit: string;
  trend: string;
  delta: number;
  target: number;
  threshold_warning: number;
  threshold_critical: number;
  source: string;
  tags: string[];
  last_updated: string;
}

export interface KPIDefinition {
  kpi_id: string;
  name: string;
  description: string;
  formula: string;
  unit: string;
  target: number;
  warning_threshold: number;
  critical_threshold: number;
  category: string;
}

/* ---------- Incident Types ---------- */
export interface Incident {
  incident_id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  playbook_id: string;
  assignee: string;
  assignees: string[];
  timeline: TimelineEntry[];
  affected_assets: string[];
  iocs: string[];
  mitre_tactics: string[];
  created_at: string;
  first_response_at: string | null;
  updated_at: string;
  resolved_at: string | null;
  sla_status: string;
  escalation_level: string;
  notes: string[];
}

export interface TimelineEntry {
  entry_id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}

export interface Playbook {
  playbook_id: string;
  name: string;
  description: string;
  category: string;
  severity: string;
  actions: PlaybookAction[];
  auto_execute: boolean;
  enabled: boolean;
}

export interface PlaybookAction {
  action_id: string;
  action_type: string;
  parameters: Record<string, unknown>;
  timeout_seconds: number;
  retry_count: number;
}

/* ---------- Vulnerability Types ---------- */
export interface Vulnerability {
  vuln_id: string;
  cve_id: string | null;
  title: string;
  description: string;
  severity: string;
  status: string;
  source: string;
  cvss_score: number;
  cvss_vector: string;
  exploit_status: string;
  exploitability: string;
  affected_assets: string[];
  cwe_id: string;
  discovered_at: string;
  patched_at: string | null;
  assignee: string;
  priority: number;
  epss_score: number;
  notes: string[];
  references: string[];
  tags: string[];
}

export interface RemediationTask {
  task_id: string;
  vuln_id: string;
  asset: string;
  action: string;
  assigned_to: string;
  status: string;
  due_date: string | null;
  completed_at: string | null;
}

/* ---------- Threat Hunting Types ---------- */
export interface HuntQuery {
  query_id: string;
  name: string;
  description: string;
  query_string: string;
  data_sources: string[];
  schedule: string;
  technique_id: string;
  mitre_tactics: string[];
  tags: string[];
  severity: string;
}

export interface HuntResult {
  result_id: string;
  hunt_id: string;
  timestamp: string;
  indicator: string;
  indicator_type: string;
  confidence: number;
  severity: string;
  technique_id: string;
  mitre_tactic: string;
  details: Record<string, unknown>;
  related_indicators: string[];
  false_positive_likelihood: string;
}

export interface HuntCampaign {
  campaign_id: string;
  name: string;
  description: string;
  queries: string[];
  status: string;
  priority: string;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  findings_count: number;
}

export interface AttackChain {
  chain_id: string;
  name: string;
  start_time: string;
  end_time: string | null;
  stages: Record<string, unknown>[];
  severity: string;
  affected_assets: string[];
  related_alerts: string[];
  status: string;
}

/* ---------- API Functions ---------- */

/* Metrics API */
export const getMetrics = async (category?: string, status?: string) => {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (status) params.append("status", status);
  const response = await client.get(`/api/v1/metrics?${params}`);
  return response.data;
};

export const getMetric = async (metricId: string) => {
  const response = await client.get(`/api/v1/metrics/${metricId}`);
  return response.data;
};

export const getKPIs = async () => {
  const response = await client.get("/api/v1/kpis");
  return response.data;
};

export const getDashboard = async () => {
  const response = await client.get("/api/v1/dashboard");
  return response.data;
};

/* Incident API */
export const getIncidents = async (params?: { status?: string; severity?: string; limit?: number }) => {
  const response = await client.get("/api/v1/incidents", { params });
  return response.data;
};

export const getIncident = async (incidentId: string) => {
  const response = await client.get(`/api/v1/incidents/${incidentId}`);
  return response.data;
};

export const createIncident = async (data: {
  title: string;
  description: string;
  category: string;
  severity: string;
  reporter?: string;
}) => {
  const response = await client.post("/api/v1/incidents", data);
  return response.data;
};

export const updateIncidentStatus = async (
  incidentId: string,
  data: { status: string; actor?: string; details?: string }
) => {
  const response = await client.patch(`/api/v1/incidents/${incidentId}/status`, data);
  return response.data;
};

export const getIncidentSLA = async (incidentId: string) => {
  const response = await client.get(`/api/v1/incidents/${incidentId}/sla`);
  return response.data;
};

export const getPlaybooks = async () => {
  const response = await client.get("/api/v1/incidents/playbooks");
  return response.data;
};

export const getIncidentStatistics = async () => {
  const response = await client.get("/api/v1/incidents/statistics");
  return response.data;
};

/* Vulnerability API */
export const getVulnerabilities = async (params?: {
  status?: string;
  severity?: string;
  source?: string;
  limit?: number;
}) => {
  const response = await client.get("/api/v1/vulnerabilities", { params });
  return response.data;
};

export const getVulnerability = async (vulnId: string) => {
  const response = await client.get(`/api/v1/vulnerabilities/${vulnId}`);
  return response.data;
};

export const createVulnerability = async (data: {
  title: string;
  description: string;
  severity: string;
  source: string;
  cve_id?: string;
  cvss_score?: number;
}) => {
  const response = await client.post("/api/v1/vulnerabilities", data);
  return response.data;
};

export const getPrioritizedVulns = async (limit: number = 50) => {
  const response = await client.get("/api/v1/vulnerabilities/prioritized", { params: { limit } });
  return response.data;
};

export const getRemediationPlan = async () => {
  const response = await client.get("/api/v1/vulnerabilities/remediation-plan");
  return response.data;
};

export const getVulnerabilityStatistics = async () => {
  const response = await client.get("/api/v1/vulnerabilities/statistics");
  return response.data;
};

/* Threat Hunting API */
export const getHuntQueries = async (params?: { tag?: string; mitre_tactic?: string }) => {
  const response = await client.get("/api/v1/threat-hunter/queries", { params });
  return response.data;
};

export const runHuntQuery = async (queryId: string) => {
  const response = await client.post(`/api/v1/threat-hunter/run/${queryId}`);
  return response.data;
};

export const getHuntCampaigns = async (limit: number = 20) => {
  const response = await client.get("/api/v1/threat-hunter/campaigns", { params: { limit } });
  return response.data;
};

export const createHuntCampaign = async (data: {
  name: string;
  query_ids: string[];
  priority?: string;
}) => {
  const response = await client.post("/api/v1/threat-hunter/campaigns", data);
  return response.data;
};

export const getHuntStatistics = async () => {
  const response = await client.get("/api/v1/threat-hunter/statistics");
  return response.data;
};

export const getMITRECoverage = async () => {
  const response = await client.get("/api/v1/threat-hunter/mitre-coverage");
  return response.data;
};

/* Operations API */
export const getOperationsSummary = async () => {
  const response = await client.get("/api/v1/operations/summary");
  return response.data;
};

export const getOperationsTimeline = async (limit: number = 50) => {
  const response = await client.get("/api/v1/operations/timeline", { params: { limit } });
  return response.data;
};