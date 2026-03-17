"use client";

import React from "react";

interface SummaryItem {
  label: string;
  value: string;
  fullWidth?: boolean;
}

export default function CampaignStep4() {
  const summaryData: SummaryItem[] = [
    { label: "Campaign Name", value: "Instagram promotion for summer balayage special", fullWidth: true },
    { label: "Objective", value: "Lead Generation" },
    { label: "Visual Style", value: "Elegant & Luxury" },
    { label: "Target Audience", value: "25-35 year old women interested in hair styling", fullWidth: true },
    { label: "Tone", value: "Friendly" },
    { label: "Color Scheme", value: "Warm Tones" },
    { label: "Platform", value: "TikTok", fullWidth: true },
    { label: "Duration", value: "30 sec" },
    { label: "Format", value: "Vertical (9:16)" },
  ];

  return (
    <div className="flex flex-col gap-[24px] animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-1">
        <h3 className="text-[18px] font-bold text-[#121212]">Review Your Campaign</h3>
        <p className="text-[14px] font-regular text-[#6B7280]">Check all the details before generating</p>
      </div>
      
      <div className="bg-white p-[20px] rounded-[16px] border-[0.35px] border-[#0000001A] flex flex-col gap-[12px]">
        <div className="grid grid-cols-2 gap-x-[16px] gap-y-[8px]">
          {summaryData.map((item, idx) => (
            <div key={idx} className={`flex flex-col gap-[8px] ${item.fullWidth ? "col-span-2" : "col-span-1"}`}>
              <label className="text-[14px] font-bold text-[#121212]">{item.label} *</label>
              <div className="px-[16px] py-[10px] bg-[#F8F8F8] rounded-[8px] text-[15px] text-[#121212] font-medium min-h-[40px] flex items-center">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
