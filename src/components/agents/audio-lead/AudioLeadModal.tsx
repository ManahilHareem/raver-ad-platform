"use client";

import React from "react";
import { Icons } from "@/components/ui/icons";
import { AudioGenerator } from "./AudioGenerator";
import { cn } from "@/lib/utils";

interface AudioLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateMusic: (data: any) => void;
  onGenerateVoiceover: (data: any) => void;
  onProduceFull: (data: any) => void;
  isLoading: boolean;
}

export function AudioLeadModal({
  isOpen,
  onClose,
  onGenerateMusic,
  onGenerateVoiceover,
  onProduceFull,
  isLoading
}: AudioLeadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 left-0 lg:left-[280px] z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border-[0.35px] border-[#0000001A]">
        {/* Modal Header - Unified Studio Style */}
        <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#02022C] rounded-xl flex items-center justify-center shadow-lg shadow-[#02022C]/10">
               <Icons.AudioWave className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[17px] font-bold text-[#121212]">Audio Orchestration Studio</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider">Acoustic Engine Standby</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#F1F5F9] rounded-full transition-colors group"
          >
            <Icons.Plus className="w-5 h-5 rotate-45 text-[#94A3B8] group-hover:text-[#121212]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
          <AudioGenerator 
            className="border-none shadow-none p-10"
            onGenerateMusic={(data) => { onGenerateMusic(data); onClose(); }}
            onGenerateVoiceover={(data) => { onGenerateVoiceover(data); onClose(); }}
            onProduceFull={(data) => { onProduceFull(data); onClose(); }}
            isLoading={isLoading}
          />
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-[#F1F5F9] bg-[#FDFDFF] flex items-center justify-between">
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Powered by Raver Neural Acoustics v2.0</span>
           </div>
           <div className="flex items-center gap-3">
              <button 
                onClick={onClose}
                className="h-11 px-8 bg-slate-50 text-[#121212] rounded-xl font-bold text-sm hover:bg-slate-100 transition-all border border-slate-100"
              >
                Cancel Orchestration
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
