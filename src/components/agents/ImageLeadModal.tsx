"use client";

import React from "react";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import { cn, normalizeAssetUrl } from "@/lib/utils";

interface Scene {
  id: string;
  visual_prompt: string;
}

interface ImageLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: "generate" | "enhance";
  setActiveTab: (tab: "generate" | "enhance") => void;
  
  // Generation Props
  businessName: string;
  setBusinessName: (val: string) => void;
  productName: string;
  setProductName: (val: string) => void;
  targetAudience: string;
  setTargetAudience: (val: string) => void;
  brandTone: string;
  setBrandTone: (val: string) => void;
  mood: string;
  setMood: (val: string) => void;
  aspectRatio: string;
  setAspectRatio: (val: string) => void;
  platform: string;
  setPlatform: (val: string) => void;
  scenes: Scene[];
  handleUpdateScene: (id: string, prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;

  // Enhancement Props
  selectedImage: string;
  setSelectedImage: (val: string) => void;
  enhancements: { brightness: number; saturation: number; sharpness: number; contrast: number };
  setEnhancements: (val: any) => void;
  onEnhance: () => void;
  isEnhancing: boolean;
  statusMessage?: string;
}

export default function ImageLeadModal({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  businessName,
  setBusinessName,
  productName,
  setProductName,
  targetAudience,
  setTargetAudience,
  brandTone,
  setBrandTone,
  mood,
  setMood,
  aspectRatio,
  setAspectRatio,
  platform,
  setPlatform,
  scenes,
  handleUpdateScene,
  onGenerate,
  isLoading,
  selectedImage,
  setSelectedImage,
  enhancements,
  setEnhancements,
  onEnhance,
  isEnhancing,
  statusMessage
}: ImageLeadModalProps) {
  
  if (!isOpen) return null;

  const hasAtLeastOneScene = scenes.some(s => s.visual_prompt.trim() !== "");
  const canContinueToStyle = businessName.trim() && productName.trim() && targetAudience.trim() && brandTone.trim() && hasAtLeastOneScene;

  return (
    <div className="fixed inset-y-0 right-0 left-0 lg:left-[280px] z-100 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-[#02022C]/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] rounded-[24px] sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header & Tabs */}
        <div className="px-8 pt-8 border-b border-slate-100 flex flex-col gap-6 shrink-0">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="flex flex-col">
                    <h3 className="text-2xl font-black text-[#02022C] tracking-tight">
                     {activeTab === "generate" ? "Campaign Creation Studio" : "Visual Style Anchor & Enhancement"}
                   </h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                     {activeTab === "generate" ? "Narrative & Creative Parameters" : "Final Refinement & Reference Logic"}
                   </p>
                 </div>
              </div>
              <button 
               onClick={onClose}
               className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-[#02022C]"
              >
                <Icons.Plus className="w-6 h-6 rotate-45" />
              </button>
           </div>

            <div className="flex gap-2 p-1 bg-slate-50 w-fit rounded-2xl -mb-px">
               <button 
                 onClick={() => setActiveTab("generate")}
                 className={cn(
                   "px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2",
                   activeTab === "generate" ? "bg-white text-[#02022C] shadow-sm border border-slate-100" : "text-slate-400 hover:text-[#02022C]"
                 )}
               >
                 <Icons.MagicWand className="w-4 h-4" /> 1. Narrative
               </button>
               <button 
                 onClick={() => setActiveTab("enhance")}
                 className={cn(
                   "px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2",
                   activeTab === "enhance" ? "bg-white text-[#02022C] shadow-sm border border-slate-100" : "text-slate-400 hover:text-[#02022C]"
                 )}
               >
                 <Icons.MagicWand className="w-4 h-4" /> 2. Refinement & Launch
               </button>
            </div>
        </div>

        {/* Modal Body */}
         <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          {activeTab === "generate" ? (
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Unified Generation Content */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  {/* Brand Metrics Section */}
                  <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col gap-5">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-200 pb-3">Core Brand Metrics</h4>
                    
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-black text-[#02022C] uppercase tracking-wider">Business Identity</label>
                       <input 
                         value={businessName}
                         onChange={(e) => setBusinessName(e.target.value)}
                         placeholder="e.g. Glow Studio"
                         className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs focus:border-[#02022C] outline-none font-medium"
                       />
                    </div>

                    <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-black text-[#02022C] uppercase tracking-wider">Core Product</label>
                       <input 
                         value={productName}
                         onChange={(e) => setProductName(e.target.value)}
                         placeholder="e.g. Luxury Serum"
                         className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs focus:border-[#02022C] outline-none font-medium"
                       />
                    </div>

                    <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-black text-[#02022C] uppercase tracking-wider">Target Audience</label>
                       <input 
                         value={targetAudience}
                         onChange={(e) => setTargetAudience(e.target.value)}
                         placeholder="e.g. Women 25-40"
                         className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs focus:border-[#02022C] outline-none font-medium mb-2"
                       />
                       
                    </div>
                        <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-black text-[#02022C] uppercase tracking-wider">Tone</label>
                      <input 
                         value={brandTone}
                         onChange={(e) => setBrandTone(e.target.value)}
                         placeholder="e.g. Professional, Bold"
                         className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs focus:border-[#02022C] outline-none font-medium"
                       />
                    </div>
                  </div>

                  {/* Aesthetics Section */}
                  <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col gap-5">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-200 pb-3">Global Aesthetics</h4>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-[#02022C] uppercase tracking-wider">Universal Mood</label>
                      <input 
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                        placeholder="e.g. Cinematic, High Contrast"
                        className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs focus:border-[#02022C] outline-none font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                       <label className="text-[10px] font-black text-[#02022C] uppercase tracking-wider">Format & Deployment</label>
                       <div className="grid grid-cols-3 gap-2">
                          {["16:9", "9:16", "1:1"].map((ratio) => (
                            <button
                              key={ratio}
                              onClick={() => setAspectRatio(ratio)}
                              className={cn(
                                "py-2 rounded-lg text-[10px] font-black transition-all border",
                                aspectRatio === ratio ? "bg-[#02022C] text-white border-[#02022C]" : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                              )}
                            >
                              {ratio}
                            </button>
                          ))}
                       </div>
                       <div className="flex gap-2 mt-2">
                          {[
                            { id: "instagram", icon: Icons.Instagram },
                            { id: "facebook", icon: Icons.Facebook },
                            { id: "youtube", icon: Icons.Youtube }
                          ].map((p) => (
                            <button
                              key={p.id}
                              onClick={() => setPlatform(p.id)}
                              className={cn(
                                "flex-1 py-2 rounded-lg border transition-all flex items-center justify-center",
                                platform === p.id ? "bg-white border-[#02022C] text-[#02022C] shadow-sm" : "bg-slate-100 border-transparent text-slate-400"
                              )}
                            >
                              <p.icon className="w-3.5 h-3.5" />
                            </button>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 flex flex-col gap-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center justify-between">
                    Storyboard Direction (7-Scene Matrix)
                    <span className="text-[8px] font-bold text-slate-300">Kinetic Sequences</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar p-1">
                    {scenes.map((scene, idx) => (
                      <div key={scene.id} className="p-4 bg-slate-50/30 rounded-2xl border border-slate-100 flex flex-col gap-2">
                        <label className="text-[10px] font-black text-[#02022C] uppercase tracking-widest flex items-center gap-2">
                          <span className="w-5 h-5 bg-[#02022C] text-white rounded-lg flex items-center justify-center text-[10px]">{idx + 1}</span>
                          Cinematic Direction
                        </label>
                        <textarea 
                          value={scene.visual_prompt} 
                          onChange={(e) => handleUpdateScene(scene.id, e.target.value)} 
                          placeholder="Describe the cinematic action..."
                          className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-[11px] focus:border-[#02022C] outline-none resize-none h-20 transition-all font-medium" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1 flex flex-col gap-8">
                <div className="p-8 bg-slate-50/50 rounded-[40px] border border-slate-100 flex flex-col gap-8">
                   <div className="flex flex-col gap-3">
                     <label className="text-xs font-black text-[#02022C] uppercase tracking-widest">Visual Reference / Style Anchor</label>
                     <div className="relative">
                        <input 
                          value={selectedImage} 
                          onChange={(e) => setSelectedImage(e.target.value)} 
                          placeholder="Paste reference image URL here..."
                          className="w-full bg-white border border-[#E2E8F0] rounded-2xl px-5 py-4 text-sm focus:border-[#02022C] outline-none font-medium pr-12" 
                        />
                        <Icons.Camera className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                     </div>
                   </div>

                   <div className="grid grid-cols-1 gap-6 p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm">
                      {Object.entries(enhancements).map(([key, value]) => {
                        const rangeMap: Record<string, { min: number, max: number }> = {
                          brightness: { min: 0.5, max: 2.0 },
                          saturation: { min: 0.0, max: 3.0 },
                          sharpness: { min: 0.0, max: 3.0 },
                          contrast: { min: 0.5, max: 2.0 }
                        };
                        const range = rangeMap[key] || { min: 0, max: 2 };
                        
                        return (
                          <div key={key} className="flex flex-col gap-4">
                            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-wider text-[#02022C]">
                              <span>{key} Intensity</span>
                              <span className="text-[#02022C] bg-slate-50 px-3 py-1 rounded-full">{Number(value).toFixed(2)}x</span>
                            </div>
                            <input 
                               type="range" 
                               min={range.min} 
                               max={range.max} 
                               step="0.05" 
                               value={value} 
                               onChange={(e) => setEnhancements({...enhancements, [key]: parseFloat(e.target.value)})} 
                               className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#02022C]" 
                            />
                          </div>
                        );
                      })}
                   </div>
                </div>
              </div>

              <div className="w-full lg:w-[400px] flex flex-col gap-4">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Visual Style Preview</h4>
                 <div className="relative aspect-square bg-[#F8FAFC] rounded-[40px] overflow-hidden border border-slate-100 shadow-inner group">
                    {selectedImage ? (
                      <Image src={normalizeAssetUrl(selectedImage)} alt="Enhance preview" fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-4">
                         <Icons.Image className="w-20 h-20" />
                         <p className="text-xs font-bold uppercase">No style anchor</p>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between shrink-0">
           <div className="flex flex-col gap-1">
              <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-[#02022C] transition-all">Cancel Overview</button>
              {isLoading && (
                <div className="flex items-center gap-2 px-6">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-black text-[#02022C] uppercase tracking-widest">{statusMessage}</span>
                </div>
              )}
           </div>
           
           <div className="flex items-center gap-4">
             {activeTab === "generate" ? (
               <button 
                onClick={() => setActiveTab("enhance")}
                disabled={!canContinueToStyle}
                className="h-14 px-10 bg-linear-to-br from-[#0A0A0A] via-[#0A0A0A] to-[#334155] text-white rounded-[20px] font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all disabled:opacity-50"
               >
                 Review & Enhance <Icons.ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
               </button>
             ) : (
               <button 
                onClick={(businessName && productName) ? onGenerate : onEnhance}
                disabled={(activeTab === "enhance" && !selectedImage && !(businessName && productName)) || isLoading || isEnhancing}
                className="h-14 px-10 bg-linear-to-br from-[#0A0A0A] via-[#0A0A0A] to-[#334155] text-white rounded-[20px] font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all disabled:opacity-50"
               >
                 {(isLoading || isEnhancing) ? <Icons.Loader className="w-6 h-6 animate-spin" /> : <Icons.MagicWand className="w-6 h-6" />}
                 {(businessName && productName) ? (isLoading ? "Synchronizing..." : "Generate Production Sequence") : (isEnhancing ? "Processing..." : "Apply Neural Enhancement")}
               </button>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
