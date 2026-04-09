"use client";

import React, { useState } from "react";
import { Icons } from "@/components/ui/icons";
import { CandidateCard } from "./CandidateCard";
import { cn } from "@/lib/utils";

interface QualityCandidatesProps {
  candidates: {
    video_synthesis: any[];
    audio_mix: any[];
    image_scenes: any[];
    copy_script: any[];
    producer_render: any[];
    director_session: any[];
  } | null;
  isLoading: boolean;
  onAudit: (candidate: any) => void;
}

export function QualityCandidates({ candidates, isLoading, onAudit }: QualityCandidatesProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filters = [
    { id: "all", label: "All Audits", icon: Icons.Activity },
    { id: "video", label: "Video Renders", icon: Icons.Film },
    { id: "Audio", label: "Audio Mixes", icon: Icons.Mic },
    { id: "Image", label: "Visual Foundations", icon: Icons.Image },
    { id: "Copy", label: "Brand Scripts", icon: Icons.Files },
  ];

  if (isLoading && !candidates) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <div className="w-16 h-16 rounded-[24px] bg-[#01012A]/5 border border-[#01012A]/10 flex items-center justify-center animate-pulse">
           <Icons.Activity className="w-8 h-8 text-[#01012A]/20" />
        </div>
        <div className="text-center">
           <h3 className="text-lg font-black text-[#01012A] tracking-tighter lowercase">Synchronizing Neural Archives...</h3>
           <p className="text-sm text-slate-400 font-bold">Accessing candidate pools across all specialist agents.</p>
        </div>
      </div>
    );
  }

  if (!candidates) return null;

  // Flatten and filter candidates
  const allCandidates = [
    ...candidates.video_synthesis,
    ...candidates.audio_mix,
    ...candidates.image_scenes,
    ...candidates.copy_script,
    ...candidates.producer_render,
    ...candidates.director_session,
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const displayedCandidates = activeFilter === "all" 
    ? allCandidates 
    : allCandidates.filter(c => {
        if (activeFilter === "video") {
          return ["Editor", "Producer", "Director", "video_synthesis", "producer_render", "director_session"].includes(c.type);
        }
        return c.type === activeFilter;
      });

  return (
    <div className="flex flex-col gap-10">
      {/* Category Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
        {filters.map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                "px-6 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all border whitespace-nowrap",
                activeFilter === f.id
                  ? "bg-[#01012A] text-white border-[#01012A] shadow-xl shadow-[#01012A]/10"
                  : "bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:text-[#01012A]"
              )}
            >
              <Icon className="w-4 h-4" />
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {displayedCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedCandidates.map((candidate) => (
            <CandidateCard 
              key={candidate.id}
              {...candidate}
              onAudit={onAudit}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[32px] py-20 flex flex-col items-center justify-center gap-4">
           <Icons.Filter className="w-10 h-10 text-slate-200" />
           <div className="text-center">
             <h3 className="text-[16px] font-black text-[#01012A] tracking-tighter lowercase">No candidates in this category_</h3>
             <p className="text-sm text-slate-400 font-bold">Try adjusting your filters or initiate new synthesis tasks.</p>
           </div>
        </div>
      )}
    </div>
  );
}
