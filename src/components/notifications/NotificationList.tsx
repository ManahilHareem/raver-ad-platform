"use client";

import React, { useState, useEffect } from "react";
import { NotificationCard, Notification, NotificationType } from "./NotificationCard";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Neural Audit Verified",
    message: "Audio Synthesis #raver_au_8822 has passed all governance dimensions with a score of 9.2/10.",
    type: "neural",
    timestamp: new Date().toISOString(),
    isRead: false,
    link: "/agents/quality-lead"
  },
  {
    id: "2",
    title: "Production Render Complete",
    message: "Your 4K render for 'Spring Campaign 2026' is now available in the Editor Vault.",
    type: "production",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
    link: "/agents/editor"
  },
  {
    id: "3",
    title: "Storage Quota Update",
    message: "You have reached 65% of your high-fidelity asset storage. Consider archiving old sessions.",
    type: "system",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isRead: true
  },
  {
    id: "4",
    title: "Creative Insight Generated",
    message: "AI Director has suggested 3 new scene variations for high-engagement hashtags.",
    type: "creative",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    isRead: true,
    link: "/studio"
  }
];

export function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<NotificationType | "all">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("raver_notifications");
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      setNotifications(MOCK_NOTIFICATIONS);
      localStorage.setItem("raver_notifications", JSON.stringify(MOCK_NOTIFICATIONS));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("raver_notifications", JSON.stringify(notifications));
      // Dispatch custom event for sidebar badge sync
      window.dispatchEvent(new CustomEvent("notifications_updated", { detail: { unreadCount: notifications.filter(n => !n.isRead).length } }));
    }
  }, [notifications, isLoading]);

  const handleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(n => filter === "all" || n.type === filter);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-50 rounded-[32px] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
        <div className="flex flex-wrap items-center gap-3">
          {(["all", "neural", "production", "creative", "system"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                filter === t 
                  ? "bg-[#01012A] text-white shadow-lg shadow-[#01012A]/10" 
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 disabled:opacity-30 flex items-center gap-2"
          >
            <Icons.CheckCircle className="w-4 h-4" />
            Mark All Read
          </button>
          <button 
            onClick={handleClearAll}
            disabled={notifications.length === 0}
            className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 disabled:opacity-30 flex items-center gap-2"
          >
            <Icons.Trash className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onRead={handleRead}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[32px] py-24 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Icons.Bell className="w-8 h-8 text-slate-200" />
            </div>
            <div className="text-center">
              <h3 className="text-[16px] font-black text-[#01012A] tracking-tighter lowercase">Digital silence_</h3>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-1">No alerts found in the {filter !== 'all' ? filter : ''} stack.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
