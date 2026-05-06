import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/ui/Card';

interface EdgeNode {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'degraded';
  latency: number;
  devices: number;
}

export function EdgeComputingPage() {
  const { theme } = useTheme();
  const [nodes] = useState<EdgeNode[]>([
    { id: 'edge-001', name: 'US East (N. Virginia)', location: 'us-east-1', status: 'online', latency: 12, devices: 1245 },
    { id: 'edge-002', name: 'EU West (Ireland)', location: 'eu-west-1', status: 'online', latency: 8, devices: 892 },
    { id: 'edge-003', name: 'APAC South (Tokyo)', location: 'ap-south-1', status: 'degraded', latency: 45, devices: 567 },
    { id: 'edge-004', name: 'US West (Oregon)', location: 'us-west-2', status: 'online', latency: 15, devices: 1023 },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#00ff88';
      case 'degraded': return '#ff9900';
      case 'offline': return '#ff0000';
      default: return '#888';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: theme.colors.primary, fontSize: '28px' }}>
          ⚡ Edge Computing
        </h1>
        <p style={{ color: theme.colors.textSecondary, marginTop: '8px' }}>
          Manage distributed edge nodes, fog computing, and CDN integration for low-latency security
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {[
          { label: 'Active Nodes', value: nodes.filter(n => n.status === 'online').length, icon: '🟢', color: theme.colors.success },
          { label: 'Total Devices', value: nodes.reduce((sum, n) => sum + n.devices, 0), icon: '📡', color: theme.colors.info },
          { label: 'Avg Latency', value: (nodes.reduce((sum, n) => sum + n.latency, 0) / nodes.length).toFixed(0) + 'ms', icon: '⚡', color: theme.colors.warning },
          { label: 'Degraded Nodes', value: nodes.filter(n => n.status === 'degraded').length, icon: '⚠️', color: theme.colors.danger }
        ].map((stat, idx) => (
          <Card key={idx}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
          </Card>
        ))}
      </div>

      <h2 style={{ color: theme.colors.text, marginBottom: '16px' }}>Edge Nodes</h2>
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid ' + theme.colors.border }}>
                <th style={{ padding: '12px', textAlign: 'left', color: theme.colors.textSecondary, fontSize: '12px', textTransform: 'uppercase' }}>Node</th>
                <th style={{ padding: '12px', textAlign: 'left', color: theme.colors.textSecondary, fontSize: '12px', textTransform: 'uppercase' }}>Location</th>
                <th style={{ padding: '12px', textAlign: 'left', color: theme.colors.textSecondary, fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', color: theme.colors.textSecondary, fontSize: '12px', textTransform: 'uppercase' }}>Latency</th>
                <th style={{ padding: '12px', textAlign: 'left', color: theme.colors.textSecondary, fontSize: '12px', textTransform: 'uppercase' }}>Devices</th>
                <th style={{ padding: '12px', textAlign: 'left', color: theme.colors.textSecondary, fontSize: '12px', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map(node => (
                <tr key={node.id} style={{ borderBottom: '1px solid ' + theme.colors.border }}>
                  <td style={{ padding: '12px', color: theme.colors.text, fontWeight: 'bold' }}>{node.name}</td>
                  <td style={{ padding: '12px', color: theme.colors.textSecondary, fontSize: '13px' }}>{node.location}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: getStatusColor(node.status)
                      }} />
                      <span style={{ fontSize: '13px', textTransform: 'capitalize', color: theme.colors.text }}>
                        {node.status}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: theme.colors.text, fontSize: '13px' }}>{node.latency}ms</td>
                  <td style={{ padding: '12px', color: theme.colors.text, fontSize: '13px' }}>{node.devices.toLocaleString()}</td>
                  <td style={{ padding: '12px' }}>
                    <button style={{
                      padding: '4px 12px',
                      background: theme.colors.primary + '20',
                      color: theme.colors.primary,
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>
                      Manage
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
          <h3 style={{ color: theme.colors.text, marginBottom: '12px' }}>Fog Computing</h3>
          <p style={{ color: theme.colors.textSecondary, fontSize: '13px', lineHeight: '1.6' }}>
            Process data closer to IoT devices, reducing bandwidth and improving response times.
            Perfect for real-time security analytics at the edge.
          </p>
          <button style={{
            marginTop: '12px',
            padding: '8px 16px',
            background: theme.colors.primary,
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '13px'
          }}>
            Configure Fog Nodes
          </button>
        </Card>
        <Card>
          <h3 style={{ color: theme.colors.text, marginBottom: '12px' }}>CDN Integration</h3>
          <p style={{ color: theme.colors.textSecondary, fontSize: '13px', lineHeight: '1.6' }}>
            Distribute security rules and threat intelligence globally via CDN for
            faster threat response and reduced origin server load.
          </p>
          <button style={{
            marginTop: '12px',
            padding: '8px 16px',
            background: theme.colors.primary,
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '13px'
          }}>
            Setup CDN
          </button>
        </Card>
      </div>
    </div>
  );
}
