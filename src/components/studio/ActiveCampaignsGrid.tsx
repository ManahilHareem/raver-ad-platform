"use client";

import React from "react";
import CampaignCard from "./CampaignCard";
import { Icons } from "@/components/ui/icons";

interface Campaign {
  id?: string;
  title: string;
  status: string;
  image: string;
  sessionId?: string;
  videoUrl?: string | null;
  voiceoverUrl?: string | null;
  musicUrl?: string | null;
}

interface ActiveCampaignsGridProps {
  campaigns: Campaign[];
  onDelete: (campaign: Campaign) => void;
  onViewMore: () => void;
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function ActiveCampaignsGrid({ 
  campaigns, 
  onDelete, 
  onViewMore, 
  activeIndex, 
  onSelect 
}: ActiveCampaignsGridProps) {
  return (
    <div className="flex flex-col gap-[16px] bg-[#FFFFFF] border-[0.35px] border-[#0000001A] rounded-[12px] p-[16px]">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-[#121212]">
          Active Campaigns
        </h2>
        <button 
          onClick={onViewMore}
          className="px-3 py-1.5 rounded-lg text-[13px] font-bold text-[#121212] transition-all flex items-center gap-1.5 group hover:bg-linear-to-r hover:from-[#01012A] hover:to-[#2E2C66] hover:text-white active:scale-95"
        >
          View More 
          <Icons.ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px]">
        {campaigns.length > 0 ? (
          campaigns.slice(0, 3).map((campaign, i) => (
            <CampaignCard 
              key={campaign.sessionId || campaign.id || i} 
              {...campaign} 
              videoUrl={campaign.videoUrl}
              voiceover_url={campaign.voiceoverUrl}
              music_url={campaign.musicUrl}
              onDelete={() => onDelete(campaign)}
              isSelected={i === activeIndex}
              onClick={() => onSelect(i)}
            />
          ))
        ) : (
          <div className="col-span-full h-[150px] flex flex-col items-center justify-center bg-[#F8FAFC] border border-dashed border-slate-200 rounded-[12px] gap-2">
            <Icons.Activity className="w-8 h-8 text-slate-300" />
            <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">No active campaigns right now</p>
          </div>
        )}
      </div>
    </div>
  );
}
