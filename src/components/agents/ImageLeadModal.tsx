"use client";

import React from "react";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

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
  mood: string;
  setMood: (val: string) => void;
  aspectRatio: string;
  setAspectRatio: (val: string) => void;
  platform: string;
  setPlatform: (val: string) => void;
  uploadedImageUrl: string;
  setUploadedImageUrl: (val: string) => void;
  scenes: Scene[];
  handleUpdateScene: (id: string, prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;

  // Enhancement Props
  selectedImage: string;
  setSelectedImage: (val: string) => void;
  enhancements: { focus: number; brightness: number; contrast: number };
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
  mood,
  setMood,
  aspectRatio,
  setAspectRatio,
  platform,
  setPlatform,
  uploadedImageUrl,
  setUploadedImageUrl,
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

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-[#02022C]/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header & Tabs */}
        <div className="px-8 pt-8 border-b border-slate-100 flex flex-col gap-6 shrink-0">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="flex flex-col">
                   <h3 className="text-2xl font-black text-[#02022C] tracking-tight">
                     {activeTab === "generate" ? "Campaign Creation Studio" : "Neural Enhancement Lab"}
                   </h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                     {activeTab === "generate" ? "Kling AI Realistic Mode" : "Image Post-Processing Active"}
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
                <Icons.MagicWand className="w-4 h-4" /> Generation
              </button>
              <button 
                onClick={() => setActiveTab("enhance")}
                className={cn(
                  "px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2",
                  activeTab === "enhance" ? "bg-white text-[#02022C] shadow-sm border border-slate-100" : "text-slate-400 hover:text-[#02022C]"
                )}
              >
                <Icons.Success className="w-4 h-4" /> Enhancement
              </button>
           </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === "generate" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Generation Content */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col gap-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-200 pb-3">Core Brand Metrics</h4>
                  
                  <div className="flex flex-col gap-2">
                     <label className="text-[11px] font-black text-[#02022C] uppercase tracking-wider">Business Identity</label>
                     <input 
                       value={businessName}
                       onChange={(e) => setBusinessName(e.target.value)}
                       placeholder="e.g. Glow Studio"
                       className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:border-[#02022C] outline-none font-medium"
                     />
                  </div>

                  <div className="flex flex-col gap-2">
                     <label className="text-[11px] font-black text-[#02022C] uppercase tracking-wider">Core Product</label>
                     <input 
                       value={productName}
                       onChange={(e) => setProductName(e.target.value)}
                       placeholder="e.g. Luxury Skincare Serum"
                       className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:border-[#02022C] outline-none font-medium"
                     />
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                       <label className="text-[11px] font-black text-[#02022C] uppercase tracking-wider">Target Audience</label>
                       <input 
                         value={targetAudience}
                         onChange={(e) => setTargetAudience(e.target.value)}
                         placeholder="e.g. Women 25-40"
                         className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:border-[#02022C] outline-none font-medium"
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                         <label className="text-[11px] font-black text-[#02022C] uppercase tracking-wider">Mood</label>
                         <input 
                           value={mood}
                           onChange={(e) => setMood(e.target.value)}
                           placeholder="cinematic"
                           className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:border-[#02022C] outline-none font-medium"
                         />
                      </div>
                      <div className="flex flex-col gap-2">
                         <label className="text-[11px] font-black text-[#02022C] uppercase tracking-wider">Aspect</label>
                         <select 
                           value={aspectRatio}
                           onChange={(e) => setAspectRatio(e.target.value)}
                           className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:border-[#02022C] outline-none font-bold"
                         >
                           <option value="16:9">16:9</option>
                           <option value="9:16">9:16</option>
                           <option value="1:1">1:1</option>
                         </select>
                      </div>
                    </div>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col gap-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">7-Scene Matrix</h4>
                <div className="grid grid-cols-1 gap-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar p-1">
                  {scenes.map((scene, idx) => (
                    <div key={scene.id} className="p-4 bg-slate-50/30 rounded-2xl border border-slate-100 flex flex-col gap-2">
                      <label className="text-[11px] font-black text-[#02022C] uppercase tracking-widest flex items-center gap-2">
                        <span className="w-5 h-5 bg-[#02022C] text-white rounded-lg flex items-center justify-center text-[10px]">{idx + 1}</span>
                        Direction
                      </label>
                      <textarea 
                        value={scene.visual_prompt} 
                        onChange={(e) => handleUpdateScene(scene.id, e.target.value)} 
                        placeholder="Describe the cinematic action..."
                        className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs focus:border-[#02022C] outline-none resize-none h-20 transition-all" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Enhancement Content */}
              <div className="flex-1 flex flex-col gap-8">
                <div className="p-8 bg-slate-50/50 rounded-[40px] border border-slate-100 flex flex-col gap-8">
                   <div className="flex flex-col gap-3">
                     <label className="text-xs font-black text-[#02022C] uppercase tracking-widest">Image Source Metadata</label>
                     <div className="relative">
                        <input 
                          value={selectedImage} 
                          onChange={(e) => setSelectedImage(e.target.value)} 
                          placeholder="Paste image URL here..."
                          className="w-full bg-white border border-[#E2E8F0] rounded-2xl px-5 py-4 text-sm focus:border-[#02022C] outline-none font-medium pr-12" 
                        />
                        <Icons.Camera className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                     </div>
                   </div>

                   <div className="grid grid-cols-1 gap-6 p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm">
                      {Object.entries(enhancements).map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-4">
                          <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-wider text-[#02022C]">
                            <span>{key} Intensity</span>
                            <span className="text-[#02022C] bg-slate-50 px-3 py-1 rounded-full">{value.toFixed(1)}x</span>
                          </div>
                          <input 
                             type="range" 
                             min="0" max="2" 
                             step="0.1" 
                             value={value} 
                             onChange={(e) => setEnhancements({...enhancements, [key]: parseFloat(e.target.value)})} 
                             className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#02022C]" 
                          />
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="w-full lg:w-[400px] flex flex-col gap-4">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Visual Preview</h4>
                 <div className="relative aspect-square bg-[#F8FAFC] rounded-[40px] overflow-hidden border border-slate-100 shadow-inner group">
                    {selectedImage ? (
                      <Image src={selectedImage} alt="Enhance preview" fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-4">
                         <Icons.Image className="w-20 h-20" />
                         <p className="text-xs font-bold uppercase">No target selected</p>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between shrink-0">
           <div className="flex flex-col gap-1">
              <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-[#02022C] transition-all">Cancel Changes</button>
              {isLoading && (
                <div className="flex items-center gap-2 px-6">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-black text-[#02022C] uppercase tracking-widest">{statusMessage}</span>
                </div>
              )}
           </div>
           
           <button 
            onClick={activeTab === "generate" ? onGenerate : onEnhance}
            disabled={(activeTab === "enhance" && !selectedImage) || (activeTab === "generate" && (!productName || !businessName)) || isLoading || isEnhancing}
            className="h-14 px-10 bg-[#02022C] text-white rounded-[20px] font-black text-lg flex items-center justify-center gap-3 hover:shadow-2xl hover:bg-[#0A0A35] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {(isLoading || isEnhancing) ? <Icons.Loader className="w-6 h-6 animate-spin" /> : <Icons.MagicWand className="w-6 h-6" />}
            {activeTab === "generate" ? (isLoading ? "Synchronizing..." : "Generate Production Sequences") : (isEnhancing ? "Processing..." : "Apply Neural Enhancement")}
          </button>
        </div>
      </div>
    </div>
  );
}
