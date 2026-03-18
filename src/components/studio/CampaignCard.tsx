"use client";

import Image from "next/image";
import { Icons } from "@/components/ui/icons";

interface CampaignCardProps {
  title: string;
  status: string;
  image: string;
}

export default function CampaignCard({ title, status, image }: CampaignCardProps) {
  const isReady = status === "Ready";

  return (
    <div className="flex flex-col bg-[#F8F8F8] rounded-[12px] p-[8px] overflow-hidden  border-[0.35px] border-[#0000001A] shadow-sm group hover:shadow-md transition-all">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-[8px] py-[4px] rounded-[4px] text-[11px] font-bold uppercase tracking-wider ${
            isReady ? "bg-[linear-gradient(90deg,#01012A_0%,#2E2C66_100%)] text-white shadow-lg shadow-[#01012A]/10" : "bg-[linear-gradient(135deg,#AD46FF_0%,#2B7FFF_100%)] text-white"
          }`}>
            {status}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-[4px] pt-[12px] pb-[4px]">
        <h3 className="text-[16px] font-semibold text-[#121212]">{title}</h3>
        <div className="flex items-center gap-[4px]">
          <button className="flex-1 h-[36px] bg-white border border-[#F1F5F9] rounded-[5px] text-[12px] font-medium text-[#121212] hover:bg-[#F8FAFC] transition-colors">
            Preview
          </button>
          <button className="w-[36px] h-[36px] bg-white flex items-center justify-center border border-[#F1F5F9] rounded-[5px] text-[#121212] hover:text-[#02022C] transition-colors">
            <Icons.Download className="w-4 h-4" />
          </button>
          <button className="w-[36px] h-[36px] bg-white flex items-center justify-center border border-[#F1F5F9] rounded-[5px] text-[#121212] hover:text-red-500 transition-colors">
            <Icons.Trash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
