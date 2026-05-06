import React from 'react';

export function SLAManagerPage() {
  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: '#0a0e27', color: '#fff' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: '#00ff88', fontSize: '28px' }}>
          SLA Manager
        </h1>
        <p style={{ color: '#a0a0b0', marginTop: '8px' }}>
          Manage service level agreements and track compliance
        </p>
      </div>

      <div style={{
        background: '#1a1f3a',
        borderRadius: '16px',
        border: '1px solid #2a2f4a',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📊</div>
        <h2 style={{ color: '#fff', marginBottom: '8px' }}>SLA Management</h2>
        <p style={{ color: '#a0a0b0' }}>
          4 tiers with penalty calculations and priority support.
        </p>
        <div style={{
          marginTop: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {[
            { tier: 'Basic', uptime: '99.0%', price: '$0', color: '#a0a0b0' },
            { tier: 'Standard', uptime: '99.5%', price: '$99', color: '#0099ff' },
            { tier: 'Premium', uptime: '99.9%', price: '$299', color: '#00ff88' },
            { tier: 'Enterprise', uptime: '99.99%', price: '$999', color: '#ff9900' }
          ].map((tier, idx) => (
            <div key={idx} style={{
              padding: '20px',
              background: '#0a0e27',
              borderRadius: '12px',
              border: `2px solid ${tier.color}`
            }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
                {tier.tier}
              </div>
              <div style={{ fontSize: '14px', color: '#a0a0b0', marginBottom: '4px' }}>
                Uptime: {tier.uptime}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: tier.color }}>
                {tier.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
