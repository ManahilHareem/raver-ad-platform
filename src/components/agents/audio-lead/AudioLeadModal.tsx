"use client";

import React from "react";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { AudioGenerator } from "./AudioGenerator";

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
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-[#01012A]/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] rounded-[32px] sm:rounded-[48px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-[#01012A] rounded-[20px] flex items-center justify-center shadow-lg shadow-[#01012A]/10">
               <Icons.AudioWave className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-2xl font-black text-[#01012A] tracking-tight">Audio Orchestration Studio</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Configure Neural Acoustic Parameters</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-300 hover:text-[#01012A] group"
          >
            <Icons.Plus className="w-7 h-7 rotate-45 transition-transform group-hover:scale-110" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10">
          <AudioGenerator 
            className="border-none shadow-none p-0"
            onGenerateMusic={(data) => { onGenerateMusic(data); onClose(); }}
            onGenerateVoiceover={(data) => { onGenerateVoiceover(data); onClose(); }}
            onProduceFull={(data) => { onProduceFull(data); onClose(); }}
            isLoading={isLoading}
          />
        </div>

        {/* Modal Footer - Optional helper text or status */}
        <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neural Engine Standby</span>
           </div>
           <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Powered by Raver Neural Acoustics v2.0</span>
        </div>
      </div>
    </div>
  );
}
