import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/ui/Card';

export function DDoSProtectionPage() {
  const { theme } = useTheme();
  const [rateLimit, setRateLimit] = useState(10000);
  const [isEnabled, setIsEnabled] = useState(true);

  const stats = {
    requestsBlocked: 15423,
    currentRPS: 3456,
    peakRPS: 8923,
    allowedIPs: 1234,
    challengeMode: 'Interactive'
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: theme.colors.primary, fontSize: '28px' }}>
          🛡️ DDoS Protection
        </h1>
        <p style={{ color: theme.colors.textSecondary, marginTop: '8px' }}>
          Advanced rate limiting, challenge-response, and IP reputation-based protection
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: isEnabled ? '#00ff88' : '#ff0000',
            animation: isEnabled ? 'pulse 2s infinite' : 'none'
          }} />
          <span style={{ color: theme.colors.text, fontWeight: 'bold' }}>
            {isEnabled ? 'Protection Active' : 'Protection Disabled'}
          </span>
        </div>
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          style={{
            padding: '8px 16px',
            background: isEnabled ? '#ff000020' : '#00ff8820',
            color: isEnabled ? '#ff0000' : '#00ff88',
            border: `1px solid ${isEnabled ? '#ff000040' : '#00ff8840'}`,
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isEnabled ? '🛑 Disable Protection' : '✅ Enable Protection'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {[
          { label: 'Requests Blocked', value: stats.requestsBlocked.toLocaleString(), icon: '🛑', color: theme.colors.danger },
          { label: 'Current RPS', value: stats.currentRPS.toLocaleString(), icon: '⚡', color: theme.colors.warning },
          { label: 'Peak RPS', value: stats.peakRPS.toLocaleString(), icon: '📈', color: theme.colors.info },
          { label: 'Allowed IPs', value: stats.allowedIPs.toLocaleString(), icon: '✅', color: theme.colors.success }
        ].map((stat, idx) => (
          <Card key={idx}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>{stat.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <Card>
          <h3 style={{ color: theme.colors.text, marginBottom: '16px' }}>Rate Limiting</h3>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: theme.colors.textSecondary, fontSize: '12px', marginBottom: '8px' }}>
              Requests Per Second (RPS) Limit
            </label>
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={rateLimit}
              onChange={(e) => setRateLimit(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ color: theme.colors.text, fontWeight: 'bold' }}>{rateLimit.toLocaleString()} RPS</span>
              <span style={{ color: theme.colors.textSecondary, fontSize: '12px' }}>Max: 50,000</span>
            </div>
          </div>
          <div style={{
            padding: '12px',
            background: theme.colors.background,
            borderRadius: '8px',
            fontSize: '12px',
            color: theme.colors.textSecondary
          }}>
            💡 Token bucket algorithm with sliding window support
          </div>
        </Card>

        <Card>
          <h3 style={{ color: theme.colors.text, marginBottom: '16px' }}>Challenge Mode</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['JavaScript Challenge', 'CAPTCHA', 'Interactive', 'None'].map(mode => (
              <div
                key={mode}
                onClick={() => {}}
                style={{
                  padding: '10px 12px',
                  background: stats.challengeMode === mode ? theme.colors.primary + '20' : 'transparent',
                  border: `1px solid ${stats.challengeMode === mode ? theme.colors.primary : theme.colors.border}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ color: theme.colors.text, fontSize: '13px' }}>{mode}</span>
                {stats.challengeMode === mode && (
                  <span style={{ color: theme.colors.primary, fontSize: '16px' }}>✓</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 style={{ color: theme.colors.text, marginBottom: '16px' }}>IP Reputation</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          {[
            { status: 'Clean', count: 10234, color: '#00ff88' },
            { status: 'Suspicious', count: 892, color: '#ff9900' },
            { status: 'Malicious', count: 156, color: '#ff0000' }
          ].map(reputation => (
            <div key={reputation.status} style={{
              padding: '16px',
              background: theme.colors.background,
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: reputation.color }}>
                {reputation.count.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginTop: '4px' }}>
                {reputation.status}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
