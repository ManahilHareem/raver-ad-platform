"use client";

import React, { useState } from "react";

export default function CampaignStep2() {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [selectedColorScheme, setSelectedColorScheme] = useState<string | null>(null);

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const toggleTone = (tone: string) => {
    setSelectedTones(prev => 
      prev.includes(tone) ? prev.filter(t => t !== tone) : [...prev, tone]
    );
  };

  const toggleColorScheme = (scheme: string) => {
    setSelectedColorScheme(prev => prev === scheme ? null : scheme);
  };

  const colorSchemes = [
    { label: "Warm Tones", colors: ["#F97066", "#FBAD37", "#F79009"] },
    { label: "Cool Tones", colors: ["#53B1FD", "#7F56D9", "#2E90FA"] },
    { label: "Neutral", colors: ["#344054", "#667085", "#D0D5DD"] },
    { label: "Pastel", colors: ["#FEE4E2", "#D1E9FF", "#D1FADF"] },
    { label: "Earth Tones", colors: ["#7A5E43", "#A67C52", "#D4A373"] },
    { label: "Monochrome", colors: ["#000000", "#4B4B4B", "#9E9E9E"] },
  ];

  return (
    <div className="flex flex-col gap-[24px] animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-1">
        <h3 className="text-[18px] font-bold text-[#121212]">Campaign Details</h3>
        <p className="text-[14px] text-[#6B7280] font-regular">Define the look and feel of your campaign</p>
      </div>

      <div className="flex flex-col gap-[8px]">
        {/* Visual Style */}
        <div className="flex flex-col gap-[12px] bg-[#FFFFFF] p-[16px] rounded-[16px]">
          <label className="text-[14px] font-bold text-[#000000]">Visual Style *</label>
          <div className="flex flex-wrap gap-[12px]">
            {["Modern & Clean", "Elegant & Luxury", "Vibrant & Bold", "Minimalist", "Natural & Organic", "Dramatic"].map((s) => {
              const isSelected = selectedStyles.includes(s);
              return (
                <button 
                  key={s} 
                  onClick={() => toggleStyle(s)}
                  className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all ${
                    isSelected ? "text-[#02022C]" : "bg-white border text-[#475569] border-[#E2E8F0] hover:border-[#02022C]"
                  }`}
                  style={isSelected ? {
                    border: '1px solid transparent',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #01012A 0%, #2E2C66 100%) border-box'
                  } : {}}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone & Voice */}
        <div className="flex flex-col gap-[12px] bg-[#FFFFFF] p-[16px] rounded-[16px]">
          <label className="text-[14px] font-bold text-[#000000]">Tone & Voice *</label>
          <div className="flex flex-wrap gap-[12px]">
            {["Professional", "Friendly", "Inspiring", "Playful", "Sophisticated", "Educational"].map((t) => {
              const isSelected = selectedTones.includes(t);
              return (
                <button 
                  key={t} 
                  onClick={() => toggleTone(t)}
                  className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all ${
                    isSelected ? "text-[#02022C]" : "bg-white border text-[#475569] border-[#E2E8F0] hover:border-[#02022C]"
                  }`}
                  style={isSelected ? {
                    border: '1px solid transparent',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #01012A 0%, #2E2C66 100%) border-box'
                  } : {}}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Scheme */}
        <div className="flex flex-col gap-[12px] bg-[#FFFFFF] p-[16px] rounded-[16px]">
          <label className="text-[14px] font-bold text-[#000000]">Color Scheme *</label>
          <div className="flex flex-wrap gap-[12px]">
            {colorSchemes.map((scheme) => {
              const isSelected = selectedColorScheme === scheme.label;
              return (
                <button 
                  key={scheme.label} 
                  onClick={() => toggleColorScheme(scheme.label)}
                  className={`flex flex-wrap items-center justify-center px-[16px] py-[8px] w-[122px] h-[56px] rounded-[12px] transition-all bg-white border ${
                    isSelected ? "border-transparent" : "border-[#E2E8F0] hover:border-[#02022C]"
                  }`}
                  style={isSelected ? {
                    border: '1px solid transparent',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #01012A 0%, #2E2C66 100%) border-box'
                  } : {}}
                >
                  <div className="flex gap-1.5 mb-2">
                    {scheme.colors.map((color, i) => (
                      <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  <span className={`text-[13px] font-medium ${isSelected ? "text-[#02022C]" : "text-[#64748B]"}`}>
                    {scheme.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
