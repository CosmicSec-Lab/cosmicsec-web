import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface SLATier {
  id: string;
  name: string;
  uptime: number;
  responseTime: number;
  supportLevel: 'basic' | 'standard' | 'priority' | 'dedicated';
  penaltyRate: number;
  price: number;
}

interface SLAIncident {
  id: string;
  service: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  breach: boolean;
  penaltyAmount?: number;
}

interface SLAManagerProps {
  tiers?: SLATier[];
  incidents?: SLAIncident[];
  currentTier?: string;
}

export const SLAManager: React.FC<SLAManagerProps> = ({ tiers: initialTiers, incidents: initialIncidents, currentTier: initialTier }) => {
  const { theme } = useTheme();
  const [tiers] = useState<SLATier[]>(initialTiers || [
    { id: 'basic', name: 'Basic', uptime: 99.0, responseTime: 24, supportLevel: 'basic', penaltyRate: 0.05, price: 0 },
    { id: 'standard', name: 'Standard', uptime: 99.5, responseTime: 8, supportLevel: 'standard', penaltyRate: 0.10, price: 99 },
    { id: 'premium', name: 'Premium', uptime: 99.9, responseTime: 4, supportLevel: 'priority', penaltyRate: 0.15, price: 299 },
    { id: 'enterprise', name: 'Enterprise', uptime: 99.99, responseTime: 1, supportLevel: 'dedicated', penaltyRate: 0.25, price: 999 }
  ]);
  
  const [incidents] = useState<SLAIncident[]>(initialIncidents || [
    {
      id: 'inc-001',
      service: 'API Gateway',
      startTime: new Date(Date.now() - 3600000).toISOString(),
      endTime: new Date().toISOString(),
      duration: 60,
      severity: 'high',
      breach: true,
      penaltyAmount: 150
    }
  ]);
  
  const [selectedTier, setSelectedTier] = useState<string>(initialTier || 'standard');
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('month');

  const currentTierData = tiers.find(t => t.id === selectedTier);

  const getSupportLabel = (level: string) => {
    switch (level) {
      case 'basic': return 'Community Forum';
      case 'standard': return 'Email & Chat';
      case 'priority': return '24/7 Priority';
      case 'dedicated': return 'Dedicated TAM';
      default: return level;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ff0000';
      case 'high': return '#ff9900';
      case 'medium': return '#ffff00';
      case 'low': return '#00ff88';
      default: return '#666';
    }
  };

  return (
    <div style={{
      padding: '24px',
      background: theme.colors.surface,
      borderRadius: '16px',
      border: `1px solid ${theme.colors.border}`,
      color: theme.colors.text
    }}>
      <h2 style={{ margin: '0 0 24px 0', color: theme.colors.primary }}>SLA Manager</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Service Tiers</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['day', 'week', 'month', 'year'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  style={{
                    padding: '6px 12px',
                    background: timeframe === t ? theme.colors.primary : 'transparent',
                    color: timeframe === t ? '#000' : theme.colors.text,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontSize: '12px'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {tiers.map(tier => (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                style={{
                  padding: '16px',
                  background: selectedTier === tier.id ? theme.colors.primary + '20' : theme.colors.background,
                  border: `2px solid ${selectedTier === tier.id ? theme.colors.primary : theme.colors.border}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>{tier.name}</div>
                <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '12px' }}>
                  ${tier.price}/mo
                </div>
                <div style={{ fontSize: '13px', marginBottom: '6px' }}>
                  <strong>Uptime:</strong> {tier.uptime}%
                </div>
                <div style={{ fontSize: '13px', marginBottom: '6px' }}>
                  <strong>Response:</strong> {tier.responseTime}h
                </div>
                <div style={{ fontSize: '13px', marginBottom: '6px' }}>
                  <strong>Support:</strong> {getSupportLabel(tier.supportLevel)}
                </div>
                <div style={{ fontSize: '13px' }}>
                  <strong>Penalty:</strong> {(tier.penaltyRate * 100)}%
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Recent Incidents</h3>
            {incidents.map(incident => (
              <div
                key={incident.id}
                style={{
                  padding: '12px 16px',
                  marginBottom: '8px',
                  background: theme.colors.background,
                  borderRadius: '8px',
                  borderLeft: `4px solid ${getSeverityColor(incident.severity)}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{incident.service}</div>
                  <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                    {new Date(incident.startTime).toLocaleString()}
                    {incident.duration && ` • Duration: ${incident.duration}min`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    padding: '4px 8px',
                    background: incident.breach ? '#ff000020' : '#00ff8820',
                    color: incident.breach ? '#ff0000' : '#00ff88',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {incident.breach ? 'SLA BREACH' : 'Within SLA'}
                  </div>
                  {incident.penaltyAmount && (
                    <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginTop: '4px' }}>
                      Penalty: ${incident.penaltyAmount}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '16px' }}>Tier Details</h3>
          {currentTierData && (
            <div style={{
              padding: '20px',
              background: theme.colors.background,
              borderRadius: '12px',
              border: `1px solid ${theme.colors.border}`
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.colors.primary, marginBottom: '16px' }}>
                {currentTierData.name}
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>UPTIME GUARANTEE</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{currentTierData.uptime}%</div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: theme.colors.surface,
                  borderRadius: '3px',
                  overflow: 'hidden',
                  marginTop: '8px'
                }}>
                  <div style={{
                    width: `${currentTierData.uptime}%`,
                    height: '100%',
                    background: theme.colors.primary,
                    borderRadius: '3px'
                  }} />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>RESPONSE TIME</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{currentTierData.responseTime} hours</div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>SUPPORT LEVEL</div>
                <div style={{ fontSize: '16px' }}>{getSupportLabel(currentTierData.supportLevel)}</div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>PENALTY RATE</div>
                <div style={{ fontSize: '16px' }}>{(currentTierData.penaltyRate * 100)}% of monthly fee</div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>MONTHLY PRICE</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: theme.colors.primary }}>
                  ${currentTierData.price}
                </div>
              </div>

              <button style={{
                width: '100%',
                padding: '12px',
                background: theme.colors.primary,
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                {currentTierData.price === 0 ? 'Current Plan' : 'Upgrade to ' + currentTierData.name}
              </button>
            </div>
          )}

          <div style={{
            marginTop: '16px',
            padding: '16px',
            background: theme.colors.background,
            borderRadius: '12px',
            border: `1px solid ${theme.colors.border}`
          }}>
            <h4 style={{ marginTop: 0, marginBottom: '12px' }}>SLA Summary ({timeframe})</h4>
            <div style={{ fontSize: '13px', marginBottom: '8px' }}>Total Incidents: {incidents.length}</div>
            <div style={{ fontSize: '13px', marginBottom: '8px' }}>
              SLA Breaches: {incidents.filter(i => i.breach).length}
            </div>
            <div style={{ fontSize: '13px', marginBottom: '8px' }}>
              Total Penalties: ${incidents.reduce((sum, i) => sum + (i.penaltyAmount || 0), 0)}
            </div>
            <div style={{ fontSize: '13px' }}>
              Compliance: {incidents.length > 0 ? ((1 - incidents.filter(i => i.breach).length / incidents.length) * 100).toFixed(1) : 100}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
