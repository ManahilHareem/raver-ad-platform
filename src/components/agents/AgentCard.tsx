"use client";

import React from "react";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  name: string;
  role: string;
  description: string;
  tasksCompleted: number;
  imagePath: string;
  isAudio?: boolean;
  onClick?: () => void;
  actionLabel?: string;
  onAction?: (e: React.MouseEvent) => void;
}

export default function AgentCard({ name, role, description, tasksCompleted, imagePath, isAudio, onClick, actionLabel, onAction }: AgentCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white rounded-[24px] overflow-hidden border-[0.35px] h-[360px] p-[12px] border-[#0000001A] transition-all duration-300 flex flex-col group hover-gradient-border cursor-pointer",
        isAudio && "ring-2 ring-[#02022C]/5"
      )}
      style={{ boxShadow: "0px 0px 20px 0px #0000000A" }}
    >
      {/* Avatar Container */}
      <div className="relative  min-w-[284px] h-[192px] bg-[#F8F8F8] overflow-hidden group items-center">
        <Image 
          src={imagePath} 
          alt={name}
          fill  
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://placehold.co/400x300?text=Avatar";
          }}
        />
        {isAudio && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm">
                <Icons.AudioWave className="w-5 h-5 text-[#02022C]" />
            </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-[12px] flex-1">
        <div className="flex flex-col">
          <h3 className="text-[16px] font-bold text-[#121212]">{name}</h3>
          <span className="text-[10px] font-medium text-[#64748B]">{role}</span>
        </div>
        
        <p  
          className="text-[12px] text-[#4F4F4F] leading-none line-clamp-3 font-normal tracking-normal"
        >
          {description}
        </p>

        <div className="mt-auto h-[48px] flex items-center justify-between gap-4 border-t-[0.35px] border-[#0000001A]">
          <div className="flex items-center gap-2 text-[#02022C]">
            <Icons.Activity className="w-4 h-4" />
            <span className="text-[12px] font-medium whitespace-nowrap">{tasksCompleted.toLocaleString()} tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
}
