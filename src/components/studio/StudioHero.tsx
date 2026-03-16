"use client";

import Image from "next/image";
import { Icons } from "@/components/ui/icons";

interface StudioHeroProps {
  onCreateClick: () => void;
}

const quickPrompts = [
  "Instagram promotion for summer balayage special",
  "Salon discount campaign 20% off new clients",
  "Before/after showcase reel for social media",
  "Holiday campaign for Christmas hair makeovers",
];

export default function StudioHero({ onCreateClick }: StudioHeroProps) {
  return (
    <div className="bg-white rounded-3xl p-8 overflow-hidden min-h-[340px] border border-[#F1F5F9] shadow-sm relative flex flex-col gap-[16px]">
      <div className="flex  justify-between gap-8 h-[235px]">
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
      <div className="relative group">
        <div className="relative group">
          <textarea
            placeholder="Create a summer balayage instagram promotion"
            className="w-full h-[120px] bg-white rounded-2xl p-5 text-[15px] text-[#121212] placeholder:text-[#94A3B8] border border-[#02022C] transition-all resize-none outline-none"
          />
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

        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-semibold text-[#64748B]">Quick Prompts:</span>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-[11px] font-medium text-[#475569] hover:border-[#02022C] hover:text-[#02022C] transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
