import React, { useState, useContext } from 'react';
import { ThemeContext, ThemeColors } from '../context/ThemeContext';

interface ThemeBuilderProps {
  onSave?: (theme: ThemeColors) => void;
}

export const ThemeBuilder: React.FC<ThemeBuilderProps> = ({ onSave }) => {
  const themeContext = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'glassmorphism'>('presets');
  const [customColors, setCustomColors] = useState<ThemeColors>(themeContext?.colors || {
    primary: '#00ff88',
    secondary: '#0099ff',
    background: '#0a0e27',
    surface: '#1a1f3a',
    text: '#ffffff',
    textSecondary: '#a0a0b0',
    border: '#2a2f4a',
    danger: '#ff0000',
    warning: '#ff9900',
    success: '#00ff88'
  });

  const presets = [
    {
      name: 'Cosmic Dark',
      colors: {
        primary: '#00ff88',
        secondary: '#0099ff',
        background: '#0a0e27',
        surface: '#1a1f3a',
        text: '#ffffff',
        textSecondary: '#a0a0b0',
        border: '#2a2f4a',
        danger: '#ff0000',
        warning: '#ff9900',
        success: '#00ff88'
      }
    },
    {
      name: 'Midnight Blue',
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#94a3b8',
        border: '#334155',
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981'
      }
    },
    {
      name: 'Neon Nights',
      colors: {
        primary: '#ff00ff',
        secondary: '#00ffff',
        background: '#1a0025',
        surface: '#2a0040',
        text: '#ffffff',
        textSecondary: '#d0a0e0',
        border: '#4a2060',
        danger: '#ff3333',
        warning: '#ffcc00',
        success: '#00ff99'
      }
    },
    {
      name: 'Emerald Forest',
      colors: {
        primary: '#10b981',
        secondary: '#3b82f6',
        background: '#064e3b',
        surface: '#065f46',
        text: '#ecfdf5',
        textSecondary: '#a7f3d0',
        border: '#047857',
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981'
      }
    }
  ];

  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
  ];

  const [selectedGradient, setSelectedGradient] = useState(gradients[0]);

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setCustomColors(prev => ({ ...prev, [key]: value }));
  };

  const applyTheme = (colors: ThemeColors) => {
    if (themeContext?.setTheme) {
      themeContext.setTheme(colors);
    }
    if (onSave) {
      onSave(colors);
    }
  };

  return (
    <div style={{
      padding: '24px',
      background: themeContext?.colors.surface || '#1a1f3a',
      borderRadius: '16px',
      border: `1px solid ${themeContext?.colors.border || '#2a2f4a'}`,
      color: themeContext?.colors.text || '#ffffff'
    }}>
      <h2 style={{ margin: '0 0 24px 0', color: themeContext?.colors.primary || '#00ff88' }}>Theme Builder</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {(['presets', 'custom', 'glassmorphism'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              background: activeTab === tab ? themeContext?.colors.primary : 'transparent',
              color: activeTab === tab ? '#000' : themeContext?.colors.text,
              border: `1px solid ${themeContext?.colors.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'presets' && (
        <div>
          <h3 style={{ marginBottom: '16px' }}>Preset Themes</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            {presets.map(preset => (
              <div
                key={preset.name}
                onClick={() => applyTheme(preset.colors)}
                style={{
                  padding: '16px',
                  background: preset.colors.surface,
                  borderRadius: '12px',
                  border: `2px solid ${preset.colors.primary}40`,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '12px', color: preset.colors.primary }}>
                  {preset.name}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  {Object.entries(preset.colors).slice(0, 5).map(([key, value]) => (
                    <div
                      key={key}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: value,
                        border: '2px solid rgba(255,255,255,0.1)'
                      }}
                      title={key}
                    />
                  ))}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    applyTheme(preset.colors);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: preset.colors.primary,
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Apply Theme
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'custom' && (
        <div>
          <h3 style={{ marginBottom: '16px' }}>Custom Theme</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {Object.entries(customColors).map(([key, value]) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '12px', color: themeContext?.colors.textSecondary, marginBottom: '8px' }}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: 'transparent'
                    }}
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: themeContext?.colors.background,
                      color: themeContext?.colors.text,
                      border: `1px solid ${themeContext?.colors.border}`,
                      borderRadius: '6px',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button
              onClick={() => applyTheme(customColors)}
              style={{
                padding: '12px 24px',
                background: themeContext?.colors.primary,
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Apply Custom Theme
            </button>
            <button
              onClick={() => {
                const randomColors = {
                  primary: `#${Math.floor(Math.random()*16777215).toString(16)}`,
                  secondary: `#${Math.floor(Math.random()*16777215).toString(16)}`,
                  background: '#0a0e27',
                  surface: '#1a1f3a',
                  text: '#ffffff',
                  textSecondary: '#a0a0b0',
                  border: '#2a2f4a',
                  danger: '#ff0000',
                  warning: '#ff9900',
                  success: '#00ff88'
                };
                setCustomColors(randomColors);
              }}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                color: themeContext?.colors.primary,
                border: `1px solid ${themeContext?.colors.primary}`,
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Randomize
            </button>
          </div>
        </div>
      )}

      {activeTab === 'glassmorphism' && (
        <div>
          <h3 style={{ marginBottom: '16px' }}>Glassmorphism Gradients</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {gradients.map((gradient, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedGradient(gradient)}
                style={{
                  height: '120px',
                  background: gradient,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  border: selectedGradient === gradient ? `3px solid ${themeContext?.colors.primary}` : '3px solid transparent',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  padding: '4px 8px',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#fff'
                }}>
                  Glass Effect
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '24px' }}>
            <h4 style={{ marginBottom: '12px' }}>Preview</h4>
            <div style={{
              height: '200px',
              background: selectedGradient,
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                right: '20px',
                bottom: '20px',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                  Glassmorphism Card
                </div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                  This is a preview of the glassmorphism effect with the selected gradient background.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
