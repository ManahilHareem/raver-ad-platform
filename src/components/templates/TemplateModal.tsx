"use client";

import React from "react";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface TemplateModalProps {
  template: {
    title: string;
    imagePath: string;
    description?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplateModal({ template, isOpen, onClose }: TemplateModalProps) {
  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-y-0 right-0 left-0 lg:left-[280px] z-50 flex items-end justify-end bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[541px] max-h-[98vh] rounded-[16px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col p-[12px] relative border-b border-[#0000001A]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-[12px] right-[12px] z-20 w-[40px] h-[40px] p-[8px] bg-white rounded-tr-[10px] rounded-bl-[10px] shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          <Icons.Plus className="w-5 h-5 rotate-45 text-[#64748B]" />
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-[12px]">
          {/* Image Section */}
          <div className="relative w-full h-[252px] bg-[#F8F8F8] rounded-[16px] overflow-hidden shrink-0">
            <Image 
              src={template.imagePath} 
              alt={template.title}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/600x400?text=Template";
              }}
            />
          </div>

          {/* Content Section */}
          <div className="flex flex-col gap-[12px]">
            <div className="flex flex-col gap-[2px]">
              <h2 className="text-[24px] font-bold text-[#121212] leading-[100%]">{template.title}</h2>
              <p className="text-[14px] font-medium text-[#4F4F4F] leading-[21px]">
                {template.description || "Dynamic video template for cosmetics product launches"}
              </p>
            </div>

            {/* Gray Info Box */}
            <div className="bg-[#F8F8F8] p-[12px] rounded-[8px] flex flex-col">
              {/* Included Assets */}
              <div className="flex flex-col gap-[12px] pb-[12px]">
                <h4 className="text-[16px] font-bold text-[#121212] leading-[24px]">Included Assets</h4>
                <div className="flex flex-col gap-[12px]">
                  {[
                    "5 customizable designs",
                    "Brand color customization",
                    "AI-powered content generation",
                    "Multiple export formats"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-[12px] text-[14px] text-[#4F4F4F] font-regular">
                      <Icons.Success className="w-4 h-4 text-[#22C55E]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Formats */}
              <div className="flex flex-col gap-[12px]">
                <h4 className="text-[14px] font-bold text-[#121212]">Available Formats</h4>
                <div className="flex flex-col gap-[10px]">
                  {[
                    { label: "9:16 Story", icon: Icons.Video },
                    { label: "1: post", icon: Icons.Image },
                    { label: "16:9 Cover", icon: Icons.Video }
                  ].map((format, i) => (
                    <div key={i} className="flex items-center gap-[12px] text-[14px] text-[#4F4F4F] font-medium">
                      <div className="p-2 bg-white rounded-lg border border-[#0000000D]">
                        <format.icon className="w-4 h-4 text-[#64748B]" />
                      </div>
                      {format.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Optimized For */}
            <div className="flex flex-col gap-[12px]">
              <h4 className="text-[14px] font-bold text-[#121212]">Optimized For</h4>
              <div className="flex flex-wrap gap-[10px]">
                {["Instagram", "TikTok", "YouTube"].map((platform) => (
                  <span key={platform} className="px-[16px] py-[6px] bg-[#F8F8F8] rounded-full text-[#4F4F4F] font-medium uppercase text-[11px] tracking-wider border border-[#0000000D]">
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            {/* Status Section */}
            <div className="flex gap-[12px] h-[74px]">
              <div className="flex-1 bg-[#F8F8F8] p-[16px] rounded-[12px] flex flex-col gap-[4px] border border-[#0000000D]">
                <span className="text-[12px] font-medium text-[#64748B]">Status</span>
                <span className="text-[16px] font-bold text-[#121212]">Active</span>
              </div>
              <div className="flex-1 bg-[#F8F8F8] p-[16px] rounded-[12px] flex flex-col gap-[4px] border border-[#0000000D]">
                <span className="text-[12px] font-medium text-[#64748B]">Tasks Completed</span>
                <span className="text-[16px] font-bold text-[#121212]">342</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-[12px] pt-[8px] mt-auto">
              <button 
                onClick={onClose}
                className="flex-1 h-[48px] bg-[#F8F8F8] text-[#121212] rounded-[12px] text-[16px] font-bold hover:bg-gray-100 transition-all flex items-center justify-center border border-[#0000000D]"
              >
                Back
              </button>
              <button className="flex-[2.5] h-[48px] bg-[linear-gradient(90deg,#01012A_0%,#2E2C66_100%)] text-white rounded-[12px] text-[16px] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-[10px] shadow-[inset_0px_-5px_5px_0px_#4F569B]">
                <Icons.whiteMagicWand className="w-5 h-5 text-white" /> Use This Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
