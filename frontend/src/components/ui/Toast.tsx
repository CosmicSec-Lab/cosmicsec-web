/**
 * Premium Toast notification system.
 */
import { useNotifications } from "../context/NotificationContext";
import { useEffect } from "react";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

export function Toaster() {
  const { notifications, removeNotification } = useNotifications();

  // Auto-remove after 5s
  useEffect(() => {
    const timers = notifications
      .filter((n) => !n.read)
      .map((n) =>
        setTimeout(() => removeNotification(n.id), 5000)
      );
    return () => timers.forEach(clearTimeout);
  }, [notifications, removeNotification]);

  if (notifications.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case "error": return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case "success": return "border-green-500/30";
      case "warning": return "border-yellow-500/30";
      case "error": return "border-red-500/30";
      default: return "border-blue-500/30";
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {notifications.slice(0, 3).map((n) => (
        <div
          key={n.id}
          className={`bg-slate-800/95 backdrop-blur-xl border ${getBorderColor(n.type)} rounded-xl p-4 shadow-2xl animate-in slide-in-from-right duration-300`}
        >
          <div className="flex items-start gap-3">
            {getIcon(n.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{n.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
