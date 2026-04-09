"use client";

import React, { useState } from "react";
import { Icons } from "@/components/ui/icons";
import { cn, normalizeAssetUrl } from "@/lib/utils";
import { toast } from "react-toastify";

interface RenderDetail {
  format: string;
  status: string;
  video_url: string;
  session_id: string;
  render_seconds: number;
  soft_timeout_exceeded?: boolean;
}

interface EditorResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    id: string;
    sessionId: string;
    campaignId: string;
    videoUrl: string;
    format: string;
    type?: "render" | "export";
    metadata?: {
      status: string;
      renders?: Record<string, RenderDetail>;
      render_details?: RenderDetail;
      payload?: {
        scenes: {
          duration: number;
          scene_id: number;
          image_url: string;
          overlay_text?: string;
          visual_prompt?: string;
        }[];
        logo_url?: string;
        music_url?: string;
        session_id?: string;
        transition?: string;
        video_model?: string;
        music_volume?: number;
        business_name?: string;
        voiceover_url?: string;
        animate_scenes?: boolean;
        transition_duration?: number;
      };
    } | null;
    createdAt: string;
  } | null;
}

export function EditorResultModal({ isOpen, onClose, result }: EditorResultModalProps) {
  const [activeFormat, setActiveFormat] = useState<string>(result?.format || "16:9");

  if (!isOpen || !result) return null;

  const renders = result.metadata?.renders || {};
  const currentRender = renders[activeFormat] || result.metadata?.render_details || { 
    video_url: result.videoUrl, 
    format: result.format,
    render_seconds: 0
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(normalizeAssetUrl(url));
    toast.success("link copied to clipboard");
  };

  return (
    <div className="fixed inset-y-0 right-0 left-0 lg:left-[280px] z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-6xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-500">
        
        {/* Left/Main: Video Player */}
        <div className="flex-1 bg-slate-50 flex flex-col relative group overflow-hidden border-r border-slate-100">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className={cn(
              "relative w-full shadow-2xl transition-all duration-500",
              activeFormat === "9:16" ? "max-w-[280px] aspect-[9/16]" : 
              activeFormat === "1:1" ? "max-w-[450px] aspect-square" : 
              "aspect-video"
            )}>
              <video 
                key={currentRender.video_url}
                src={normalizeAssetUrl(currentRender.video_url)} 
                controls 
                autoPlay
                className="w-full h-full object-cover rounded-[24px] border border-slate-200 shadow-inner bg-black"
              />
            </div>
          </div>

          {/* Floating Identifiers */}
          <div className="absolute top-8 left-8 flex gap-2">
            <div className="px-3 py-1 bg-white/80 backdrop-blur-xl rounded-lg border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm">
              {activeFormat} Ratio
            </div>
            {currentRender.render_seconds > 0 && (
              <div className="px-3 py-1 bg-emerald-50 backdrop-blur-xl rounded-lg border border-emerald-100 text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-sm">
                {currentRender.render_seconds.toFixed(1)}s Synthesis
              </div>
            )}
          </div>
        </div>

        {/* Right: Consolidated Control Panel */}
        <div className="w-full md:w-[420px] bg-white p-0 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#02022C] flex items-center justify-center shadow-lg shadow-[#02022C]/10">
                <Icons.MagicWand className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Editor</span>
                <span className="text-sm font-black text-[#01012A] uppercase tracking-tight">Synthesis Outcome</span>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center transition-all group">
              <Icons.Plus className="w-5 h-5 rotate-45 text-slate-300 group-hover:text-slate-600" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
            
            {/* Variations */}
            <div className="space-y-4">
              <span className="text-[11px] font-black text-[#01012A] uppercase tracking-[0.2em] opacity-40">Available Formats</span>
              <div className="grid grid-cols-1 gap-2">
                {Object.keys(renders).length > 0 ? (
                  Object.keys(renders).map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFormat(f)}
                      className={cn(
                        "flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-300",
                        activeFormat === f 
                          ? "bg-slate-50 border-slate-200 text-[#01012A] shadow-sm" 
                          : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icons.Monitor className={cn("w-4 h-4", activeFormat === f ? "text-blue-600" : "text-slate-200")} />
                        <span className="text-[11px] font-black uppercase tracking-widest">{f} Ratio</span>
                      </div>
                      {activeFormat === f && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />}
                    </button>
                  ))
                ) : (
                   <div className="px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                     Standard {result.format} Asset
                   </div>
                )}
              </div>
            </div>

            {/* Blueprint Section */}
            {result.metadata?.payload && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-[#01012A] uppercase tracking-[0.2em] opacity-40">Orchestration Blueprint</span>
                  <div className="h-px bg-slate-100 flex-1" />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {result.metadata.payload.scenes.map((scene, idx) => (
                    <div key={idx} className="group/scene bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-3 hover:bg-slate-50 hover:border-slate-200 transition-all">
                       <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Scene {idx + 1}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{scene.duration}s</span>
                       </div>
                       <div className="aspect-video rounded-xl overflow-hidden border border-slate-100 bg-white">
                          <img src={normalizeAssetUrl(scene.image_url)} alt={`Scene ${idx}`} className="w-full h-full object-cover opacity-80 group-hover/scene:opacity-100 transition-opacity" />
                       </div>
                       {scene.visual_prompt && (
                         <p className="text-[10px] text-slate-500 leading-relaxed font-bold lowercase tracking-tight line-clamp-2 group-hover/scene:line-clamp-none transition-all">
                           {scene.visual_prompt}
                         </p>
                       )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Inventory */}
            <div className="space-y-4">
               <span className="text-[11px] font-black text-[#01012A] uppercase tracking-[0.2em] opacity-40">Synthesis Inventory</span>
               <div className="bg-slate-50/50 rounded-[32px] p-6 border border-slate-100 space-y-6">
                  {result.metadata?.payload?.business_name && (
                     <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Organization</span>
                        <span className="text-[13px] font-black text-[#01012A] uppercase tracking-tight">{result.metadata.payload.business_name}</span>
                     </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Job Mode</span>
                       <span className={cn(
                         "text-[10px] font-black uppercase tracking-widest",
                         result.type === "export" ? "text-purple-600" : "text-blue-600"
                       )}>
                         {result.type || "Synthesis"}
                       </span>
                    </div>

                    {result.metadata?.payload?.video_model && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Cinematic Core</span>
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{result.metadata.payload.video_model}</span>
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-slate-200/50" />

                  {result.metadata?.payload?.voiceover_url && (
                     <div className="flex flex-col gap-3">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">
                          <Icons.Mic className="w-2.5 h-2.5" /> Neural Voice Track
                        </span>
                        <audio src={normalizeAssetUrl(result.metadata.payload.voiceover_url)} controls className="w-full h-8 scale-95 origin-left" />
                     </div>
                  )}

                  {result.metadata?.payload?.music_url && (
                     <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">
                             <Icons.Music className="w-2.5 h-2.5" /> Background Audio
                           </span>
                           {result.metadata.payload.music_volume !== undefined && (
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                 Vol: {Math.round(result.metadata.payload.music_volume * 100)}%
                              </span>
                           )}
                        </div>
                        <audio src={normalizeAssetUrl(result.metadata.payload.music_url)} controls className="w-full h-8 scale-95 origin-left" />
                     </div>
                  )}

                  {result.metadata?.payload?.transition && (
                     <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Transition Protocol</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{result.metadata.payload.transition}</span>
                           <span className="text-slate-200">•</span>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{result.metadata.payload.transition_duration}s duration</span>
                        </div>
                     </div>
                  )}

                  <div className="pt-2">
                     <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center justify-between">
                          <span>Neural Identifier</span>
                          <button onClick={() => handleCopy(result.id)} className="hover:text-[#01012A] transition-colors">
                             <Icons.Copy className="w-2.5 h-2.5" />
                          </button>
                        </span>
                        <span className="text-[9px] font-bold text-slate-300 break-all leading-tight font-mono">{result.id}</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex flex-col gap-3 shrink-0">
            <button 
              onClick={() => handleCopy(currentRender.video_url)}
              className="w-full h-14 bg-[#02022C] text-white rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] hover:shadow-xl hover:-translate-y-px transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#02022C]/10"
            >
              <Icons.Copy className="w-4 h-4" />
              Copy Synthesis Link
            </button>
            <button 
              onClick={onClose}
              className="w-full h-14 bg-white text-slate-500 rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] border border-slate-200 hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              Archive View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
