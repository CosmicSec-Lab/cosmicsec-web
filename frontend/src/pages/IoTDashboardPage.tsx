import React from 'react';

export function IoTDashboardPage() {
  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: '#0a0e27', color: '#fff' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: '#00ff88', fontSize: '28px' }}>
          IoT/OT Security Dashboard
        </h1>
        <p style={{ color: '#a0a0b0', marginTop: '8px' }}>
          Monitor and secure all Internet of Things devices
        </p>
      </div>

      <div style={{
        background: '#1a1f3a',
        borderRadius: '16px',
        border: '1px solid #2a2f4a',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📡</div>
        <h2 style={{ color: '#fff', marginBottom: '8px' }}>IoT Security</h2>
        <p style={{ color: '#a0a0b0' }}>
          Monitor IoT devices, OT networks, and industrial protocols.
        </p>
        <div style={{
          marginTop: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {[
            { label: 'Devices', value: '1,234', color: '#00ff88' },
            { label: 'Alerts', value: '12', color: '#ff9900' },
            { label: 'Protocols', value: '6', color: '#0099ff' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              padding: '20px',
              background: '#0a0e27',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', color: '#a0a0b0' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
