"use client";

import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface CampaignCardProps {
  id?: string;
  title: string;
  status: string;
  image: string;
  videoUrl?: string | null;
  message?: string;
  onDelete?: () => void;
}

export default function CampaignCard({ id, title, status, image, videoUrl, message, onDelete }: CampaignCardProps) {
  const isReady = status === "Ready" || status === "completed";
  const isInProduction = status === "in_production" || status === "queued" || status === "In Production";

  return (
    <div className="flex flex-col bg-[#F8F8F8] rounded-[12px] p-[8px] overflow-hidden  border-[0.35px] border-[#0000001A] shadow-sm group hover:shadow-md transition-all">
      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-slate-100">
        {videoUrl ? (
          <video 
            src={videoUrl} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <Image 
            src={image} 
            alt={title} 
            fill 
            className={cn(
              "object-cover transition-transform duration-500",
              isInProduction ? "scale-105 blur-sm" : "group-hover:scale-105"
            )}
          />
        )}

        {isInProduction && (
          <div className="absolute inset-0 bg-[#02022C]/40 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-10 transition-all">
            <Icons.Loader className="w-6 h-6 text-white animate-spin mb-2" />
            <p className="text-white text-xs font-bold uppercase tracking-wider">
              {status === "queued" ? "Queued" : "Pipeline Running"}
            </p>
            {message && (
              <p className="text-white/90 text-[10px] mt-1 font-medium max-w-[90%] line-clamp-2">
                {message}
              </p>
            )}
          </div>
        )}

        <div className="absolute top-3 right-3 z-20">
          <span className={cn(
            "px-[8px] py-[4px] rounded-[4px] text-[11px] font-bold uppercase tracking-wider shadow-sm",
            isReady ? "bg-[linear-gradient(90deg,#01012A_0%,#2E2C66_100%)] text-white shadow-lg shadow-[#01012A]/10" 
            : isInProduction ? "bg-white text-[#02022C] animate-pulse" 
            : "bg-[linear-gradient(135deg,#AD46FF_0%,#2B7FFF_100%)] text-white"
          )}>
            {status.replace("_", " ")}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-[4px] pt-[12px] pb-[4px]">
        <h3 className="text-[16px] font-semibold text-[#121212]">{title}</h3>
        <div className="flex items-center gap-[4px]">
          <button 
            disabled={isInProduction}
            className="flex-1 h-[36px] bg-white border border-[#F1F5F9] rounded-[5px] text-[12px] font-medium text-[#121212] hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Preview
          </button>
          <button 
            disabled={isInProduction}
            className="w-[36px] h-[36px] bg-white flex items-center justify-center border border-[#F1F5F9] rounded-[5px] text-[#121212] hover:text-[#02022C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icons.Download className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="w-[36px] h-[36px] bg-white flex items-center justify-center border border-[#F1F5F9] rounded-[5px] text-[#121212] hover:text-red-500 transition-colors"
          >
            <Icons.Trash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
