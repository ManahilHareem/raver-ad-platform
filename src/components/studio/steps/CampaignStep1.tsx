"use client";

import React from "react";

interface CampaignStep1Props {
  data: any;
  updateData: (fields: any) => void;
  errors: Record<string, string>;
}

export default function CampaignStep1({ data, updateData, errors }: CampaignStep1Props) {
  return (
    <div className="flex flex-col gap-[24px] animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-1">
        <h3 className="text-[18px] font-bold text-[#121212]">Campaign Details</h3>
        <p className="text-[14px] text-[#6B7280] font-normal">Let's start with the basics of your campaign</p>
      </div>

      <div className="flex flex-col gap-[8px]">
        {/* Campaign Name Card */}
        <div className="bg-white p-[16px] rounded-[16px] border-[0.35px] border-[#0000001A] flex flex-col gap-[12px]">
          <label className="text-[14px] font-bold text-[#121212]">Campaign Name *</label>
          <input
            type="text"
            placeholder="Instagram promotion for summer balayage special"
            value={data.name}
            maxLength={50}
            onChange={(e) => updateData({ name: e.target.value })}
            className={`w-full px-5 py-3.5 bg-white border ${errors.name ? 'border-red-500' : 'border-[#F1F5F9]'} rounded-[8px] text-[14px] text-[#121212] outline-none focus:border-[#02022C] placeholder:text-[#94A3B8] transition-colors`}
          />
          {errors.name && <p className="text-red-500 text-[12px] font-medium">{errors.name}</p>}
        </div>

        {/* Campaign Objective Card */}
        <div className="bg-white p-[16px] rounded-[16px] border-[0.35px] border-[#0000001A] flex flex-col gap-[12px]">
          <label className="text-[14px] font-bold text-[#121212]">Campaign Objective *</label>
          <div className="flex flex-wrap gap-[10px]">
            {["Brand Awareness", "Lead Generation", "Engagement", "Sales Conversion"].map((obj) => (
              <button
                key={obj}
                onClick={() => updateData({ objective: obj })}
                className={`px-[8px] py-[16px] h-[36px] w-[155px] flex items-center justify-center rounded-[8px] border text-[13px] font-medium transition-all ${data.objective === obj
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
          <label className="text-[14px] font-bold text-[#121212]">Target Audience *</label>
          <textarea
            placeholder="Describe your target audience (e.g., Women aged 25-45 interested in premium hair care)"
            value={data.audience}
            maxLength={500}
            onChange={(e) => updateData({ audience: e.target.value })}
            className={`w-full p-[16px] bg-white border ${errors.audience ? 'border-red-500' : 'border-[#F1F5F9]'} rounded-[8px] text-[15px] text-[#121212] outline-none focus:border-[#02022C] h-[160px] resize-none placeholder:text-[#94A3B8] transition-colors`}
          />
          {errors.audience && <p className="text-red-500 text-[12px] font-medium">{errors.audience}</p>}
        </div>
      </div>
    </div>
  );
}
