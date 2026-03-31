"use client";

import React from "react";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface PipelineStep {
  id: string;
  label: string;
  icon: keyof typeof Icons;
  status: "done" | "running" | "pending";
  metadata?: string;
}

export function LiveProductionTracker({ 
  campaignId, 
  status = "in_production", 
  statusMessage = "Image Generation",
  pipelineMessage = "Attempt 1/3"
}: any) {
  
  const getStepStatus = (label: string): "done" | "running" | "pending" => {
    const s = status?.toLowerCase();
    const msg = statusMessage?.toLowerCase() || "";
    
    if (s === "delivered" || s === "completed") return "done";
    
    switch (label) {
      case "Prompt":
      case "Creative Brief":
        return "done";
      case "Image Generation":
        if (msg.includes("image")) return "running";
        if (s === "ready_for_human_review" || s === "completed" || s === "delivered") return "done";
        return "pending";
      case "Copy Generation":
        if (msg.includes("copy")) return "running";
        if (s === "ready_for_human_review" || s === "completed" || s === "delivered") return "done";
        return "pending";
      case "Audio Generation":
        if (msg.includes("audio")) return "running";
        if (s === "ready_for_human_review" || s === "completed" || s === "delivered") return "done";
        return "pending";
      case "Editor":
        if (msg.includes("video") || msg.includes("editor")) return "running";
        if (s === "completed" || s === "delivered") return "done";
        return "pending";
      case "Quality Check":
      case "Rendering":
        if (msg.includes("render") || msg.includes("quality")) return "running";
        if (s === "delivered" || s === "completed") return "done";
        return "pending";
      default:
        return "pending";
    }
  };

  const steps: PipelineStep[] = [
    { id: "prompt", label: "Prompt", icon: "Mic", status: "done" },
    { id: "brief", label: "Creative Brief", icon: "AssetLibrary", status: "done" },
    { id: "image", label: "Image Generation", icon: "Image", status: getStepStatus("Image Generation"), metadata: "Attempt 1/3" },
    { id: "copy", label: "Copy Generation", icon: "Send", status: getStepStatus("Copy Generation") },
    { id: "audio", label: "Audio Generation", icon: "AudioWave", status: getStepStatus("Audio Generation") },
    { id: "editor", label: "Editor", icon: "Monitor", status: getStepStatus("Editor") },
    { id: "quality", label: "Quality Check", icon: "Success", status: getStepStatus("Quality Check") },
    { id: "render", label: "Rendering", icon: "Video", status: getStepStatus("Rendering") },
  ];

  if (!campaignId) return (
    <div 
      className="bg-white rounded-[32px] p-12 border border-slate-100 border-dashed flex flex-col items-center justify-center text-center gap-6 min-h-[460px] shadow-sm relative overflow-hidden"
    >
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
      <div className="relative">
        <div className="absolute inset-0 bg-slate-400/10 blur-2xl rounded-full scale-150 animate-pulse" />
        <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center relative border border-slate-100 shadow-xl shadow-slate-100/50">
          <Icons.Activity className="w-10 h-10 text-slate-200" />
        </div>
      </div>
      <div className="flex flex-col gap-2 max-w-[260px] relative z-10">
        <h3 className="text-xl font-black text-[#0A0A0A] tracking-tighter lowercase leading-none">dormant production pipeline</h3>
        <p className="text-sm text-slate-400 font-bold leading-relaxed">Launch an orchestration brief to ignite the neural production thread.</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-8 h-full relative overflow-hidden group">
      {/* Aesthetic mesh background elements */}
      <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-400/5 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-linear-to-r from-[#01012A] to-[#2E2C66] rounded-[16px] flex items-center justify-center shadow-xl shadow-[#01012A]/10 relative">
             <div className="absolute inset-0 bg-white rounded-[16px] animate-pulse opacity-10" />
             <Icons.Activity className="w-6 h-6 text-white relative z-10" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight text-[#01012A]">Production Pipeline</h2>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{status}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">campaign_id</span>
          <span className="text-[10px] font-mono font-black text-[#01012A] truncate max-w-[100px]">{campaignId}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 pr-4 relative z-10">
         <div className="flex items-center justify-between mb-8">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Neural Thread</p>
           <span className="text-[10px] font-bold text-slate-400 italic">{pipelineMessage}</span>
         </div>
         
         <div className="flex flex-col gap-7 relative pl-1">
            {/* Neural Thread Line */}
            <div className="absolute left-[15.5px] top-4 bottom-4 w-px bg-slate-100 overflow-hidden">
               <div className="absolute inset-0 w-full h-[30%] bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse" />
            </div>

            {steps.map((step, idx) => {
              const isRunning = step.status === "running";
              const isDone = step.status === "done";
              
              return (
                <div 
                  key={step.id} 
                  className="flex gap-5 relative z-10"
                >
                  <div className="relative">
                    {/* Step Glow for running state */}
                    {isRunning && (
                      <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-110" />
                    )}
                    
                    <div 
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-700 relative z-10 shadow-sm",
                        isDone ? "bg-linear-to-r from-[#01012A] to-[#2E2C66] text-white" : 
                        isRunning ? "bg-white border-2 border-[#01012A] text-[#01012A] shadow-lg shadow-[#01012A]/10" : 
                        "bg-white border border-slate-100 text-slate-300"
                      )}
                    >
                      {isDone ? <Icons.Success className="w-4 h-4" /> : 
                       isRunning ? <Icons.Loader className="w-4 h-4 animate-spin" /> : 
                       <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />}
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5 pt-1 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[14px] font-bold tracking-tight transition-colors duration-500",
                          step.status === "pending" ? "text-slate-300" : 
                          isRunning ? "text-[#01012A]" : "text-[#01012A]"
                        )}>{step.label}</span>
                        {isRunning && (
                          <span className="px-2 py-0.5 bg-slate-50 text-[#01012A] text-[8px] font-black uppercase rounded-lg border border-slate-100 animate-pulse">
                            active
                          </span>
                        )}
                      </div>
                    </div>
                    {step.metadata && isRunning && (
                      <p className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-tighter">{step.metadata}</p>
                    )}
                  </div>
                </div>
              );
            })}
         </div>
      </div>

      <div className="mt-auto pt-8 border-t border-slate-50 relative z-10">
        <div className="bg-slate-50/50 rounded-[24px] p-6 flex flex-col gap-4 border border-slate-100/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Icons.PenLine className="w-3.5 h-3.5 text-slate-400" />
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Optimization Feedback</label>
          </div>
          <textarea 
            placeholder="e.g. Enhance high-speed transitions..."
            className="w-full bg-transparent text-sm font-medium outline-none resize-none h-20 text-[#01012A] placeholder:text-slate-300 leading-relaxed"
          ></textarea>
          <button 
            className="w-full h-11 bg-linear-to-r from-[#01012A] to-[#2E2C66] text-white rounded-[14px] text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-[#01012A]/10 active:scale-95"
          >
            Update Production Thread
          </button>
        </div>
      </div>
    </div>
  );
}
