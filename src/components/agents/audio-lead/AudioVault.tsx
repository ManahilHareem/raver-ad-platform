"use client";

import React from "react";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { AudioPlayer } from "./AudioPlayer";

interface AudioAsset {
  filename: string;
  url: string;
  type: "music" | "voiceover" | "full";
  timestamp: string;
  session_id: string;
}

interface AudioVaultProps {
  assets: AudioAsset[];
  onDownload: (url: string) => void;
  isLoading: boolean;
  className?: string;
}

export function AudioVault({ assets, onDownload, isLoading, className }: AudioVaultProps) {
  if (isLoading && assets.length === 0) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[32px] p-20 flex flex-col items-center justify-center gap-6 text-center">
         <div className="w-16 h-16 bg-white rounded-[20px] flex items-center justify-center border border-slate-100 shadow-sm animate-pulse">
            <Icons.Loader className="w-8 h-8 text-slate-300 animate-spin" />
         </div>
         <div className="flex flex-col gap-2">
            <h3 className="text-xl font-black text-[#01012A] tracking-tighter lowercase">Neural Vault Syncing...</h3>
            <p className="text-sm text-slate-400 font-bold max-w-xs">Accessing the synthesis archives to retrieve your audio assets.</p>
         </div>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-100 rounded-[32px] p-20 flex flex-col items-center justify-center gap-6 text-center">
         <div className="w-16 h-16 bg-slate-50 rounded-[20px] flex items-center justify-center border border-slate-100 shadow-sm">
            <Icons.Mic className="w-8 h-8 text-slate-200" />
         </div>
         <div className="flex flex-col gap-2">
            <h3 className="text-xl font-black text-[#01012A] tracking-tighter lowercase">no audio assets synthesized_</h3>
            <p className="text-sm text-slate-400 font-bold max-w-xs">Initiate a neural synthesis via the orchestration hub to populate this vault.</p>
         </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="flex items-center justify-between border-b border-slate-50 pb-6">
        <div className="flex items-center gap-3">
          <Icons.Files className="w-5 h-5 text-[#01012A]" />
          <h3 className="text-xl font-black text-[#01012A] tracking-tighter lowercase">Session Audit Vault</h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
           <span className="text-[10px] font-black uppercase tracking-widest text-[#01012A]">{assets.length} Assets Found</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset, idx) => (
          <div key={`${asset.session_id}-${idx}`} className="flex flex-col gap-4 group">
            <div className="relative">
              <div className={cn(
                "absolute top-4 right-4 z-10 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm",
                asset.type === "full" ? "bg-purple-50 text-purple-600 border-purple-100" :
                asset.type === "music" ? "bg-blue-50 text-blue-600 border-blue-100" :
                "bg-emerald-50 text-emerald-600 border-emerald-100"
              )}>
                {asset.type}
              </div>
              <AudioPlayer 
                url={asset.url}
                title={asset.filename.split('/').pop() || "Audio Asset"}
              />
            </div>
            
            <div className="flex items-center justify-between px-2">
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                  {new Date(asset.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
               </span>
               <button 
                onClick={() => onDownload(asset.url)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-all active:scale-90 text-slate-400 hover:text-[#01012A]"
                title="Download Neural Asset"
               >
                 <Icons.Download className="w-4 h-4" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
