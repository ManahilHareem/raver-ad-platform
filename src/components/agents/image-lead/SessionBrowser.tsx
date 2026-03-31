"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";

interface Session {
  sessionId: string;
  tag?: string;
  createdAt?: string;
  metadata?: {
    scenes?: { label: string; url: string }[];
  };
}

interface SessionBrowserProps {
  sessions: Session[];
  activeSessionId: string;
  onSelect: (session: Session) => void;
  onReset: () => void;
}

export function SessionBrowser({ 
  sessions, 
  activeSessionId, 
  onSelect, 
  onReset 
}: SessionBrowserProps) {
  if (!sessions || sessions.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {sessions
          .filter((s) => (activeSessionId ? s.sessionId === activeSessionId : true))
          .map((s) => (
          <button
            key={s.sessionId}
            onClick={() => onSelect(s)}
            onDoubleClick={onReset}
            className={cn(
              "group flex flex-col gap-2 p-4 rounded-2xl border transition-all min-w-[180px] text-left relative overflow-hidden",
              activeSessionId === s.sessionId 
                ? "bg-[#0A0A0A] text-white border-[#0A0A0A] translate-y-[-2px]" 
                : "bg-white text-slate-600 border-slate-100 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <div className="flex items-center justify-between">
              <Icons.Clock className={cn("w-3.5 h-3.5", activeSessionId === s.sessionId ? "opacity-100" : "opacity-30")} />
              {s.createdAt && (
                <span className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">
                  {new Date(s.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
            <span className="text-[12px] font-black truncate tracking-tighter uppercase">
              {s.tag || s.sessionId.replace("raver_campaign_", "")}
            </span>
            {activeSessionId === s.sessionId && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-white/20 to-transparent" />
            )}
          </button>
        ))}

        {/* View All Sessions Button */}
        {activeSessionId && (
          <button 
            onClick={onReset}
            className="text-xs font-bold text-slate-500 hover:text-[#0A0A0A] underline ml-2 whitespace-nowrap transition-colors"
          >
            View All Sessions
          </button>
        )}
      </div>
    </div>
  );
}
