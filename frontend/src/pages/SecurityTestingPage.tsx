import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/ui/Card';

interface TestResult {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'running' | 'pending';
  severity: 'critical' | 'high' | 'medium' | 'low';
  duration: number;
}

export function SecurityTestingPage() {
  const { theme } = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const tests: TestResult[] = [
    { id: '1', name: 'SAST - Static Analysis', status: 'pass', severity: 'high', duration: 2.3 },
    { id: '2', name: 'DAST - Dynamic Analysis', status: 'running', severity: 'critical', duration: 0 },
    { id: '3', name: 'Dependency Scan', status: 'pass', severity: 'medium', duration: 1.2 },
    { id: '4', name: 'Container Scan', status: 'fail', severity: 'high', duration: 3.1 },
    { id: '5', name: 'Secret Detection', status: 'pass', severity: 'critical', duration: 0.8 },
    { id: '6', name: 'License Compliance', status: 'pending', severity: 'low', duration: 0 }
  ];

  const handleRunTests = () => {
    setIsRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return '✅';
      case 'fail': return '❌';
      case 'running': return '⏳';
      case 'pending': return '⏳';
      default: return '⚪';
    }
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
          🔒 Security Testing
        </h1>
        <p style={{ color: theme.colors.textSecondary, marginTop: '8px' }}>
          SAST, DAST, dependency scanning, and compliance checks
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {[
          { label: 'Tests Run', value: tests.filter(t => t.status === 'pass' || t.status === 'fail').length, icon: '🧪', color: theme.colors.info },
          { label: 'Passed', value: tests.filter(t => t.status === 'pass').length, icon: '✅', color: theme.colors.success },
          { label: 'Failed', value: tests.filter(t => t.status === 'fail').length, icon: '❌', color: theme.colors.danger },
          { label: 'Avg Duration', value: '1.85s', icon: '⏱', color: theme.colors.warning }
        ].map((stat, idx) => (
          <Card key={idx}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ color: theme.colors.text, margin: 0 }}>Test Suite</h3>
          <button
            onClick={handleRunTests}
            disabled={isRunning}
            style={{
              padding: '10px 20px',
              background: isRunning ? theme.colors.background : theme.colors.primary,
              color: isRunning ? theme.colors.textSecondary : '#000',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isRunning ? '⏳ Running...' : '▶️ Run All Tests'}
          </button>
        </div>

        {isRunning && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: theme.colors.text, fontSize: '13px' }}>Progress...</span>
              <span style={{ color: theme.colors.primary, fontSize: '13px', fontWeight: 'bold' }}>{progress}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              background: theme.colors.background,
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                borderRadius: '3px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid ' + theme.colors.border }}>
                <th style={{ padding: '12px', textAlign: 'left', color: theme.colors.textSecondary, fontSize: '12px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', color: theme.colors.textSecondary, fontSize: '12px' }}>Test Name</th>
                <th style={{ padding: '12px', textAlign: 'left', color: theme.colors.textSecondary, fontSize: '12px' }}>Severity</th>
                <th style={{ padding: '12px', textAlign: 'left', color: theme.colors.textSecondary, fontSize: '12px' }}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {tests.map(test => (
                <tr key={test.id} style={{ borderBottom: '1px solid ' + theme.colors.border }}>
                  <td style={{ padding: '12px', fontSize: '16px' }}>{getStatusIcon(test.status)}</td>
                  <td style={{ padding: '12px', color: theme.colors.text, fontSize: '13px', fontWeight: 'bold' }}>{test.name}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      background: getSeverityColor(test.severity) + '20',
                      color: getSeverityColor(test.severity),
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {test.severity}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: theme.colors.textSecondary, fontSize: '13px' }}>
                    {test.duration > 0 ? test.duration + 's' : '--'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Card>
          <h3 style={{ color: theme.colors.text, marginBottom: '12px' }}>Test Types</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['SAST - Static Application Security Testing', 'DAST - Dynamic Application Security', 'Dependency Vulnerability Scanning', 'Container Image Scanning', 'Secret Detection', 'License Compliance'].map(tool => (
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
                <span style={{ color: theme.colors.primary }}>✓</span>
                {tool}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 style={{ color: theme.colors.text, marginBottom: '12px' }}>CI/CD Integration</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['GitHub Actions', 'GitLab CI', 'Jenkins', 'ArgoCD', 'CircleCI', 'Bitbucket Pipelines'].map(tool => (
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
                <span style={{ color: theme.colors.primary }}>✓</span>
                {tool}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
