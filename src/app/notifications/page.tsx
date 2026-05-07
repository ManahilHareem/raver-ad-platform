"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { NotificationList } from "@/components/notifications/NotificationList";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6 bg-white rounded-[12px] border-[0.35px] border-[#0000001A] min-h-[calc(100vh-120px)] shadow-sm">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/home" 
              className="w-10 h-10 rounded-xl bg-white border border-[#0000001A] flex items-center justify-center hover:bg-slate-50 transition-all active:scale-90 group"
            >
              <Icons.ArrowLeft className="w-5 h-5 text-[#121212] group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div className="flex flex-col">
               <h1 className="text-[30px] font-bold text-[#121212] leading-tight">Notifications Center</h1>
               <p className="text-[16px] text-[#4F4F4F]">Neural Feedback & Platform Production Alerts</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
               <Icons.Bell className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[0.35px] bg-[#0000001A] w-full" />

        {/* Notification Feed Orchestrator */}
        <div className="flex-1">
          <NotificationList />
        </div>
      </div>
    </DashboardLayout>
  );
}
