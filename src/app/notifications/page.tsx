"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { NotificationList } from "@/components/notifications/NotificationList";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10 p-6 sm:p-10 bg-white rounded-[40px] min-h-screen">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/home" 
              className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all active:scale-90 group shadow-sm"
            >
              <Icons.ArrowLeft className="w-5 h-5 text-[#01012A] group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div className="flex flex-col">
               <h1 className="text-[34px] font-black text-[#01012A] tracking-tighter lowercase leading-none">NOTIFICATIONS CENTER</h1>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#01012A]/30 mt-3">Neural Feedback & Platform Production Alerts</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100/50 flex flex-col items-center justify-center">
               <Icons.Bell className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Global Hub Divider */}
        <div className="h-px bg-slate-50 w-full" />

        {/* Notification Feed Orchestrator */}
        <div className="flex-1">
          <NotificationList />
        </div>
      </div>
    </DashboardLayout>
  );
}
