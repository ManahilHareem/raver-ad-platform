"use client";

import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import { useState } from "react";
import CampaignSelectionModal from "./CampaignSelectionModal";

interface Campaign {
  title: string;
  status: string;
  image: string;
}

interface StudioHeroProps {
  onCreateClick: () => void;
  campaigns?: Campaign[];
  onCampaignSelect?: (campaign: Campaign | null) => void;
  selectedCampaign?: Campaign | null;
}

const quickPrompts = [
  "Instagram promotion for summer balayage special",
  "Salon discount campaign 20% off new clients",
  "Before/after showcase reel for social media",
  "Holiday campaign for Christmas hair makeovers",
];

export default function StudioHero({ 
  onCreateClick, 
  campaigns = [], 
  onCampaignSelect,
  selectedCampaign 
}: StudioHeroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handlePromptSelect = (text: string) => {
    setPrompt(text);
  };

  return (
    <div className="bg-white rounded-3xl p-8 overflow-hidden min-h-[340px] border border-[#F1F5F9] shadow-sm relative flex flex-col gap-[16px]">
      <div className="flex justify-between gap-8 h-[235px]">
        {/* Left Content Stack */}
        <div className="flex flex-col gap-6 max-w-[379px] flex-1">
          <div className="flex flex-col gap-2">
            <h1 className="text-[30px] font-bold text-[#4F4F4F] leading-tight">
              Hi, Hareem <span className="text-[#121212]">Ready To Achieve Great Things?</span>
            </h1>
          </div>
        </div>
        <div className="relative w-[296px] h-[242px] hidden lg:block shrink-0">
          <Image
            src="/assets/093ec72b55a47816f743d0aef409d7eba6458444.png"
            alt="AI Character"
            fill
            className="object-contain object-bottom"
          />
        </div>
      </div>
      <div className="relative group flex flex-col gap-5">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={selectedCampaign ? `Prompt for: ${selectedCampaign.title}` : "Create a summer balayage instagram promotion"}
            className="w-full h-[120px] bg-white rounded-2xl p-5 text-[15px] text-[#121212] placeholder:text-[#94A3B8] border border-[#02022C] transition-all resize-none outline-none"
          />
          {selectedCampaign && (
            <div className="absolute top-2 right-4 flex items-center gap-2 px-3 py-1 bg-[#F1F5F9] rounded-full">
              <span className="text-[11px] font-bold text-[#02022C] uppercase forced-colors:">Active: {selectedCampaign.title}</span>
              <button 
                onClick={() => onCampaignSelect?.(null)}
                className="hover:text-red-500 transition-colors"
              >
                <Icons.Plus className="w-3 h-3 rotate-45" />
              </button>
            </div>
          )}
          <div className="absolute left-4 bottom-4">
            <button className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#94A3B8] hover:text-[#121212] transition-colors">
              <Icons.Mic className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute right-4 bottom-4">
            <button className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#94A3B8] hover:text-[#121212] transition-colors">
              <Icons.Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Quick Campaign Select */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#64748B]">Reference Campaign:</span>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-[12px] font-bold text-[#02022C] hover:underline flex items-center gap-1"
              >
                View More <Icons.ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onCreateClick}
                className="px-3 py-1.5 bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-lg text-[11px] font-bold text-[#64748B] hover:border-[#02022C] hover:text-[#02022C] transition-all flex items-center gap-1.5"
              >
                <Icons.Plus className="w-3 h-3" />
                Create New
              </button>
              {campaigns.slice(0, 4).map((campaign, i) => (
                <button
                  key={i}
                  onClick={() => onCampaignSelect?.(campaign)}
                  className={`px-3 py-1.5 border rounded-lg text-[11px] font-medium transition-all ${
                    selectedCampaign?.title === campaign.title 
                      ? "bg-[#02022C] border-[#02022C] text-white" 
                      : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#02022C] hover:text-[#02022C]"
                  }`}
                >
                  {campaign.title}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-col gap-3">
            <span className="text-[13px] font-semibold text-[#64748B]">Quick Ideas:</span>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.slice(0, 3).map((idea, i) => (
                <button
                  key={i}
                  onClick={() => handlePromptSelect(idea)}
                  className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[11px] font-medium text-[#475569] hover:border-[#02022C] hover:text-[#02022C] transition-all"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CampaignSelectionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        campaigns={campaigns}
        onSelect={(c) => onCampaignSelect?.(c)}
        onCreateNew={onCreateClick}
      />
    </div>
  );
}
