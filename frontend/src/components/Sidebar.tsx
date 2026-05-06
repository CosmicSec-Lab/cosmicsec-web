/**
 * Premium Sidebar with collapsible groups, icons, active states, and glow effects.
 */
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Shield,
  Search,
  AlertTriangle,
  Bug,
  FileCheck,
  ScanLine,
  Globe,
  Brain,
  Bot,
  FileText,
  DollarSign,
  Settings,
  Users,
  Activity,
  ChevronDown,
  ChevronRight,
  Zap,
} from "lucide-react"; // lucide-react is already in most React setups

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  roles?: string[];
}

const navGroups = [
  {
    label: "Operations",
    items: [
      { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/soc", label: "SOC Center", icon: Shield, badge: 5 },
      { path: "/threat-hunt", label: "Threat Hunting", icon: Search },
      { path: "/incidents", label: "Incidents", icon: AlertTriangle, badge: 12 },
      { path: "/vulnerabilities", label: "Vulnerabilities", icon: Bug, badge: 8 },
      { path: "/compliance", label: "Compliance", icon: FileCheck },
    ],
  },
  {
    label: "Security Tools",
    items: [
      { path: "/scans", label: "Scans", icon: ScanLine },
      { path: "/recon", label: "Recon", icon: Globe },
      { path: "/ai", label: "AI Analysis", icon: Brain },
      { path: "/agents", label: "Agents", icon: Bot },
    ],
  },
  {
    label: "Business",
    items: [
      { path: "/reports", label: "Reports", icon: FileText },
      { path: "/bug-bounty", label: "Bug Bounty", icon: DollarSign },
      { path: "/timeline", label: "Timeline", icon: Activity },
    ],
  },
  {
    label: "System",
    items: [
      { path: "/settings", label: "Settings", icon: Settings },
      { path: "/system-status", label: "System Status", icon: Activity },
      { path: "/admin", label: "Admin", icon: Users, roles: ["admin"] },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Operations"]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`h-screen bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-white text-lg">CosmicSec</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex items-center justify-between w-full px-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
              >
                {group.label}
                {expandedGroups.includes(group.label) ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
            )}
            {expandedGroups.includes(group.label) && (
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                      isActive(item.path)
                        ? "bg-blue-600/20 text-blue-400 border-r-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive(item.path) ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                    {!collapsed && (
                      <>
                        <span className="text-sm font-medium flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full animate-pulse">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {isActive(item.path) && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Mini Profile */}
      <div className="p-4 border-t border-slate-800">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin</p>
              <p className="text-xs text-slate-500">admin@cosmicsec.com</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm mx-auto">
            A
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;