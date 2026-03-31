"use client";

import React from "react";
import { Icons } from "@/components/ui/icons";
import DashboardLayout from "@/components/DashboardLayout";

interface RaverLoadingStateProps {
  title?: string;
  description?: string;
}

export function RaverLoadingState({ 
  title = "Initializing Studio", 
  description = "Synchronizing your latest campaigns and preparing the AI production pipeline..." 
}: RaverLoadingStateProps) {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 px-4">
        <div className="relative flex items-center justify-center">
          {/* Outer spinning ring - elegant and slow */}
          <div className="w-24 h-24 border-[2.5px] border-slate-100 border-t-[#0A0A0A] rounded-full animate-spin duration-[1.5s]"></div>
          
          {/* Inner pulsing icon - matching Obsidian brand colors */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-linear-to-br from-[#0A0A0A] to-[#334155] rounded-full flex items-center justify-center shadow-lg shadow-[#0A0A0A]/20">
              <Icons.Loader className="w-6 h-6 text-white animate-spin duration-[2s]" />
            </div>
          </div>

          {/* Decorative expanding waves */}
          <div className="absolute w-32 h-32 border border-[#0A0A0A]/10 rounded-full animate-ping opacity-30"></div>
        </div>

        <div className="flex flex-col items-center gap-3 text-center max-w-sm">
          <h3 className="text-[22px] font-bold tracking-tight bg-linear-to-r from-[#0A0A0A] to-[#334155] bg-clip-text text-transparent uppercase whitespace-nowrap">
            {title}
          </h3>
          <p className="text-slate-500 text-[15px] leading-relaxed font-medium">
            {description}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
