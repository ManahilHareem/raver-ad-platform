"use client";

import React from "react";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { formatTimeAgo } from "@/lib/time";

export type NotificationType = "neural" | "production" | "system" | "creative";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

interface NotificationCardProps {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationCard({ notification, onRead, onDelete }: NotificationCardProps) {
  const getVisualConfig = () => {
    switch (notification.type) {
      case "neural":
        return {
          icon: <Icons.ShieldCheck className="w-5 h-5 text-white" />,
          gradient: "from-emerald-400 to-teal-500 shadow-emerald-500/20",
          bg: "bg-emerald-50/30",
          border: "border-emerald-100"
        };
      case "production":
        return {
          icon: <Icons.Video className="w-5 h-5 text-white" />,
          gradient: "from-blue-400 to-indigo-500 shadow-blue-500/20",
          bg: "bg-blue-50/30",
          border: "border-blue-100"
        };
      case "creative":
        return {
          icon: <Icons.Zap className="w-5 h-5 text-white" />,
          gradient: "from-purple-400 to-pink-500 shadow-purple-500/20",
          bg: "bg-purple-50/30",
          border: "border-purple-100"
        };
      case "system":
        return {
          icon: <Icons.AlertTriangle className="w-5 h-5 text-white" />,
          gradient: "from-amber-400 to-orange-500 shadow-amber-500/20",
          bg: "bg-amber-50/30",
          border: "border-amber-100"
        };
      default:
        return {
          icon: <Icons.Bell className="w-5 h-5 text-white" />,
          gradient: "from-slate-400 to-slate-500 shadow-slate-500/20",
          bg: "bg-slate-50/30",
          border: "border-slate-100"
        };
    }
  };

  const config = getVisualConfig();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ scale: 1.005 }}
      className={cn(
        "group relative flex items-start gap-6 p-6 rounded-[34px] border transition-all duration-300",
        notification.isRead 
          ? "bg-white/50 backdrop-blur-sm border-slate-100/50 opacity-80 hover:opacity-100" 
          : cn("bg-white border-transparent shadow-xl shadow-slate-200/50", !notification.isRead && "ring-1 ring-slate-100")
      )}
    >
      {/* Glow Effect for Unread */}
      {!notification.isRead && (
        <div className={cn(
          "absolute -inset-0.5 rounded-[36px] bg-linear-to-r from-[#01012A] to-[#2E2C66] opacity-5 blur-xl transition-opacity group-hover:opacity-10"
        )} />
      )}

      {/* Specialist Icon with Brand Gradient */}
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg bg-linear-to-r from-[#01012A] to-[#2E2C66] transition-transform duration-500 group-hover:rotate-6 shadow-[#01012A]/10"
      )}>
        {config.icon}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <span className={cn(
               "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border",
               config.bg,
               config.border,
               "text-[#4F4F4F]"
             )}>
               {notification.type}
             </span>
             <h4 className={cn(
               "text-[16px] font-bold",
               notification.isRead ? "text-slate-400" : "text-[#121212]"
             )}>
               {notification.title}
             </h4>
           </div>
           <span className="text-[12px] font-medium text-[#64748B]">
             {formatTimeAgo(notification.timestamp)}
           </span>
        </div>
        
        <p className={cn(
          "text-[14px] font-normal leading-relaxed pr-10",
          notification.isRead ? "text-slate-400" : "text-[#4F4F4F]"
        )}>
          {notification.message}
        </p>

        {/* Actions */}
        <div className="pt-2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          {!notification.isRead && (
            <button 
              onClick={() => onRead(notification.id)}
              className="h-8 px-4 rounded-[8px] bg-blue-50 text-[12px] font-bold text-blue-500 hover:bg-blue-500 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Icons.Check className="w-4 h-4" />
              Mark Read
            </button>
          )}
          {notification.link && (
            <a 
              href={notification.link}
              className="h-8 px-4 rounded-[8px] bg-[#F8F8F8] text-[12px] font-bold text-[#121212] hover:bg-[#121212] hover:text-white transition-all flex items-center gap-1.5 border border-[#0000000D]"
            >
              <Icons.ExternalLink className="w-4 h-4" />
              View Details
            </a>
          )}
          <button 
            onClick={() => onDelete(notification.id)}
            className="h-8 w-8 rounded-[8px] bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-rose-100"
            title="Dismiss Alert"
          >
            <Icons.Trash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Unread Indicator */}
      {!notification.isRead && (
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-xs shadow-blue-500" />
        </div>
      )}
    </motion.div>
  );
}
