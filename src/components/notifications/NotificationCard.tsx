"use client";

import React from "react";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

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
  const getIcon = () => {
    switch (notification.type) {
      case "neural":
        return <Icons.ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case "production":
        return <Icons.Video className="w-5 h-5 text-blue-500" />;
      case "creative":
        return <Icons.Zap className="w-5 h-5 text-purple-500" />;
      case "system":
        return <Icons.AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <Icons.Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case "neural": return "bg-emerald-50/50";
      case "production": return "bg-blue-50/50";
      case "creative": return "bg-purple-50/50";
      case "system": return "bg-amber-50/50";
      default: return "bg-slate-50/50";
    }
  };

  return (
    <div 
      className={cn(
        "group relative flex items-start gap-6 p-6 rounded-[32px] border transition-all duration-500",
        notification.isRead 
          ? "bg-white border-slate-100 opacity-70 hover:opacity-100" 
          : cn("bg-white border-blue-100 shadow-xl shadow-blue-500/5", !notification.isRead && "ring-1 ring-blue-500/10")
      )}
    >
      {/* Status Dot */}
      {!notification.isRead && (
        <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
      )}

      {/* Specialist Icon */}
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
        getBgColor()
      )}>
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
           <h4 className={cn(
             "text-[14px] font-black lowercase tracking-tighter",
             notification.isRead ? "text-slate-400" : "text-[#01012A]"
           )}>
             {notification.type} alert: {notification.title}
           </h4>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </span>
        </div>
        <p className="text-[12px] font-medium text-slate-500 leading-relaxed pr-8">
          {notification.message}
        </p>

        {/* Actions */}
        <div className="pt-3 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
          {!notification.isRead && (
            <button 
              onClick={() => onRead(notification.id)}
              className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 flex items-center gap-1.5"
            >
              <Icons.Check className="w-3 h-3" />
              Mark Read
            </button>
          )}
          {notification.link && (
            <a 
              href={notification.link}
              className="text-[10px] font-black uppercase tracking-widest text-[#01012A] hover:opacity-70 flex items-center gap-1.5"
            >
              <Icons.ExternalLink className="w-3 h-3" />
              View Detail
            </a>
          )}
          <button 
            onClick={() => onDelete(notification.id)}
            className="text-[10px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-500 flex items-center gap-1.5"
          >
            <Icons.Trash className="w-3 h-3" />
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
