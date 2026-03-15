import { Link, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { TwoFactorPage } from "./pages/TwoFactorPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { Phase5OperationsPage } from "./pages/Phase5OperationsPage";

function Dashboard() {
  return (
    <section>
      <h2>GuardAxisSphere Dashboard</h2>
      <p>Platform dashboard with integrated Phase 5 operations center access.</p>
    </section>
  );
}

export function App() {
  return (
    <main className="min-h-screen space-y-6 px-8 py-6 font-sans">
      <h1 className="text-3xl font-bold">CosmicSec Admin Dashboard</h1>
      <nav className="flex gap-4 text-indigo-300">
        <Link to="/">Dashboard</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/phase5">Phase 5</Link>
        <Link to="/auth/login">Login</Link>
        <Link to="/auth/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/phase5" element={<Phase5OperationsPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot" element={<ForgotPasswordPage />} />
        <Route path="/auth/2fa" element={<TwoFactorPage />} />
      </Routes>
    </main>
  );
}
