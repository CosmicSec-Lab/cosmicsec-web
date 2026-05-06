/**
 * Notification Context — global notification state.
 */
import React, { createContext, useContext, useState, useCallback } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Critical Incident",
      message: "Ransomware detected on WS-001",
      type: "error",
      read: false,
      createdAt: new Date(Date.now() - 120000),
    },
    {
      id: "2",
      title: "Scan Complete",
      message: "Web scan finished with 12 findings",
      type: "info",
      read: false,
      createdAt: new Date(Date.now() - 900000),
    },
    {
      id: "3",
      title: "Hunt Result",
      message: "New IOC found in DNS logs",
      type: "warning",
      read: true,
      createdAt: new Date(Date.now() - 3600000),
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "read" | "createdAt">) => {
      const newNotif: Notification = {
        ...notification,
        id: Math.random().toString(36).substring(7),
        read: false,
        createdAt: new Date(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
    },
    []
  );

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markRead,
        markAllRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
}
