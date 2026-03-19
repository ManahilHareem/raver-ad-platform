"use client";

import React from "react";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  title: string;
  imagePath: string;
  time?: string;
  members?: number;
  onClick?: () => void;
  className?: string;
  aspectRatio?: "portrait" | "landscape" | "square" | "custom";
  height?: string;
}

export default function TemplateCard({ 
  title, 
  imagePath, 
  time, 
  members, 
  onClick, 
  className, 
  aspectRatio = "portrait",
  height
}: TemplateCardProps) {
  const aspectClasses = {
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    square: "aspect-square",
    custom: "",
  };

  return (
    <div 
      onClick={onClick}
      style={height ? { height } : undefined}
      className={cn(
        "group relative rounded-[16px] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl",
        aspectRatio !== "custom" && aspectClasses[aspectRatio],
        className
      )}
    >
      <Image 
        src={imagePath} 
        alt={title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "https://placehold.co/600x800?text=Template";
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end py-[6px] px-[12px]  ">
        <div className="flex flex-col gap-3 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <div className="flex flex-col gap-1.5 px-1">
            <h3 className="text-white text-[16px] font-bold leading-tight drop-shadow-sm">{title}</h3>
            
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1.5">
                <Icons.Clock className="w-4 h-4" />
                <span className="text-[12px] font-regular">{time || "2 hours ago"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icons.User className="w-4 h-4" />
                <span className="text-[12px] font-regular">{members || 3}</span>
              </div>
            </div>
          </div>

          <button className="w-full h-[32px] bg-white text-[#121212] rounded-[5px] text-[12px] font-medium hover:bg-white/90 border-[0.35px] border-[#0000001A]   transition-colors shadow-lg">
            View Template
          </button>
        </div>
      </div>
    </div>
  );
}
