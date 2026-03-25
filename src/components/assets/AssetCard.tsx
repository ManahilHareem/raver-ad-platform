"use client";

import React from "react";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface AssetCardProps {
  title: string;
  imagePath: string;
  time?: string;
  members?: number;
  type?: "image" | "video" | "audio" | "graphic";
  onClick?: () => void;
  className?: string;
  aspectRatio?: "portrait" | "landscape" | "square";
  hasVolume?: boolean;
  isSelectable?: boolean;
  isSelected?: boolean;
}

export default function AssetCard({ 
  title, 
  imagePath, 
  time = "2 hours ago", 
  members = 3, 
  type = "image",
  onClick, 
  className, 
  aspectRatio = "portrait",
  hasVolume = false,
  isSelectable = false,
  isSelected = false
}: AssetCardProps) {
  const aspectClasses = {
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    square: "aspect-square",
  };

  const isVideo = type === "video" || 
    imagePath?.toLowerCase().split('?')[0].endsWith(".mp4") || 
    imagePath?.toLowerCase().split('?')[0].endsWith(".webm") || 
    imagePath?.toLowerCase().split('?')[0].endsWith(".mov");

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative rounded-[16px] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl bg-[#F8F8F8]",
        aspectClasses[aspectRatio],
        isSelected && "border-2 border-dashed",
        className
      )}
    >
      {type === "audio" ? (
         <div className="absolute inset-0 flex items-center justify-center p-8 bg-[#F8FAFC]">
            <div className="w-full h-full relative flex items-center justify-center opacity-80 group-hover:scale-105 transition-transform duration-500">
               <div className="w-[120px] h-[120px] bg-white rounded-[24px] shadow-sm flex items-center justify-center">
                  <Icons.AudioWave className="w-16 h-16 text-[#02022C]" />
               </div>
            </div>
         </div>
      ) : isVideo ? (
        <video 
          src={imagePath} 
          muted 
          playsInline
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
          onMouseOut={(e) => {
            const video = e.target as HTMLVideoElement;
            video.pause();
            video.currentTime = 0;
          }}
        />
      ) : (
        <Image 
          src={imagePath} 
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://placehold.co/600x800?text=Asset";
          }}
        />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end py-[12px] px-[12px]">
        <div className="flex flex-col gap-3 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <div className="flex flex-col gap-1.5 px-1">
            <h3 className="text-white text-[16px] font-bold leading-tight drop-shadow-sm truncate">{title}</h3>
            
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1.5">
                <Icons.Clock className="w-4 h-4" />
                <span className="text-[12px] font-regular">{time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icons.User className="w-4 h-4" />
                <span className="text-[12px] font-regular">{members}</span>
              </div>
            </div>
          </div>

          <button className="w-full h-[32px] bg-white text-[#121212] rounded-[5px] text-[12px] font-medium hover:bg-white/90 border-[0.35px] border-[#0000001A] transition-colors shadow-lg">
            Preview
          </button>
        </div>
      </div>

      {/* Bottom Icons (Visual badge in design) */}
      <div className="absolute bottom-[12px] left-[12px] flex items-center gap-2 z-10 transition-opacity duration-300 group-hover:opacity-0">
        <div className="bg-[#121212]/50 backdrop-blur-md w-[32px] h-[32px] flex items-center justify-center rounded-[8px] shadow-sm">
          <Icons.Square className={cn("w-4 h-4 text-white", isSelected && "fill-white")} />
        </div>
        {hasVolume && (
          <div className="bg-[#121212]/50 backdrop-blur-md w-[32px] h-[32px] flex items-center justify-center rounded-[8px] shadow-sm">
            <Icons.Mute className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
