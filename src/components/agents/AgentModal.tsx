"use client";

import React from "react";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";

interface Agent {
  name: string;
  role: string;
  description: string;
  tasksCompleted: number;
  imagePath: string;
  isAudio?: boolean;
}

interface AgentModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onAction: () => void;
}

export default function AgentModal({ agent, isOpen, onClose, onAction }: AgentModalProps) {
  if (!isOpen || !agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[541px] h-[612px] p-[12px] rounded-[24px] flex flex-col  overflow-hidden gap-[10px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Top Image Section */}
        <div className="relative w-[517px] h-[220px] bg-[#F8F8F8] flex items-center justify-center p-[12px] rounded-[16px]">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Icons.Plus className="w-5 h-5 rotate-45 text-[#64748B]" />
          </button>
          
          <div className=" w-[517px] h-[158px]">
            <Image 
              src={agent.imagePath} 
              alt={agent.name}
              fill
              className="object-contain p-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/400x300?text=Avatar";
              }}
            />
          </div>
          
          {agent.isAudio && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm">
                <Icons.AudioWave className="w-5 h-5 text-[#02022C]" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className=" flex flex-col gap-[12px]">
          <div className="flex flex-col gap-1">
            <h2 className="text-[24px] font-bold text-[#121212]">{agent.name}</h2>
            <span className="text-[14px] font-medium text-[#4F4F4F]">{agent.role}</span>
          </div>

          <div className="bg-[#F8F8F8] p-4 rounded-[8px] ">
            <p className="text-[14px] text-[#121212] leading-relaxed">
              {agent.description}
            </p>
          </div>

          <div className="flex gap-[12px]">
            <div className="flex-1 bg-[#F8F8F8] p-4 rounded-[8px] flex flex-col gap-1">
              <span className="text-[12px] font-regular text-[#4F4F4F]">Status</span>
              <span className="text-[16px] font-bold text-[#121212]">Active</span>
            </div>
            <div className="flex-1 bg-[#F8F8F8] p-4 rounded-[8px] flex flex-col gap-1">
              <span className="text-[12px] font-regular text-[#4F4F4F]">Tasks Completed</span>
              <span className="text-[16px] font-bold text-[#121212]">{agent.tasksCompleted.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-[12px] border border-[#E2E8F0] shadow-sm flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#02022C]"></div>
            <span className="text-[11px] font-medium tracking-wider text-[#64748B] uppercase">Key Feature</span>
            <span className="text-[14px] font-bold text-[#121212]">Measurable edge over competitors using silence</span>
          </div>

          <button 
            onClick={onAction}
            className="w-[517px] h-[48px] mt-2 bg-[linear-gradient(90deg,#01012A_0%,#2E2C66_100%)] text-white rounded-[8px] text-[15px] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-[8px] py-[12px] px-[32px]"
            style={{ boxShadow: "inset 0px -5px 5px 0px #4F569B" }}
          >
            Start Creating with {agent.name}
          </button>
        </div>
      </div>
    </div>
  );
}
