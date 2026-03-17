"use client";

import React, { useState } from "react";
import { Icons } from "@/components/ui/icons";

export default function CampaignStep3() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Instagram"]);
  const [selectedDuration, setSelectedDuration] = useState<string>("15 sec");
  const [selectedFormat, setSelectedFormat] = useState<string>("Square (1:1)");

  const platforms = [
    { label: "Instagram", icon: Icons.Instagram },
    { label: "Facebook", icon: Icons.Facebook },
    { label: "Tiktok", icon: Icons.Video },
    { label: "YouTube", icon: Icons.Youtube },
  ];

  const durations = ["15 sec", "30 sec", "60 sec", "90 sec"];

  const formats = [
    { 
      label: "Square (1:1)", 
      desc: "Perfect for Instagram feed",
      dimensions: "1:1"
    },
    { 
      label: "Vertical (9:16)", 
      desc: "Instagram Stories, Tiktok",
      dimensions: "9:16"
    },
    { 
      label: "Landscape (16:9)", 
      desc: "YouTube, Facebook",
      dimensions: "16:9"
    },
    { 
      label: "Portrait (9:16)", 
      desc: "Instagram feed optimized",
      dimensions: "9:16"
    },
  ];

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  return (
    <div className="flex flex-col gap-[24px] animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-1">
        <h3 className="text-[18px] font-bold text-[#121212]">Platform & Format</h3>
        <p className="text-[14px] font-regular text-[#6B7280]">Where will your campaign be published?</p>
      </div>
      
      <div className="flex flex-col gap-[16px]">
        {/* Social Media Platform */}
        <div className="flex flex-col gap-[12px] bg-[#FFFFFF] p-[16px] rounded-[16px] border-[0.35px] border-[#0000001A]">
          <label className="text-[14px] font-bold text-[#000000]">Social Media Platform *</label>
          <div className="flex flex-wrap gap-[12px]">
            {platforms.map((p) => {
              const isSelected = selectedPlatforms.includes(p.label);
              return (
                <button 
                  key={p.label} 
                  onClick={() => togglePlatform(p.label)}
                   className={`px-[16px] py-[8px] rounded-xl text-[16px] font-regular items-center justify-center transition-all flex flex-row gap-[10px] ${
                    isSelected ? "text-[#02022C]" : "bg-white border text-[#475569] border-[#E2E8F0] hover:border-[#02022C] "
                  }`}
                  style={isSelected ? {
                    border: '1px solid transparent',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #01012A 0%, #2E2C66 100%) border-box'
                  } : {}}
                >
                  <p.icon className={`w-4 h-4 ${isSelected ? "text-[#02022C]" : "text-[#94A3B8]"}`} />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Video Duration */}
        <div className="flex flex-col gap-4 bg-[#FFFFFF] p-[16px] rounded-[16px] border-[0.35px] border-[#0000001A]">
          <label className="text-[14px] font-bold text-[#000000]">Video Duration *</label>
          <div className="flex flex-wrap gap-[12px]">
            {durations.map((d) => {
              const isSelected = selectedDuration === d;
              return (
                <button 
                  key={d} 
                  onClick={() => setSelectedDuration(d)}
                  className={`px-[16px] py-[8px] rounded-xl text-[16px] font-regular items-center justify-center transition-all flex flex-row gap-[10px] ${
                    isSelected ? "text-[#02022C]" : "bg-white border text-[#475569] border-[#E2E8F0] hover:border-[#02022C] "
                  }`}
                  style={isSelected ? {
                    border: '1px solid transparent',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #01012A 0%, #2E2C66 100%) border-box'
                  } : {}}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Video Format */}
        <div className="flex flex-col gap-4 bg-[#FFFFFF] p-[16px] rounded-[16px] border-[0.35px] border-[#0000001A]">
          <label className="text-[14px] font-bold text-[#000000]">Video Format *</label>
          <div className="grid grid-cols-2 gap-[12px]">
            {formats.map((f) => {
              const isSelected = selectedFormat === f.label;
              return (
                <button 
                  key={f.label} 
                  onClick={() => setSelectedFormat(f.label)}
                  className={`px-[16px] py-[8px] rounded-xl text-[16px] font-regular items-start transition-all flex flex-col gap-[5px] ${
                    isSelected ? "text-[#02022C]" : "bg-white border text-[#475569] border-[#E2E8F0] hover:border-[#02022C] "
                  }`}
                  style={isSelected ? {
                    border: '1px solid transparent',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #01012A 0%, #2E2C66 100%) border-box'
                  } : {}}
                >
                  <span className={`text-[13px] font-bold mb-1 ${isSelected ? "text-[#02022C]" : "text-[#121212]"}`}>{f.label}</span>
                  <span className="text-[11px] font-medium text-[#94A3B8] leading-tight">{f.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
