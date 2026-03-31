"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";

interface ImageAsset {
  filename: string;
  url: string;
  label?: string;
}

interface MediaVaultProps {
  vault: ImageAsset[];
  aspectRatio: string;
  onAssetClick: (url: string) => void;
  hasSessions: boolean;
}

export function MediaVault({ 
  vault, 
  aspectRatio, 
  onAssetClick,
  hasSessions 
}: MediaVaultProps) {
  return (
    <div className="flex flex-col gap-8">
      {!vault.length ? (
        <div className="flex flex-col items-center justify-center p-10 sm:p-20 bg-[#F8FAFC] border border-dashed rounded-3xl text-center">
          <Icons.Image className="w-10 h-10 text-slate-300 mb-4" />
          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
            {hasSessions ? "No assets in this session" : "No sessions found. Start a new generation."}
          </h4>
          {!hasSessions && (
            <p className="text-slate-400 text-[10px] sm:text-xs mt-1">
              Your creative generations will appear here.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {vault.map((asset) => {
            const rawUrl = asset?.url || "";
            if (!rawUrl || typeof rawUrl !== "string") return null;

            const imageUrl = rawUrl.startsWith("http") 
              ? rawUrl 
              : `https://apiplatform.raver.ai${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;

            const ratioClassMap: Record<string, string> = {
              "16:9": "aspect-video",
              "9:16": "aspect-[9/16]",
              "1:1": "aspect-square"
            };
            const currentRatioClass = ratioClassMap[aspectRatio] || "aspect-video";

            return (
              <div 
                key={asset.filename + asset.url} 
                onMouseEnter={() => {
                  if (imageUrl && imageUrl.startsWith("http")) {
                    const img = new (window as any).Image();
                    img.src = imageUrl;
                  }
                }}
                onClick={() => { 
                  if (imageUrl && imageUrl.startsWith("http")) {
                    onAssetClick(imageUrl);
                  }
                }}
                className={cn(
                  "group relative bg-[#0A0A0A] rounded-[24px] overflow-hidden border border-white/5 transition-all duration-300 cursor-pointer select-none",
                  currentRatioClass
                )}
              >
                {imageUrl && imageUrl.startsWith("http") ? (
                  <Image 
                    src={imageUrl}
                    alt={asset.label || "Production Asset"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover group-hover:scale-[1.05] transition-transform duration-[1.5s]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                    <Icons.Loader className="w-6 h-6 animate-spin text-white/20" />
                  </div>
                )}
                
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                   <span className="px-3 py-1 bg-black/60 border border-white/10 rounded-lg text-[8px] font-black text-white/60 uppercase tracking-[0.2em]">
                     {asset.label || "Scene Asset"}
                   </span>
                </div>

                <div className="absolute inset-0 bg-[#0A0A0A]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                   <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20 scale-90 group-hover:scale-100 transition-transform duration-200">
                      <Icons.Search className="w-5 h-5 text-white" />
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
