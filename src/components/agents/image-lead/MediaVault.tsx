"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";

interface ImageAsset {
  filename: string;
  url: string;
  label?: string;
  sessionId?: string;
}

interface MediaVaultProps {
  vault: ImageAsset[];
  onAssetClick: (url: string) => void;
  hasSessions: boolean;
  onDelete?: (sessionId: string) => void;
}

/**
 * VaultImage: Handles individual image rendering, hover effects,
 * and up to 3 automatic retries if loading fails.
 */
function VaultImage({ 
  asset, 
  onAssetClick,
  onDelete
}: { 
  asset: ImageAsset; 
  onAssetClick: (url: string) => void;
  onDelete?: (sessionId: string) => void;
}) {
  const rawUrl = asset?.url || "";
  const initialUrl = rawUrl.startsWith("http") 
    ? rawUrl 
    : `https://apiplatform.raver.ai${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;

  const [imgSrc, setImgSrc] = useState(initialUrl);
  const [retryCount, setRetryCount] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state if initial URL changes
  useEffect(() => {
    setImgSrc(initialUrl);
    setRetryCount(0);
    setIsError(false);
    setIsLoading(true);
  }, [initialUrl]);

  const handleError = () => {
    if (retryCount < 3) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        const separator = initialUrl.includes("?") ? "&" : "?";
        setImgSrc(`${initialUrl}${separator}retry=${retryCount + 1}&t=${Date.now()}`);
      }, 2000); // Wait 2 seconds before retrying
    } else {
      setIsError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setIsError(false);
  };

  if (!rawUrl || typeof rawUrl !== "string") return null;

  return (
    <div 
      className={cn(
        "group relative bg-[#0A0A0A] rounded-[24px] overflow-hidden border border-white/5 transition-all duration-300 cursor-pointer select-none aspect-square"
      )}
      onClick={() => { 
        if (!isError && imgSrc.startsWith("http")) {
          onAssetClick(imgSrc);
        }
      }}
    >
      {/* Loading & Error States */}
      {(isLoading || isError) && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-1">
          {isError ? (
            <div className="flex flex-col items-center gap-2">
              <Icons.Plus className="w-6 h-6 text-red-500/50 rotate-45" />
              <span className="text-[8px] font-black text-red-500/50 uppercase tracking-widest">Load Failed</span>
            </div>
          ) : (
             <div className="flex flex-col items-center gap-2">
                <Icons.Loader className="w-6 h-6 animate-spin text-white/20" />
                {retryCount > 0 && (
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                    Retry {retryCount}/3
                  </span>
                )}
             </div>
          )}
        </div>
      )}

      {/* Main Image */}
      {!isError && (
        <Image 
          src={imgSrc}
          alt={asset.label || "Production Asset"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className={cn(
            "object-cover group-hover:scale-[1.05] transition-transform duration-[1.5s]",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onError={handleError}
          onLoad={handleLoad}
          priority={false}
          unoptimized
        />
      )}
      
      {/* Tag Overlay */}
      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
         <span className="px-3 py-1 bg-black/60 border border-white/10 rounded-lg text-[8px] font-black text-white/60 uppercase tracking-[0.2em]">
           {String(asset.label || "Scene").split(" ")[0].substring(0, 8)} ai-lead
         </span>
      </div>

      {/* Delete Trigger Overlay */}
      {onDelete && asset.sessionId && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
           <button 
             onClick={(e) => {
               e.stopPropagation();
               if (window.confirm("Permanently archive this visual synthesis session?")) {
                 onDelete(asset.sessionId!);
               }
             }}
             className="w-8 h-8 rounded-lg bg-red-500/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-600 transition-all border border-white/20 active:scale-95"
             title="Archive Session"
           >
             <Icons.Trash className="w-3.5 h-3.5" />
           </button>
        </div>
      )}

      {/* Hover Icon */}
      {!isError && (
        <div className="absolute inset-0 bg-[#0A0A0A]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none z-5">
           <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20 scale-90 group-hover:scale-100 transition-transform duration-200">
              <Icons.Search className="w-5 h-5 text-white" />
           </div>
        </div>
      )}
    </div>
  );
}

export function MediaVault({ 
  vault, 
  onAssetClick,
  hasSessions,
  onDelete
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
          {vault.map((asset) => (
            <VaultImage 
              key={asset.filename + (asset.sessionId || "") + asset.url} 
              asset={asset} 
              onAssetClick={onAssetClick} 
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

