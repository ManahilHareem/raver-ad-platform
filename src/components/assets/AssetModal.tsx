"use client";

import React from "react";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface Asset {
  id: string | number;
  title?: string;
  name?: string;
  url?: string;
  imagePath?: string;
  time?: string;
  createdAt?: string;
  members?: number;
  type: string;
  aspectRatio?: string;
  hasVolume?: boolean;
  size?: number;
  width?: number;
  height?: number;
}

interface AssetModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AssetModal({ asset, isOpen, onClose }: AssetModalProps) {
  if (!isOpen || !asset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[541px] rounded-[24px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col p-[12px] gap-[12px] relative">
        
        {/* Top Image Section */}
        <div className="relative w-[517px] h-[252px] bg-[#F8F8F8] rounded-[16px] overflow-hidden flex items-center justify-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Icons.Plus className="w-5 h-5 rotate-45 text-[#64748B]" />
          </button>
          
          {asset.type === "audio" ? (
             <div className="flex flex-col items-center gap-4">
                <div className="w-[120px] h-[120px] bg-white rounded-[24px] shadow-sm flex items-center justify-center">
                    <Icons.AudioWave className="w-16 h-16 text-[#02022C]" />
                </div>
             </div>
          ) : (
            <Image 
              src={asset.url || asset.imagePath || ""} 
              alt={asset.name || asset.title || "Asset"}
              fill
              className="object-contain p-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/800x600?text=Asset";
              }}
            />
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-4 p-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-[24px] font-bold text-[#121212] leading-tight">{asset.name || asset.title}</h2>
            <div className="flex items-center gap-2 text-[14px] font-medium text-[#4F4F4F]">
              <span>{asset.width || 1920}x{asset.height || 1080}</span>
              <span>•</span>
              <span>{asset.size ? (asset.size / (1024 * 1024)).toFixed(1) + " MB" : "Unknown Size"}</span>
              <span>•</span>
              <span>Uploaded {asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : asset.time}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 h-[74px]">
            <div className="bg-[#F8F8F8] p-4 rounded-[12px] flex flex-col gap-1">
              <span className="text-[12px] text-[#4F4F4F] font-regular uppercase tracking-wider">Type</span>
              <span className="text-[18px] font-bold text-[#121212] capitalize">{asset.type}</span>
            </div>
            <div className="bg-[#F8F8F8] p-4 rounded-[12px] flex flex-col gap-1">
              <span className="text-[12px] text-[#4F4F4F] font-regular uppercase tracking-wider">Used In</span>
              <span className="text-[18px] font-bold text-[#121212]">{asset.members} Projects</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button className="flex-1 h-[48px] bg-white text-[#121212] rounded-[12px] border border-[#E2E8F0] text-[16px] font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              <Icons.Download className="w-5 h-5" /> Download
            </button>
            <button className="flex-[1.5] h-[48px] bg-[linear-gradient(90deg,#01012A_0%,#2E2C66_100%)] text-white rounded-[12px] text-[16px] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[inset_0px_-5px_5px_0px_#4F569B]">
              <Icons.whiteMagicWand className="w-5 h-5 text-white" /> Use in Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
