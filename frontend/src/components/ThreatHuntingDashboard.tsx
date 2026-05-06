/**
 * Threat Hunting Dashboard Component
 * Displays threat hunting queries, campaigns, and results.
 */
import { useState, useEffect } from "react";
import {
  getHuntQueries,
  runHuntQuery,
  getHuntCampaigns,
  getHuntStatistics,
  getMITRECoverage,
} from "../api/securityEndpoints";

interface HuntQuery {
  query_id: string;
  name: string;
  description: string;
  mitre_tactics: string[];
  severity: string;
  tags: string[];
}

interface HuntCampaign {
  campaign_id: string;
  name: string;
  status: string;
  findings_count: number;
}

interface HuntStats {
  total_queries: number;
  total_campaigns: number;
  total_results: number;
  mitre_coverage: {
    coverage_percentage: number;
  };
}

export function ThreatHuntingDashboard() {
  const [queries, setQueries] = useState<HuntQuery[]>([]);
  const [campaigns, setCampaigns] = useState<HuntCampaign[]>([]);
  const [stats, setStats] = useState<HuntStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [queriesRes, campaignsRes, statsRes] = await Promise.all([
          getHuntQueries(),
          getHuntCampaigns(),
          getHuntStatistics(),
        ]);
        setQueries(queriesRes.data.queries || []);
        setCampaigns(campaignsRes.data.campaigns || []);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Failed to fetch hunt data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="animate-pulse">Loading threat hunting data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-gray-400 text-sm">Total Queries</h4>
            <p className="text-2xl font-bold text-white">
              {stats.total_queries}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-gray-400 text-sm">Campaigns</h4>
            <p className="text-2xl font-bold text-white">
              {stats.total_campaigns}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-gray-400 text-sm">Results Found</h4>
            <p className="text-2xl font-bold text-white">
              {stats.total_results}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-gray-400 text-sm">MITRE Coverage</h4>
            <p className="text-2xl font-bold text-green-500">
              {stats.mitre_coverage?.coverage_percentage || 0}%
            </p>
          </div>
        </div>
      )}

      {/* Queries List */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-white font-medium mb-4">Hunt Queries</h3>
        <div className="space-y-3">
          {queries.map((query) => (
            <div
              key={query.query_id}
              className="border-b border-gray-700 pb-3 last:border-0"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{query.name}</p>
                  <p className="text-gray-500 text-sm">{query.description}</p>
                  <div className="flex gap-2 mt-1">
                    {query.mitre_tactics?.map((tactic) => (
                      <span
                        key={tactic}
                        className="px-2 py-1 bg-blue-600 text-xs rounded"
                      >
                        {tactic}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => runHuntQuery(query.query_id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Run
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaigns */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-white font-medium mb-4">Campaigns</h3>
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign.campaign_id}
              className="flex items-center justify-between border-b border-gray-700 pb-3"
            >
              <div>
                <p className="text-white font-medium">{campaign.name}</p>
                <p className="text-gray-500 text-sm">Status: {campaign.status}</p>
              </div>
              <div className="text-right">
                <p className="text-white">{campaign.findings_count} findings</p>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    campaign.status === "completed"
                      ? "bg-green-600"
                      : "bg-yellow-600"
                  } text-white`}
                >
                  {campaign.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ThreatHuntingDashboard;