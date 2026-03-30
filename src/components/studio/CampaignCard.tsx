"use client";

import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

import { useState, useEffect } from "react";
import CampaignPreviewModal from "./CampaignPreviewModal";
import { apiFetch } from "@/lib/api";

interface CampaignCardProps {
  id?: string;
  title: string;
  status: string;
  image: string;
  videoUrl?: string | null;
  message?: string;
  onDelete?: () => void;
  voiceover_url?: string | null;
  music_url?: string | null;
  script?: string | null;
  session_id?: string;
  campaign_id?: string;
}

export default function CampaignCard({ 
  id, 
  title, 
  status, 
  image, 
  videoUrl, 
  message, 
  onDelete,
  voiceover_url,
  music_url,
  script,
  session_id,
  campaign_id
}: CampaignCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  
  // Local state to store potentially fresher data from API
  const [localData, setLocalData] = useState({
    title: title || "Campaign Preview",
    session_id: session_id || id || "N/A",
    message: message || "Your campaign is ready!",
    status: status,
    campaign_id: campaign_id || id || "N/A",
    video_url: videoUrl,
    voiceover_url: voiceover_url,
    music_url: music_url,
    script: script
  });

  // Sync with props initially
  useEffect(() => {
    setLocalData({
      title: title || "Campaign Preview",
      session_id: session_id || id || "N/A",
      message: message || "Your campaign is ready!",
      status: status,
      campaign_id: campaign_id || id || "N/A",
      video_url: videoUrl,
      voiceover_url: voiceover_url,
      music_url: music_url,
      script: script
    });
  }, [title, session_id, id, message, status, campaign_id, videoUrl, voiceover_url, music_url, script]);

  const handlePreviewClick = async () => {
    setIsPreviewOpen(true);
    if (!session_id && !id) return;
    
    setIsFetching(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const targetId = session_id || id;
      
      const response = await apiFetch(`${API_BASE}/ai/director/session/${targetId}/update`, {
        headers: { "accept": "*/*" }
      });

      if (response.ok) {
        const resData = await response.json();
        const updateData = resData.data;
        
        if (updateData) {
          setLocalData(prev => ({
            ...prev,
            title: updateData.title || prev.title,
            status: updateData.status || prev.status,
            message: updateData.message || prev.message,
            campaign_id: updateData.campaign_id || prev.campaign_id,
            video_url: updateData.video_url || prev.video_url,
            voiceover_url: updateData.voiceover_url || prev.voiceover_url,
            music_url: updateData.music_url || prev.music_url,
            script: updateData.script || prev.script
          }));
        }
      }
    } catch (e) {
      console.warn("Manual preview refresh failed:", e);
    } finally {
      setIsFetching(false);
    }
  };

  const isReady = status === "Ready" || status === "completed" || status === "delivered";
  const isInProduction = status === "in_production" || status === "queued" || status === "In Production";

  return (
    <>
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
              {(status || "Draft").replace("_", " ")}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-[4px] pt-[12px] pb-[4px]">
          <h3 className="text-[16px] font-semibold text-[#121212]">{title}</h3>
          <div className="flex items-center gap-[4px]">
            <button 
              onClick={handlePreviewClick}
              disabled={isInProduction}
              className="flex-1 h-[36px] bg-white border border-[#F1F5F9] rounded-[5px] text-[12px] font-medium text-[#121212] hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isFetching && <Icons.Loader className="w-3 h-3 animate-spin" />}
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

      <CampaignPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        campaignData={localData}
      />
    </>
  );
}
