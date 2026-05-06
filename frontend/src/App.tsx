import React, { Suspense, useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { SkipLink } from "./components/ui/SkipLink";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PageSkeleton } from "./components/PageSkeleton";
import { RouteProgressBar } from "./components/RouteProgressBar";
import { EndpointDiagnostics } from "./components/EndpointDiagnostics";
import { useTokenRefresh } from "./hooks/useTokenRefresh";
import { CommandPalette } from "./components/CommandPalette";
import { Toaster } from "./components/ui/Toast";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Breadcrumbs } from "./components/Breadcrumbs";

// Public pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

// Lazy-loaded pages
const DemoSandboxPage = React.lazy(() =>
  import("./pages/DemoSandboxPage").then((m) => ({ default: m.DemoSandboxPage })),
);
const PricingPage = React.lazy(() =>
  import("./pages/PricingPage").then((m) => ({ default: m.PricingPage })),
);
const ForgotPasswordPage = React.lazy(() =>
  import("./pages/ForgotPasswordPage").then((m) => ({ default: m.ForgotPasswordPage })),
);
const TwoFactorPage = React.lazy(() =>
  import("./pages/TwoFactorPage").then((m) => ({ default: m.TwoFactorPage })),
);

// Protected pages
const DashboardPage = React.lazy(() =>
  import("./pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const AdminDashboardPage = React.lazy(() =>
  import("./pages/AdminDashboardPage").then((m) => ({ default: m.AdminDashboardPage })),
);
const PluginDetailPage = React.lazy(() =>
  import("./pages/PluginDetailPage").then((m) => ({ default: m.PluginDetailPage })),
);
const Phase5OperationsPage = React.lazy(() =>
  import("./pages/Phase5OperationsPage").then((m) => ({ default: m.Phase5OperationsPage })),
);
const ScanPage = React.lazy(() =>
  import("./pages/ScanPage").then((m) => ({ default: m.ScanPage })),
);
const ScanDetailPage = React.lazy(() =>
  import("./pages/ScanDetailPage").then((m) => ({ default: m.ScanDetailPage })),
);
const ReconPage = React.lazy(() =>
  import("./pages/ReconPage").then((m) => ({ default: m.ReconPage })),
);
const AIAnalysisPage = React.lazy(() =>
  import("./pages/AIAnalysisPage").then((m) => ({ default: m.AIAnalysisPage })),
);
const AIChatPage = React.lazy(() =>
  import("./pages/AIChatPage").then((m) => ({ default: m.AIChatPage })),
);
const ProfilePage = React.lazy(() =>
  import("./pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const ReportsPage = React.lazy(() =>
  import("./pages/ReportsPage").then((m) => ({ default: m.ReportsPage })),
);
const BugBountyPage = React.lazy(() =>
  import("./pages/BugBountyPage").then((m) => ({ default: m.BugBountyPage })),
);
const SpecializedPanelsPage = React.lazy(() =>
  import("./pages/SpecializedPanelsPage").then((m) => ({ default: m.SpecializedPanelsPage })),
);
const TimelinePage = React.lazy(() =>
  import("./pages/TimelinePage").then((m) => ({ default: m.TimelinePage })),
);
const SettingsPage = React.lazy(() =>
  import("./pages/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);
const SystemStatusPage = React.lazy(() =>
  import("./pages/SystemStatusPage").then((m) => ({ default: m.SystemStatusPage })),
);
const AgentsPage = React.lazy(() =>
  import("./pages/AgentsPage").then((m) => ({ default: m.AgentsPage })),
);

// NEW: Advanced pages
const SOCDashboardPage = React.lazy(() =>
  import("./pages/SOCDashboardPage").then((m) => ({ default: m.SOCDashboardPage })),
);
const ThreatHuntWorkbenchPage = React.lazy(() =>
  import("./pages/ThreatHuntWorkbenchPage").then((m) => ({ default: m.ThreatHuntWorkbenchPage })),
);
const IncidentCommandPage = React.lazy(() =>
  import("./pages/IncidentCommandPage").then((m) => ({ default: m.IncidentCommandPage })),
);
const VulnManagerPage = React.lazy(() =>
  import("./pages/VulnManagerPage").then((m) => ({ default: m.VulnManagerPage })),
);
const CompliancePage = React.lazy(() =>
  import("./pages/CompliancePage").then((m) => ({ default: m.CompliancePage })),
);

// NEW: Premium CosmicSec pages
const ThreeJSVisualizationPage = React.lazy(() =>
  import("./pages/ThreeJSVisualizationPage").then((m) => ({ default: m.ThreeJSVisualizationPage })),
);
const IoTDashboardPage = React.lazy(() =>
  import("./pages/IoTDashboardPage").then((m) => ({ default: m.IoTDashboardPage })),
);
const SLAManagerPage = React.lazy(() =>
  import("./pages/SLAManagerPage").then((m) => ({ default: m.SLAManagerPage })),
);
const ThemeBuilderPage = React.lazy(() =>
  import("./pages/ThemeBuilderPage").then((m) => ({ default: m.ThemeBuilderPage })),
);
const NLPSearchPage = React.lazy(() =>
  import("./pages/NLPSearchPage").then((m) => ({ default: m.NLPSearchPage })),
);
const OnboardingWizardPage = React.lazy(() =>
  import("./pages/OnboardingWizardPage").then((m) => ({ default: m.OnboardingWizardPage })),
);
const EdgeComputingPage = React.lazy(() =>
  import("./pages/EdgeComputingPage").then((m) => ({ default: m.EdgeComputingPage })),
);
const DDoSProtectionPage = React.lazy(() =>
  import("./pages/DDoSProtectionPage").then((m) => ({ default: m.DDoSProtectionPage })),
);
const SmartContractAuditPage = React.lazy(() =>
  import("./pages/SmartContractAuditPage").then((m) => ({ default: m.SmartContractAuditPage })),
);
const SecurityTestingPage = React.lazy(() =>
  import("./pages/SecurityTestingPage").then((m) => ({ default: m.SecurityTestingPage })),
);
const BenchmarkingChaosPage = React.lazy(() =>
  import("./pages/BenchmarkingChaosPage").then((m) => ({ default: m.BenchmarkingChaosPage })),
);

const NotFoundPage = React.lazy(() =>
  import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);

// ---------------------------------------------------------------------------
// Layouts
// ---------------------------------------------------------------------------
function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-950">{children}</div>;
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""} bg-slate-950 text-white`}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 min-h-screen flex flex-col">
          <TopBar />
          <Breadcrumbs />
          <main className="flex-1 p-6 overflow-auto">
            <NotificationProvider>{children}</NotificationProvider>
          </main>
        </div>
      </div>
      <CommandPalette />
      <Toaster />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Route Guards
// ---------------------------------------------------------------------------
function RequireAuth({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  return <RequireAuth requiredRole="admin">{children}</RequireAuth>;
}

// ---------------------------------------------------------------------------
// Session refresh
// ---------------------------------------------------------------------------
function SessionGuard() {
  useTokenRefresh();
  return null;
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export function App() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement | null>(null);
  const [routeAnnouncement, setRouteAnnouncement] = useState("");

  useEffect(() => {
    const pageLabel = document.title || location.pathname;
    setRouteAnnouncement(`Navigated to ${pageLabel}`);
    if (!location.hash) {
      mainRef.current?.focus();
    }
  }, [location.pathname, location.search, location.hash]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <SessionGuard />
        <ErrorBoundary>
          <SkipLink />
          <RouteProgressBar />
          <EndpointDiagnostics />
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {routeAnnouncement}
          </div>
          <Suspense fallback={<PageSkeleton />}>
            <Routes location={location}>
              {/* ------------------------------------------------------------------ */}
              {/* Public routes */}
              {/* ------------------------------------------------------------------ */}
              <Route element={<AuthLayout><Outlet /></AuthLayout>}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/demo" element={<DemoSandboxPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/register" element={<RegisterPage />} />
                <Route path="/auth/forgot" element={<ForgotPasswordPage />} />
                <Route path="/auth/2fa" element={<TwoFactorPage />} />
              </Route>

              {/* ------------------------------------------------------------------ */}
              {/* Protected routes (Dashboard layout) */}
              {/* ------------------------------------------------------------------ */}
              <Route
                element={
                  <RequireAuth>
                    <DashboardLayout>
                      <Outlet />
                    </DashboardLayout>
                  </RequireAuth>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/soc" element={<SOCDashboardPage />} />
                <Route path="/threat-hunt" element={<ThreatHuntWorkbenchPage />} />
                <Route path="/incidents" element={<IncidentCommandPage />} />
                <Route path="/vulnerabilities" element={<VulnManagerPage />} />
                <Route path="/compliance" element={<CompliancePage />} />
                <Route path="/scans" element={<ScanPage />} />
                <Route path="/scans/:id" element={<ScanDetailPage />} />
                <Route path="/recon" element={<ReconPage />} />
                <Route path="/ai" element={<AIAnalysisPage />} />
                <Route path="/ai/chat" element={<AIChatPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/bug-bounty" element={<BugBountyPage />} />
                <Route path="/agents" element={<AgentsPage />} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/system-status" element={<SystemStatusPage />} />
                <Route path="/plugins/:name" element={<PluginDetailPage />} />
                <Route path="/phase5" element={<Phase5OperationsPage />} />
                <Route path="/panels" element={<SpecializedPanelsPage />} />
                <Route path="/3d-viz" element={<ThreeJSVisualizationPage />} />
                <Route path="/iot-security" element={<IoTDashboardPage />} />
                <Route path="/sla-manager" element={<SLAManagerPage />} />
                <Route path="/theme-builder" element={<ThemeBuilderPage />} />
                <Route path="/nlp-search" element={<NLPSearchPage />} />
                <Route path="/onboarding" element={<OnboardingWizardPage />} />
                <Route path="/edge-computing" element={<EdgeComputingPage />} />
                <Route path="/ddos-protection" element={<DDoSProtectionPage />} />
                <Route path="/smart-contract-audit" element={<SmartContractAuditPage />} />
                <Route path="/security-testing" element={<SecurityTestingPage />} />
                <Route path="/benchmarking-chaos" element={<BenchmarkingChaosPage />} />
              </Route>

              {/* ------------------------------------------------------------------ */}
              {/* Admin routes */}
              {/* ------------------------------------------------------------------ */}
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <DashboardLayout>
                      <AdminDashboardPage />
                    </DashboardLayout>
                  </RequireAdmin>
                }
              />

              {/* ------------------------------------------------------------------ */}
              {/* 404 */}
              {/* ------------------------------------------------------------------ */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Outlet for nested routes
export function Outlet() {
  return null; // React Router will fill this
}
