import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
}

export function OnboardingWizardPage() {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    { id: 1, title: 'Welcome to CosmicSec', description: 'Get started with your security journey', icon: '🚀', completed: false },
    { id: 2, title: 'Configure Data Residency', description: 'Set your data storage preferences (EU/US/APAC)', icon: '🌍', completed: false },
    { id: 3, title: 'Setup SSO Integration', description: 'Connect your identity provider (SAML/OIDC)', icon: '🔐', completed: false },
    { id: 4, title: 'Add Security Services', description: 'Enable IoT, DDoS, 3D Viz, and more', icon: '🛡️', completed: false },
    { id: 5, title: 'Customize Theme', description: 'Choose glassmorphism or create your own', icon: '🎨', completed: false },
    { id: 6, title: 'Import Assets', description: 'Scan and import your infrastructure', icon: '📡', completed: false },
    { id: 7, title: 'Setup Notifications', description: 'Configure alerts and sound notifications', icon: '🔔', completed: false },
    { id: 8, title: 'Complete!', description: 'Your CosmicSec platform is ready', icon: '✅', completed: false }
  ]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setSteps(steps.map((step, idx) => 
        idx === currentStep ? { ...step, completed: true } : step
      ));
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setSteps(steps.map(step => ({ ...step, completed: true })));
    alert('🎉 Onboarding Complete! Welcome to CosmicSec!');
  };

  return (
    <div style={{
      padding: '24px',
      maxWidth: '900px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ color: theme.colors.primary, fontSize: '36px', marginBottom: '8px' }}>
          ✨ CosmicSec Onboarding
        </h1>
        <p style={{ color: theme.colors.textSecondary, fontSize: '16px' }}>
          Let's get your security platform configured in just a few steps
        </p>
      </div>

      <div style={{
        background: theme.colors.surface,
        borderRadius: '16px',
        border: '1px solid ' + theme.colors.border,
        padding: '32px'
      }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: theme.colors.textSecondary, fontSize: '12px' }}>
              Step {currentStep + 1} of {steps.length}
            </span>
            <span style={{ color: theme.colors.primary, fontSize: '12px', fontWeight: 'bold' }}>
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            background: theme.colors.background,
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Steps List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {steps.map((step, idx) => (
            <div
              key={step.id}
              onClick={() => setCurrentStep(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: idx === currentStep ? theme.colors.primary + '10' : 'transparent',
                border: `1px solid ${idx === currentStep ? theme.colors.primary + '40' : theme.colors.border}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: step.completed ? '#00ff88' : (idx === currentStep ? theme.colors.primary : theme.colors.background),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0
              }}>
                {step.completed ? '✓' : step.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  color: idx === currentStep ? theme.colors.primary : theme.colors.text,
                  fontWeight: 'bold',
                  marginBottom: '4px'
                }}>
                  {step.title}
                </div>
                <div style={{ color: theme.colors.textSecondary, fontSize: '13px' }}>
                  {step.description}
                </div>
              </div>
              {idx === currentStep && (
                <div style={{
                  padding: '4px 12px',
                  background: theme.colors.primary + '20',
                  color: theme.colors.primary,
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  CURRENT
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: theme.colors.text,
              border: '1px solid ' + theme.colors.border,
              borderRadius: '8px',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              opacity: currentStep === 0 ? 0.5 : 1
            }}
          >
            ← Previous
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleComplete}
              style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #00ff88, #00cc66)',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ✅ Complete Setup
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{
                padding: '12px 24px',
                background: theme.colors.primary,
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
