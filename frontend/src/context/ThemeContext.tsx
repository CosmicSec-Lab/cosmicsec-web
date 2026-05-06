import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Theme = "dark" | "light";

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  danger: string;
  warning: string;
  success: string;
  info: string;
}

interface ThemeState {
  theme: Theme;
  highContrast: boolean;
  reducedMotion: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setHighContrast: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ThemeContext = createContext<ThemeState | undefined>(undefined);

const THEME_KEY = "cosmicsec_theme";
const HIGH_CONTRAST_KEY = "cosmicsec_high_contrast";
const REDUCED_MOTION_KEY = "cosmicsec_reduced_motion";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    // Respect system preference on first visit
    if (window.matchMedia?.("(prefers-color-scheme: light)").matches) return "light";
    return "dark";
  });
  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem(HIGH_CONTRAST_KEY) === "true";
  });
  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    return localStorage.getItem(REDUCED_MOTION_KEY) === "true";
  });

  // Apply class to <html> element for Tailwind dark-mode toggling
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light", "high-contrast");
    root.classList.add(theme);
    if (highContrast) {
      root.classList.add("high-contrast");
    }
    root.setAttribute("data-reduced-motion", reducedMotion ? "true" : "false");
    localStorage.setItem(THEME_KEY, theme);
    localStorage.setItem(HIGH_CONTRAST_KEY, String(highContrast));
    localStorage.setItem(REDUCED_MOTION_KEY, String(reducedMotion));
  }, [theme, highContrast, reducedMotion]);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const setHighContrast = useCallback((enabled: boolean) => setHighContrastState(enabled), []);
  const setReducedMotion = useCallback((enabled: boolean) => setReducedMotionState(enabled), []);

  const toggleTheme = useCallback(
    () => setThemeState((prev) => (prev === "dark" ? "light" : "dark")),
    [],
  );

  const value = useMemo<ThemeState>(
    () => ({
      theme,
      highContrast,
      reducedMotion,
      colors: theme === "dark" 
        ? {
            primary: '#00ff88',
            secondary: '#0099ff',
            background: '#0a0e27',
            surface: '#1a1f3a',
            text: '#ffffff',
            textSecondary: '#a0a0b0',
            border: '#2a2f4a',
            danger: '#ff0000',
            warning: '#ff9900',
            success: '#00ff88',
            info: '#0099ff'
          }
        : {
            primary: '#0066cc',
            secondary: '#6b7280',
            background: '#f8fafc',
            surface: '#ffffff',
            text: '#1e293b',
            textSecondary: '#64748b',
            border: '#e2e8f0',
            danger: '#ef4444',
            warning: '#f59e0b',
            success: '#10b981',
            info: '#3b82f6'
          },
      toggleTheme,
      setTheme,
      setHighContrast,
      setReducedMotion,
    }),
    [theme, highContrast, reducedMotion, toggleTheme, setTheme, setHighContrast, setReducedMotion],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeState {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
