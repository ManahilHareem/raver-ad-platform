"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onEnhance?: () => void;
}

export default function ImageViewerModal({
  isOpen,
  onClose,
  imageUrl,
  onEnhance
}: ImageViewerModalProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  React.useEffect(() => {
    if (isOpen) setIsImageLoading(true);
  }, [imageUrl, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center overflow-hidden bg-black animate-in fade-in duration-500">
      {/* Cinematic Backdrop */}
      <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />
      
      {/* Image Container */}
      <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-20 pointer-events-none transition-all duration-700">
         <div className="relative w-full h-full max-w-screen-2xl max-h-screen pointer-events-auto">
            {imageUrl && imageUrl.startsWith("http") ? (
              <>
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icons.Loader className="w-12 h-12 animate-spin text-white/20" />
                  </div>
                )}
                <Image 
                  src={imageUrl} 
                  alt="Asset Audit" 
                  fill 
                  className={cn(
                    "object-contain transition-all duration-700",
                    isImageLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
                  )} 
                  priority 
                  unoptimized
                  onLoad={() => setIsImageLoading(false)}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/10 gap-4">
                 <Icons.Image className="w-20 h-20" />
                 <p className="text-xs font-black uppercase tracking-widest opacity-40">Matrix Empty</p>
              </div>
            )}
         </div>
      </div>

      {/* Discrete Bottom HUD */}
      <div className="absolute bottom-6 sm:bottom-10 inset-x-0 flex justify-center items-center pointer-events-none animate-in slide-in-from-bottom-10 duration-700">
         <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full px-2 py-2 flex items-center gap-1 pointer-events-auto shadow-2xl scale-90 sm:scale-100">
            {onEnhance && (
               <>
                 <button 
                  onClick={(e) => { e.stopPropagation(); onEnhance(); }}
                  className="h-10 px-6 hover:bg-white hover:text-black text-white rounded-full font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2"
                 >
                   <Icons.MagicWand className="w-3.5 h-3.5" /> Neural Enlarge
                 </button>
                 <div className="w-px h-4 bg-white/10 mx-1" />
               </>
            )}
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              title="Close Audit"
            >
              <Icons.Plus className="w-5 h-5 rotate-45" />
            </button>
         </div>
      </div>
    </div>
  );
}
