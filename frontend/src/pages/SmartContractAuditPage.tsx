import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/ui/Card';

interface AuditIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  contract: string;
  issue: string;
  line: number;
  description: string;
}

export function SmartContractAuditPage() {
  const { theme } = useTheme();
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);

  const issues: AuditIssue[] = [
    { id: '1', severity: 'critical', contract: 'TokenSwap.sol', issue: 'Reentrancy Vulnerability', line: 142, description: 'Function allows recursive calls before state update' },
    { id: '2', severity: 'high', contract: 'NFTMarket.vy', issue: 'Integer Overflow', line: 89, description: 'Unchecked arithmetic operation may overflow' },
    { id: '3', severity: 'medium', contract: 'Staking.sol', issue: 'Unchecked Return Value', line: 203, description: 'External call return value not validated' },
    { id: '4', severity: 'low', contract: 'Governance.go', issue: 'Missing Event Emission', line: 56, description: 'State changes should emit events' }
  ];

  const handleStartAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);
    }, 3000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ff0000';
      case 'high': return '#ff9900';
      case 'medium': return '#ffff00';
      case 'low': return '#00ff88';
      default: return '#888';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: theme.colors.primary, fontSize: '28px' }}>
          📝 Smart Contract Audit
        </h1>
        <p style={{ color: theme.colors.textSecondary, marginTop: '8px' }}>
          Automated security audits for Solidity, Vyper, Go, and Rust smart contracts
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {[
          { label: 'Contracts Scanned', value: '12', icon: '📄', color: theme.colors.info },
          { label: 'Issues Found', value: issues.length, icon: '⚠️', color: theme.colors.warning },
          { label: 'Critical', value: issues.filter(i => i.severity === 'critical').length, icon: '🔴', color: theme.colors.danger },
          { label: 'Security Score', value: '85/100', icon: '🛡️', color: theme.colors.success }
        ].map((stat, idx) => (
          <Card key={idx}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>{stat.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ color: theme.colors.text, margin: 0 }}>Audit Controls</h3>
          <button
            onClick={handleStartAudit}
            disabled={isAuditing}
            style={{
              padding: '10px 20px',
              background: isAuditing ? theme.colors.background : theme.colors.primary,
              color: isAuditing ? theme.colors.textSecondary : '#000',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: isAuditing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isAuditing ? '⏳ Auditing...' : '▶️ Start Audit'}
          </button>
        </div>

        {isAuditing && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: theme.colors.text, fontSize: '13px' }}>Scanning contracts...</span>
              <span style={{ color: theme.colors.primary, fontSize: '13px' }}>45%</span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              background: theme.colors.background,
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '45%',
                height: '100%',
                background: theme.colors.primary,
                borderRadius: '3px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        {auditComplete && (
          <div style={{
            padding: '12px 16px',
            background: '#00ff8820',
            border: '1px solid #00ff8840',
            borderRadius: '8px',
            color: '#00ff88',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            ✅ Audit Complete! Found {issues.length} issues requiring attention.
          </div>
        )}
      </Card>

      <h3 style={{ color: theme.colors.text, marginBottom: '16px' }}>Detected Issues</h3>
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid ' + theme.colors.border }}>
                <th style={{ padding: '12px', textAlign: 'left', color: theme.colors.textSecondary, fontSize: '12px' }}>Severity</th>
                <th style={{ padding: '12px', textAlign: 'left', color: theme.colors.textSecondary, fontSize: '12px' }}>Contract</th>
                <th style={{ padding: '12px', textAlign: 'left', color: theme.colors.textSecondary, fontSize: '12px' }}>Issue</th>
                <th style={{ padding: '12px', textAlign: 'left', color: theme.colors.textSecondary, fontSize: '12px' }}>Line</th>
                <th style={{ padding: '12px', textAlign: 'left', color: theme.colors.textSecondary, fontSize: '12px' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {issues.map(issue => (
                <tr key={issue.id} style={{ borderBottom: '1px solid ' + theme.colors.border }}>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      background: getSeverityColor(issue.severity) + '20',
                      color: getSeverityColor(issue.severity),
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {issue.severity}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: theme.colors.text, fontSize: '13px', fontWeight: 'bold' }}>{issue.contract}</td>
                  <td style={{ padding: '12px', color: theme.colors.text, fontSize: '13px' }}>{issue.issue}</td>
                  <td style={{ padding: '12px', color: theme.colors.textSecondary, fontSize: '13px' }}>{issue.line}</td>
                  <td style={{ padding: '12px', color: theme.colors.textSecondary, fontSize: '12px' }}>{issue.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Card>
          <h3 style={{ color: theme.colors.text, marginBottom: '12px' }}>Supported Languages</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Solidity (.sol)', 'Vyper (.vy)', 'Go (.go)', 'Rust (.rs)'].map(lang => (
              <div key={lang} style={{
                padding: '8px 12px',
                background: theme.colors.background,
                borderRadius: '6px',
                color: theme.colors.text,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ color: theme.colors.primary }}>✓</span>
                {lang}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 style={{ color: theme.colors.text, marginBottom: '12px' }}>Audit Tools</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Slither Analyzer', 'Mythril', 'Securify', 'Oyente'].map(tool => (
              <div key={tool} style={{
                padding: '8px 12px',
                background: theme.colors.background,
                borderRadius: '6px',
                color: theme.colors.text,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ color: theme.colors.primary }}>⚙️</span>
                {tool}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
