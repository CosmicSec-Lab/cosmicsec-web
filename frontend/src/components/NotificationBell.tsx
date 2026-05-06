/**
 * NotificationBell with dropdown panel.
 */
import { useState } from "react";
import { Bell, X, CheckCheck } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: "1", title: "Critical Incident", message: "Ransomware detected on WS-001", time: "2m ago", read: false },
  { id: "2", title: "Scan Complete", message: "Web scan finished with 12 findings", time: "15m ago", read: false },
  { id: "3", title: "Hunt Result", message: "New IOC found in DNS logs", time: "1h ago", read: true },
];

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">Notifications</h3>
            <button onClick={markAllRead} className="text-xs text-blue-400 hover:text-blue-300">
              <CheckCheck className="w-3 h-3 inline mr-1" />
              Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${n.read ? "opacity-60" : ""}`}
              >
                <p className="text-sm font-medium text-white">{n.title}</p>
                <p className="text-xs text-slate-400 mt-1">{n.message}</p>
                <p className="text-xs text-slate-500 mt-1">{n.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
