import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/ui/Card';

export function NLPSearchPage() {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const sampleResults = [
    { id: 1, type: 'vulnerability', title: 'CVE-2024-1234: Critical RCE in Web Framework', severity: 'critical', score: 9.8 },
    { id: 2, type: 'threat', title: 'Advanced Persistent Threat Group Targeting Finance Sector', severity: 'high', score: 8.5 },
    { id: 3, type: 'compliance', title: 'GDPR Article 32 Compliance Check Failed', severity: 'medium', score: 6.2 },
    { id: 4, type: 'scan', title: 'Recent Scan Found 15 New Vulnerabilities', severity: 'high', score: 7.8 }
  ];

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setResults(sampleResults);
      setIsSearching(false);
    }, 1000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ff0000';
      case 'high': return '#ff9900';
      case 'medium': return '#ffff00';
      default: return '#00ff88';
    }
  };

  const getIntentBadge = (type: string) => {
    const colors: { [key: string]: string } = {
      'vulnerability': '#ff000020',
      'threat': '#ff990020',
      'compliance': '#ffff0020',
      'scan': '#00ff8820'
    };
    return colors[type] || '#88888820';
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: theme.colors.primary, fontSize: '28px' }}>
          🔍 NLP Search
        </h1>
        <p style={{ color: theme.colors.textSecondary, marginTop: '8px' }}>
          Natural Language Processing search with intent recognition and entity extraction
        </p>
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Try: 'show me critical vulnerabilities from last week' or 'find GDPR compliance issues'"
            style={{
              flex: 1,
              padding: '12px 16px',
              background: theme.colors.background,
              color: theme.colors.text,
              border: '1px solid ' + theme.colors.border,
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            style={{
              padding: '12px 24px',
              background: theme.colors.primary,
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: isSearching ? 'not-allowed' : 'pointer',
              opacity: isSearching ? 0.6 : 1
            }}
          >
            {isSearching ? 'Searching...' : '🔍 Search'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Show critical vulnerabilities', 'Find IoT devices at risk', 'Check SLA compliance', 'Recent threat intel'].map(suggestion => (
            <button
              key={suggestion}
              onClick={() => { setQuery(suggestion); }}
              style={{
                padding: '6px 12px',
                background: theme.colors.primary + '20',
                color: theme.colors.primary,
                border: '1px solid ' + theme.colors.primary + '40',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </Card>

      {results.length > 0 && (
        <div>
          <h2 style={{ color: theme.colors.text, marginBottom: '16px' }}>
            Search Results ({results.length})
          </h2>
          {results.map(result => (
            <Card key={result.id} style={{ marginBottom: '12px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      padding: '2px 8px',
                      background: getIntentBadge(result.type),
                      color: theme.colors.text,
                      borderRadius: '4px',
                      fontSize: '11px',
                      textTransform: 'uppercase'
                    }}>
                      {result.type}
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      background: getSeverityColor(result.severity) + '20',
                      color: getSeverityColor(result.severity),
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      {result.severity}
                    </span>
                  </div>
                  <div style={{ color: theme.colors.text, fontWeight: 'bold', marginBottom: '4px' }}>
                    {result.title}
                  </div>
                  <div style={{ color: theme.colors.textSecondary, fontSize: '12px' }}>
                    Confidence Score: {result.score}/10
                  </div>
                </div>
                <div style={{ color: theme.colors.textSecondary, fontSize: '12px' }}>
                  →
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Card>
          <h3 style={{ color: theme.colors.text, marginBottom: '12px' }}>Intent Recognition</h3>
          <div style={{ fontSize: '13px', color: theme.colors.textSecondary, lineHeight: '1.6' }}>
            <div>✓ Vulnerability Detection</div>
            <div>✓ Threat Hunting</div>
            <div>✓ Compliance Checking</div>
            <div>✓ Asset Discovery</div>
            <div>✓ Risk Assessment</div>
          </div>
        </Card>
        <Card>
          <h3 style={{ color: theme.colors.text, marginBottom: '12px' }}>Entity Extraction</h3>
          <div style={{ fontSize: '13px', color: theme.colors.textSecondary, lineHeight: '1.6' }}>
            <div>📍 CVE Identifiers</div>
            <div>🏢 Organizations</div>
            <div>🔢 IP Addresses</div>
            <div>📅 Dates & Times</div>
            <div>⚠️ Severity Levels</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
