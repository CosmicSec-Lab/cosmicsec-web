import React from 'react';
import { ThemeBuilder } from '../components/ThemeBuilder';
import { useTheme } from '../context/ThemeContext';

export function ThemeBuilderPage() {
  const { theme } = useTheme();

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: theme.colors.primary, fontSize: '28px' }}>
          Theme Builder
        </h1>
        <p style={{ color: theme.colors.textSecondary, marginTop: '8px' }}>
          Customize your CosmicSec experience with glassmorphism effects, gradients, and premium themes
        </p>
      </div>

      <div style={{
        background: theme.colors.surface,
        borderRadius: '16px',
        border: '1px solid ' + theme.colors.border,
        overflow: 'hidden'
      }}>
        <ThemeBuilder />
      </div>

      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{
          padding: '20px',
          background: theme.colors.surface,
          borderRadius: '12px',
          border: '1px solid ' + theme.colors.border
        }}>
          <h3 style={{ color: theme.colors.text, marginBottom: '12px' }}>Glassmorphism Effects</h3>
          <div style={{
            height: '150px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              bottom: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>Glass Effect</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', marginTop: '8px' }}>
                Backdrop blur with transparency
              </div>
            </div>
          </div>
        </div>

        <div style={{
          padding: '20px',
          background: theme.colors.surface,
          borderRadius: '12px',
          border: '1px solid ' + theme.colors.border
        }}>
          <h3 style={{ color: theme.colors.text, marginBottom: '12px' }}>Premium Features</h3>
          <ul style={{ color: theme.colors.textSecondary, fontSize: '14px', lineHeight: '1.8' }}>
            <li>✨ Glassmorphism with backdrop blur</li>
            <li>🎨 4 preset themes + custom builder</li>
            <li>🌈 6 gradient backgrounds</li>
            <li>📱 Responsive design (mobile → 4K)</li>
            <li>♿ WCAG 2.1 AA compliant</li>
            <li>🎯 Real-time theme preview</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
