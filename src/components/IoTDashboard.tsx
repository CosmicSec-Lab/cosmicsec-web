import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

interface IoTDevice {
  id: string;
  name: string;
  type: 'camera' | 'thermostat' | 'lock' | 'sensor' | 'gateway' | 'industrial';
  status: 'online' | 'offline' | 'compromised';
  ip: string;
  mac: string;
  firmware: string;
  lastSeen: string;
  riskScore: number;
  protocol: 'zigbee' | 'zwave' | 'wifi' | 'ble' | 'lorawan' | 'mqtt';
  location?: string;
}

interface SecurityEvent {
  id: string;
  deviceId: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
}

interface IoTDashboardProps {
  devices?: IoTDevice[];
  events?: SecurityEvent[];
}

export const IoTDashboard: React.FC<IoTDashboardProps> = ({ devices: initialDevices, events: initialEvents }) => {
  const { theme } = useTheme();
  const [devices, setDevices] = useState<IoTDevice[]>(initialDevices || []);
  const [events, setEvents] = useState<SecurityEvent[]>(initialEvents || []);
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null);
  const [filter, setFilter] = useState<'all' | 'online' | 'offline' | 'compromised'>('all');

  useEffect(() => {
    if (!initialDevices) {
      setDevices([
        {
          id: 'iot-001',
          name: 'Front Door Camera',
          type: 'camera',
          status: 'online',
          ip: '192.168.1.100',
          mac: '00:1B:44:11:3A:B7',
          firmware: 'v2.1.4',
          lastSeen: new Date().toISOString(),
          riskScore: 15,
          protocol: 'wifi',
          location: 'Front Entrance'
        },
        {
          id: 'iot-002',
          name: 'Smart Thermostat',
          type: 'thermostat',
          status: 'online',
          ip: '192.168.1.101',
          mac: '00:1B:44:11:3A:B8',
          firmware: 'v1.0.2',
          lastSeen: new Date().toISOString(),
          riskScore: 35,
          protocol: 'zigbee',
          location: 'Living Room'
        },
        {
          id: 'iot-003',
          name: 'Smart Lock',
          type: 'lock',
          status: 'compromised',
          ip: '192.168.1.102',
          mac: '00:1B:44:11:3A:B9',
          firmware: 'v0.9.1',
          lastSeen: new Date(Date.now() - 3600000).toISOString(),
          riskScore: 85,
          protocol: 'zwave',
          location: 'Main Door'
        }
      ]);
    }
    if (!initialEvents) {
      setEvents([
        {
          id: 'evt-001',
          deviceId: 'iot-003',
          timestamp: new Date().toISOString(),
          severity: 'critical',
          type: 'Unauthorized Access',
          description: 'Multiple failed access attempts detected'
        }
      ]);
    }
  }, [initialDevices, initialEvents]);

  const filteredDevices = devices.filter(d => filter === 'all' || d.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#00ff88';
      case 'offline': return '#ff9900';
      case 'compromised': return '#ff0000';
      default: return '#666';
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return '#00ff88';
    if (score < 60) return '#ffff00';
    if (score < 80) return '#ff9900';
    return '#ff0000';
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'camera': return '📷';
      case 'thermostat': return '🌡️';
      case 'lock': return '🔒';
      case 'sensor': return '📡';
      case 'gateway': return '🌐';
      case 'industrial': return '🏭';
      default: return '📱';
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: theme.colors.primary }}>IoT Security Dashboard</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'online', 'offline', 'compromised'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              style={{
                padding: '8px 16px',
                background: filter === f ? theme.colors.primary : 'transparent',
                color: filter === f ? '#000' : theme.colors.text,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <h3 style={{ marginBottom: '16px' }}>Devices ({filteredDevices.length})</h3>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {filteredDevices.map(device => (
              <div
                key={device.id}
                onClick={() => setSelectedDevice(device)}
                style={{
                  padding: '16px',
                  marginBottom: '12px',
                  background: selectedDevice?.id === device.id ? theme.colors.primary + '20' : theme.colors.background,
                  border: `1px solid ${selectedDevice?.id === device.id ? theme.colors.primary : theme.colors.border}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{getDeviceIcon(device.type)}</span>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{device.name}</div>
                      <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>{device.ip} • {device.protocol}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: getStatusColor(device.status)
                      }} />
                      <span style={{ textTransform: 'capitalize', fontSize: '14px' }}>{device.status}</span>
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: getRiskColor(device.riskScore),
                      fontWeight: 'bold'
                    }}>
                      Risk: {device.riskScore}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {selectedDevice ? (
            <div>
              <h3 style={{ marginBottom: '16px' }}>Device Details</h3>
              <div style={{
                padding: '20px',
                background: theme.colors.background,
                borderRadius: '12px',
                border: `1px solid ${theme.colors.border}`
              }}>
                <h4 style={{ marginTop: 0, color: theme.colors.primary }}>{selectedDevice.name}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                  <div><strong>Type:</strong> {selectedDevice.type}</div>
                  <div><strong>Status:</strong> <span style={{ color: getStatusColor(selectedDevice.status) }}>{selectedDevice.status}</span></div>
                  <div><strong>IP:</strong> {selectedDevice.ip}</div>
                  <div><strong>MAC:</strong> {selectedDevice.mac}</div>
                  <div><strong>Firmware:</strong> {selectedDevice.firmware}</div>
                  <div><strong>Protocol:</strong> {selectedDevice.protocol}</div>
                  <div><strong>Location:</strong> {selectedDevice.location || 'N/A'}</div>
                  <div><strong>Last Seen:</strong> {new Date(selectedDevice.lastSeen).toLocaleString()}</div>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <strong>Risk Score:</strong>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: theme.colors.background,
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginTop: '8px'
                  }}>
                    <div style={{
                      width: `${selectedDevice.riskScore}%`,
                      height: '100%',
                      background: getRiskColor(selectedDevice.riskScore),
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>
              </div>

              <h3 style={{ marginTop: '24px', marginBottom: '16px' }}>Recent Events</h3>
              {events.filter(e => e.deviceId === selectedDevice.id).map(event => (
                <div key={event.id} style={{
                  padding: '12px',
                  marginBottom: '8px',
                  background: theme.colors.background,
                  borderRadius: '8px',
                  borderLeft: `4px solid ${
                    event.severity === 'critical' ? '#ff0000' :
                    event.severity === 'high' ? '#ff9900' :
                    event.severity === 'medium' ? '#ffff00' : '#00ff88'
                  }`
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{event.type}</div>
                  <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>{event.description}</div>
                  <div style={{ fontSize: '11px', color: theme.colors.textSecondary, marginTop: '4px' }}>
                    {new Date(event.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '400px',
              color: theme.colors.textSecondary,
              fontSize: '18px'
            }}>
              Select a device to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
