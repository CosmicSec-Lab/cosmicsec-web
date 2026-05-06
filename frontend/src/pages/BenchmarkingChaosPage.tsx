import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/ui/Card';

interface BenchmarkResult {
  metric: string;
  value: number;
  target: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
}

export function BenchmarkingChaosPage() {
  const { theme } = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [chaosActive, setChaosActive] = useState(false);

  const benchmarks: BenchmarkResult[] = [
    { metric: 'Request Latency (p99)', value: 145, target: 200, unit: 'ms', status: 'good' },
    { metric: 'Throughput', value: 8500, target: 5000, unit: 'req/s', status: 'good' },
    { metric: 'Error Rate', value: 0.05, target: 1.0, unit: '%', status: 'good' },
    { metric: 'CPU Usage (avg)', value: 68, target: 80, unit: '%', status: 'warning' },
    { metric: 'Memory Usage (avg)', value: 72, target: 85, unit: '%', status: 'warning' },
    { metric: 'Database Connections', value: 45, target: 100, unit: 'active', status: 'good' }
  ];

  const chaosExperiments = [
    { id: '1', name: 'Pod Failure', description: 'Kill random pods in the cluster', status: chaosActive ? 'running' : 'stopped' },
    { id: '2', name: 'Network Latency', description: 'Inject 500ms latency to service', status: 'stopped' },
    { id: '3', name: 'CPU Stress', description: 'Consume 90% CPU on nodes', status: 'stopped' },
    { id: '4', name: 'Disk Failure', description: 'Simulate disk I/O errors', status: 'stopped' }
  ];

  const handleRunBenchmark = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 3000);
  };

  const toggleChaos = () => {
    setChaosActive(!chaosActive);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return '#00ff88';
      case 'warning': return '#ff9900';
      case 'critical': return '#ff0000';
      default: return '#888';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: theme.colors.primary, fontSize: '28px' }}>
          📈 Benchmarking & Chaos
        </h1>
        <p style={{ color: theme.colors.textSecondary, marginTop: '8px' }}>
          Performance testing, load testing, and chaos engineering for resilience
        </p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <Card style={{ flex: 1 }}>
          <h3 style={{ color: theme.colors.text, marginBottom: '12px' }}>Performance Benchmarks</h3>
          <button
            onClick={handleRunBenchmark}
            disabled={isRunning}
            style={{
              padding: '10px 20px',
              background: isRunning ? theme.colors.background : theme.colors.primary,
              color: isRunning ? theme.colors.textSecondary : '#000',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: isRunning ? 'not-allowed' : 'pointer'
            }}
          >
            {isRunning ? '⏳ Running...' : '▶️ Run Benchmark'}
          </button>
        </Card>

        <Card style={{ flex: 1 }}>
          <h3 style={{ color: theme.colors.text, marginBottom: '12px' }}>Chaos Engineering</h3>
          <button
            onClick={toggleChaos}
            style={{
              padding: '10px 20px',
              background: chaosActive ? '#ff000020' : '#00ff8820',
              color: chaosActive ? '#ff0000' : '#00ff88',
              border: `1px solid ${chaosActive ? '#ff000040' : '#00ff8840'}`,
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {chaosActive ? '⚠️ Chaos Active' : '✅ Chaos Disabled'}
          </button>
        </Card>
      </div>

      <h2 style={{ color: theme.colors.text, marginBottom: '16px' }}>Benchmark Results</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {benchmarks.map((metric, idx) => (
          <Card key={idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: theme.colors.textSecondary, fontSize: '12px' }}>{metric.metric}</span>
              <span style={{
                padding: '4px 8px',
                background: getStatusColor(metric.status) + '20',
                color: getStatusColor(metric.status),
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                {metric.value < metric.target ? 'GOOD' : 'WARNING'}
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: theme.colors.text, marginBottom: '8px' }}>
              {metric.value}<span style={{ fontSize: '14px', color: theme.colors.textSecondary }}> {metric.unit}</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: theme.colors.background, borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
                height: '100%',
                background: getStatusColor(metric.status),
                borderRadius: '3px'
              }} />
            </div>
            <div style={{ fontSize: '11px', color: theme.colors.textSecondary, marginTop: '4px' }}>
              Target: {metric.target} {metric.unit}
            </div>
          </Card>
        ))}
      </div>

      <h2 style={{ color: theme.colors.text, marginBottom: '16px' }}>Chaos Experiments</h2>
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid ' + theme.colors.border }}>
                <th style={{ padding: '12px', textAlign: 'left', color: theme.colors.textSecondary, fontSize: '12px' }}>Experiment</th>
                <th style={{ padding: '12px', textAlign: 'left', color: theme.colors.textSecondary, fontSize: '12px' }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'left', color: theme.colors.textSecondary, fontSize: '12px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', color: theme.colors.textSecondary, fontSize: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chaosExperiments.map(exp => (
                <tr key={exp.id} style={{ borderBottom: '1px solid ' + theme.colors.border }}>
                  <td style={{ padding: '12px', color: theme.colors.text, fontWeight: 'bold', fontSize: '13px' }}>{exp.name}</td>
                  <td style={{ padding: '12px', color: theme.colors.textSecondary, fontSize: '13px' }}>{exp.description}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      background: exp.status === 'running' ? '#ff990020' : '#00ff8820',
                      color: exp.status === 'running' ? '#ff9900' : '#00ff88',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {exp.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button style={{
                      padding: '6px 12px',
                      background: theme.colors.primary + '20',
                      color: theme.colors.primary,
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>
                      {exp.status === 'running' ? 'Stop' : 'Start'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Card>
          <h3 style={{ color: theme.colors.text, marginBottom: '12px' }}>Load Testing</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Concurrent Users: 10,000', 'Ramp-up: 5 minutes', 'Duration: 30 minutes', 'Target URL: https://api.cosmicsec.com'].map(detail => (
              <div key={detail} style={{
                padding: '8px 12px',
                background: theme.colors.background,
                borderRadius: '6px',
                color: theme.colors.text,
                fontSize: '13px'
              }}>
                {detail}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 style={{ color: theme.colors.text, marginBottom: '12px' }}>Resilience Score</h3>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '64px', fontWeight: 'bold', color: '#00ff88' }}>92%</div>
            <div style={{ fontSize: '14px', color: theme.colors.textSecondary }}>Excellent resilience rating</div>
            <div style={{
              width: '100%',
              height: '8px',
              background: theme.colors.background,
              borderRadius: '4px',
              marginTop: '16px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '92%',
                height: '100%',
                background: 'linear-gradient(90deg, #00ff88, #00cc66)',
                borderRadius: '4px'
              }} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
