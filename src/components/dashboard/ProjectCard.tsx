import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { cn, normalizeAssetUrl } from "@/lib/utils";
import { toast } from "react-toastify";
import ImageViewerModal from "@/components/agents/ImageViewerModal";

interface ProjectCardProps {
  title: string;
  time?: string;
  image: string | string[];
  status?: string;
  campaignStatus?: string | null;
  message?: string;
  videoUrl?: string | null;
  onPreview?: () => void;
  onHistory?: () => void;
  onDelete?: () => void;
  description?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function ProjectCard({ 
  title, 
  time, 
  image,
  status,
  campaignStatus,
  message,
  videoUrl,
  onPreview,
  onHistory,
  onDelete,
  description,
  isSelected,
  onClick
}: ProjectCardProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Image slideshow state
  const images = useMemo(() => {
    const raw = Array.isArray(image) ? image : [image];
    return raw.filter(Boolean);
  }, [image]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slideshowTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasMultipleImages = images.length > 1;
  const showSlideshow = hasMultipleImages && (!videoUrl || videoError);

  // Auto-cycle images
  useEffect(() => {
    if (!showSlideshow) return;

    const cycle = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 400); // fade-out duration
    };

    slideshowTimerRef.current = setInterval(cycle, 3000);
    return () => {
      if (slideshowTimerRef.current) clearInterval(slideshowTimerRef.current);
    };
  }, [showSlideshow, images.length]);

  // Manual dot navigation
  const goToImage = useCallback((index: number) => {
    if (index === currentImageIndex) return;
    // Reset auto-cycle timer
    if (slideshowTimerRef.current) clearInterval(slideshowTimerRef.current);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setIsTransitioning(false);
    }, 300);
    // Restart auto-cycle
    if (showSlideshow) {
      slideshowTimerRef.current = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentImageIndex(prev => (prev + 1) % images.length);
          setIsTransitioning(false);
        }, 400);
      }, 3000);
    }
  }, [currentImageIndex, showSlideshow, images.length]);

  const isReady = status === "Ready" || status === "completed" || status === "delivered" || status?.toLowerCase() === "approved";
  const isInProduction = !isReady && (status === "in_production" || status === "queued" || status === "In Production" || status === "pipeline_running" || campaignStatus === "in_production" || campaignStatus === "queued");
  const isActionRequired = status?.toLowerCase().startsWith("awaiting_approval_") || status === "ready_for_human_review";

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = videoUrl || images[0];
    if (!url) return;

    toast.info('Preparing secure download...');
    const fileName = title.toLowerCase().replace(/\s+/g, '-');
    const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&filename=raver-${fileName}-${Date.now()}.mp4`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const linkToCopy = videoUrl || images[0];
    if (linkToCopy) {
      navigator.clipboard.writeText(linkToCopy);
      toast.success("Video link synced to clipboard!");
    } else {
      toast.warn("No link available to sync.");
    }
  };

  return (
    <>
    <div 
      onClick={onClick}
      className={cn(
        "group p-[8px] bg-white rounded-[12px] border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer",
        isSelected ? "border-[#01012A] border-2 shadow-lg scale-[1.01]" : "border-slate-100"
      )}
    >
        {/* We remove gap-[8px] here because it interferes with the Thumbnail/Content relationship; padding should handle it */}
      {/* Thumbnail Container with 8px padding */}
      <div className=" w-full" onClick={(e) => {
        if (onPreview) {
          e.stopPropagation();
          onPreview();
        }
      }}>
        <div className="relative h-[192px] w-full rounded-[8px] overflow-hidden bg-slate-100 cursor-pointer">
          {videoUrl && !videoError ? (
            <div className="relative w-full h-full">
              <video 
                ref={videoRef}
                src={videoUrl} 
                autoPlay 
                loop 
                muted={isMuted} 
                playsInline 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                onError={() => setVideoError(true)}
              />
              <button 
                onClick={toggleMute}
                className="absolute top-2 left-2 z-30 w-8 h-8 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <Icons.Mute className="w-3.5 h-3.5" /> : <Icons.Volume className="w-3.5 h-3.5" />}
              </button>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-slate-50">
              <Image 
                src={images[currentImageIndex] || images[0]} 
                alt={title}
                fill
                className={cn(
                  "object-cover transition-all duration-500",
                  isInProduction ? "scale-105 blur-sm" : "group-hover:scale-110",
                  videoError && "opacity-40 grayscale",
                  isTransitioning ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPreviewOpen(true);
                }}
              />
              {/* Slideshow search overlay */}
              {!isInProduction && !videoUrl && (
                <div 
                  className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPreviewOpen(true);
                  }}
                >
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 pointer-events-auto">
                    <Icons.Search className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
              {/* Slideshow dot indicators */}
              {showSlideshow && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToImage(idx);
                      }}
                      className={cn(
                        "rounded-full transition-all duration-300 shadow-sm",
                        idx === currentImageIndex
                          ? "w-4 h-1.5 bg-white"
                          : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                      )}
                    />
                  ))}
                </div>
              )}
              {videoError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/10 backdrop-blur-[2px] z-10">
                   <Icons.AlertTriangle className="w-6 h-6 text-amber-500/80 mb-2" />
                   <span className="text-[8px] font-black uppercase tracking-widest text-[#01012A]/60">Source Offline</span>
                </div>
              )}
            </div>
          )}

          {isInProduction && (
            <div className="absolute inset-0 bg-[#02022C]/40 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-10 transition-all">
              <Icons.Loader className="w-5 h-5 text-white animate-spin mb-1.5" />
              <p className="text-white text-[10px] font-bold uppercase tracking-wider">
                {status === "queued" ? "Queued" : "Pipeline Running"}
              </p>
              {message && (
                <p className="text-white/90 text-[9px] mt-1 font-medium max-w-[90%] line-clamp-2">
                  {message}
                </p>
              )}
            </div>
          )}

          {isActionRequired && (
            <div className="absolute inset-0 bg-[#02022C]/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10 transition-all">
              <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center mb-3 animate-pulse shadow-lg shadow-amber-500/20">
                <Icons.Zap className="w-6 h-6 text-white" />
              </div>
              <p className="text-white text-[11px] font-black uppercase tracking-[0.2em] mb-1">
                Action Required
              </p>
              <p className="text-white/70 text-[9px] font-bold uppercase tracking-widest">
                {status?.replace("awaiting_approval_", "").replace("_", " ")} Review
              </p>
            </div>
          )}

          <div className="absolute top-2 right-2 z-20">
            <span className={cn(
              "px-[6px] py-[3px] rounded-[4px] text-[9px] font-bold uppercase tracking-wider shadow-sm",
              isReady ? "bg-linear-to-r from-[#059669] to-[#10B981] text-white shadow-lg shadow-emerald-500/20" 
              : isActionRequired ? "bg-amber-500 text-white animate-pulse"
              : isInProduction ? "bg-white text-[#02022C] animate-pulse" 
              : "bg-linear-to-r from-[#AD46FF] to-[#2B7FFF] text-white"
            )}>
              {(status || "Draft").replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-[12px] pb-[4px]  flex flex-col gap-[12px] flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[16px] font-bold text-[#121212] leading-tight line-clamp-1 cursor-pointer" onClick={onPreview}>{title}</h3>
        </div>

        <div className="flex items-center gap-[16px] mt-auto">
          <div className="flex items-center gap-2 text-[12px] font-regular text-[#4F4F4F]">
            <Icons.Clock className="w-4 h-4" />
            <span>{time} ago</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onPreview}
            className={cn(
              "flex-1 h-[40px] rounded-xl text-[14px] font-bold transition-all active:scale-95 flex items-center justify-center gap-2",
              isActionRequired 
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20 hover:bg-amber-600" 
                : "bg-linear-to-r from-[#01012A] to-[#2E2C66] text-white shadow-lg shadow-[#01012A]/10 hover:opacity-90"
            )}
          >
            {isActionRequired ? (
              <>
                <Icons.Zap className="w-4 h-4" /> Review Now
              </>
            ) : (
              <>
                <Icons.Eye className="w-4 h-4" /> Preview
              </>
            )}
          </button>
          
          <button 
            onClick={handleDownload}
            disabled={isInProduction}
            className="h-[40px] w-[40px] border border-slate-200 rounded-xl text-[#4F4F4F] hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download Asset"
          >
            <Icons.Download className="w-5 h-5" />
          </button>

          <button 
            onClick={handleCopy}
            className="h-[40px] w-[40px] border border-slate-200 rounded-xl text-[#4F4F4F] hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center"
            title="Copy Ad Text"
          >
            <Icons.Copy className="w-4 h-4" />
          </button>

          {onDelete && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="h-[40px] w-[40px] border border-rose-100 bg-rose-50/50 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95 flex items-center justify-center"
              title="Delete Project"
            >
              <Icons.Trash className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
    <ImageViewerModal 
      isOpen={isPreviewOpen}
      onClose={() => setIsPreviewOpen(false)}
      imageUrl={normalizeAssetUrl(images[currentImageIndex] || images[0])}
    />
    </>
  );
}
