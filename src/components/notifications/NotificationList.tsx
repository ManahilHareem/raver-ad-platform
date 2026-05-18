"use client";

import React, { useState, useEffect } from "react";
import { NotificationCard, Notification, NotificationType } from "./NotificationCard";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { getDateCategory } from "@/lib/time";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch(`${API_BASE}/notifications`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const formatted = data.data.map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type?.toLowerCase() as NotificationType || "system",
            timestamp: n.createdAt,
            isRead: n.isRead,
            link: n.metadata?.link
          }));
          setNotifications(formatted);
          window.dispatchEvent(new CustomEvent("notifications_updated", { 
            detail: { unreadCount: formatted.filter((n: any) => !n.isRead).length } 
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      window.dispatchEvent(new CustomEvent("notifications_updated", { detail: { unreadCount: notifications.filter(n => !n.isRead).length } }));
    }
  }, [notifications, isLoading]);

  const handleRead = async (id: string) => {
    try {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      const response = await apiFetch(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' });
      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Failed to mark read:", error);
      fetchNotifications();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== id));
      const response = await apiFetch(`${API_BASE}/notifications/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
      fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      const response = await apiFetch(`${API_BASE}/notifications/read-all`, { method: 'PATCH' });
      if (!response.ok) {
        throw new Error("Failed to mark all as read");
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      fetchNotifications();
    }
  };

  const handleClearAll = async () => {
    try {
      const toDelete = [...notifications];
      setNotifications([]);
      const responses = await Promise.all(toDelete.map(n => apiFetch(`${API_BASE}/notifications/${n.id}`, { method: 'DELETE' })));
      if (responses.some(res => !res.ok)) {
        throw new Error("Failed to clear some notifications");
      }
    } catch (error) {
      console.error("Failed to clear notifications:", error);
      fetchNotifications();
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Group notifications by date
  const groups = notifications.reduce((acc, n) => {
    const category = getDateCategory(n.timestamp);
    if (!acc[category]) acc[category] = [];
    acc[category].push(n);
    return acc;
  }, {} as Record<string, Notification[]>);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-50 rounded-[40px] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Action Controls */}
      <div className="flex items-center justify-end gap-6 pb-2">
        <button 
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className="group flex items-center gap-2 text-[13px] font-bold text-blue-500 disabled:opacity-20 transition-all hover:-translate-y-px"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <Icons.CheckCircle className="w-4 h-4" />
          </div>
          Mark All Read
        </button>
        
        <button 
          onClick={handleClearAll}
          disabled={notifications.length === 0}
          className="group flex items-center gap-2 text-[13px] font-bold text-rose-500 disabled:opacity-20 transition-all hover:-translate-y-px"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
            <Icons.Trash className="w-4 h-4" />
          </div>
          Clear All
        </button>
      </div>

      {/* Grouped Feed */}
      <div className="space-y-12">
        {notifications.length > 0 ? (
          (["TODAY", "YESTERDAY", "EARLIER"] as const).map((category) => {
            const groupNotifications = groups[category];
            if (!groupNotifications || groupNotifications.length === 0) return null;

            return (
              <div key={category} className="space-y-6">
                <div className="flex items-center gap-4 px-2">
                  <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">{category}</span>
                  <div className="h-px bg-slate-100 flex-1" />
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <AnimatePresence mode="popLayout">
                    {groupNotifications.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onRead={handleRead}
                        onDelete={handleDelete}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-50/50 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-[40px] py-40 flex flex-col items-center justify-center gap-6"
          >
            <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-xl shadow-slate-200/50 relative">
               <div className="absolute inset-0 bg-blue-500 opacity-5 blur-2xl rounded-full" />
               <Icons.Bell className="w-10 h-10 text-slate-200" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-[20px] font-bold text-[#121212]">Your Inbox is Quiet</h3>
              <p className="text-[14px] text-[#4F4F4F]">No alerts or production updates recorded at this time.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
