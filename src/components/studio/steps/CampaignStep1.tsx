"use client";

import React from "react";

export default function CampaignStep1() {
  return (
    <div className="flex flex-col gap-[24px] animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-1">
        <h3 className="text-[18px] font-bold text-[#121212]">Campaign Details</h3>
        <p className="text-[14px] text-[#6B7280] font-regular">Let's start with the basics of your campaign</p>
      </div>
      
      <div className="flex flex-col gap-[8px]">
        {/* Campaign Name Card */}
        <div className="bg-white p-[16px] rounded-[16px] border-[0.35px] border-[#0000001A] flex flex-col gap-[12px]">
          <label className="text-[13px] font-bold text-[#121212]">Campaign Name *</label>
          <input 
            type="text" 
            placeholder="Instagram promotion for summer balayage special"
            className="w-full px-5 py-3.5 bg-white border border-[#F1F5F9] rounded-[8px] text-[14px] text-[#121212] outline-none focus:border-[#02022C] placeholder:text-[#94A3B8]"
          />
        </div>
        
        {/* Campaign Objective Card */}
        <div className="bg-white p-[16px] rounded-[16px] border-[0.35px] border-[#0000001A] flex flex-col gap-[12px]">
          <label className="text-[14px] font-bold text-[#000000]">Campaign Objective *</label>
          <div className="flex flex-wrap gap-[10px]">
            {["Brand Awareness", "Lead Generation", "Engagement", "Sales Conversion"].map((obj) => (
              <button key={obj} className={`px-[8px] py-[16px] h-[36px] w-[155px] flex items-center justify-center rounded-[8px] border text-[13px] font-medium transition-all ${
                obj === "Brand Awareness" 
                  ? "bg-white border-[#02022C] text-[#02022C]" 
                  : "bg-white text-[#94A3B8] border-[#F1F5F9] hover:border-[#E2E8F0]"
              }`}>
                {obj}
              </button>
            ))}
          </div>
        </div>

        {/* Target Audience Card */}
        <div className="bg-white p-[16px] rounded-[16px] border-[0.35px] border-[#0000001A] flex flex-col gap-3">
          <label className="text-[14px] font-bold text-[#000000]">Target Audience *</label>
          <textarea 
            placeholder="Describe your target audience (e.g., Women aged 25-45 interested in premium hair care)"
            className="w-full p-[16px] bg-white border border-[#F1F5F9] rounded-[8px] text-[15px] text-[#121212] outline-none focus:border-[#02022C] h-[160px] resize-none placeholder:text-[#94A3B8]"
          />
        </div>
      </div>
    </div>
  );
}
