"use client";

import React from "react";

interface SummaryItem {
  label: string;
  value: string;
  fullWidth?: boolean;
}

interface CampaignStep4Props {
  data: any;
}

export default function CampaignStep4({ data }: CampaignStep4Props) {
  const summaryData: SummaryItem[] = [
    { label: "Campaign Name", value: data.name || "N/A", fullWidth: true },
    { label: "Objective", value: data.objective },
    { label: "Visual Style", value: data.visualStyles?.join(", ") || "N/A", fullWidth: true },
    { label: "Target Audience", value: data.audience || "N/A", fullWidth: true },
    { label: "Tone", value: data.tones?.join(", ") || "N/A", fullWidth: true },
    { label: "Color Scheme", value: data.colorScheme || "N/A" },
    { label: "Platform", value: data.platforms?.join(", ") || "N/A", fullWidth: true },
    { label: "Duration", value: data.duration },
    { label: "Format", value: data.format },
  ];

  return (
    <div className="flex flex-col gap-[24px] animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-1">
        <h3 className="text-h3 text-text-primary">Review Your Campaign</h3>
        <p className="text-body text-text-secondary">Check all the details before generating</p>
      </div>

      <div className="bg-white p-[20px] rounded-[16px] border-[0.35px] border-[#0000001A] flex flex-col gap-[12px]">
        <div className="grid grid-cols-2 gap-x-[16px] gap-y-[8px]">
          {summaryData.map((item, idx) => (
            <div key={idx} className={`flex flex-col gap-[8px] ${item.fullWidth ? "col-span-2" : "col-span-1"}`}>
              <label className="text-label text-text-primary">{item.label} *</label>
              <div className="px-[16px] py-[10px] bg-[#F8F8F8] rounded-[8px] text-body text-text-primary font-medium min-h-[40px] flex items-center">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
