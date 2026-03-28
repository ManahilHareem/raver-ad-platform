"use client";

import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface CampaignPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignData: {
    title?: string;
    session_id?: string;
    message?: string;
    status?: string;
    campaign_id?: string;
    video_url?: string | null;
    voiceover_url?: string | null;
    music_url?: string | null;
    script?: string | null;
  } | null;
}

export default function CampaignPreviewModal({ isOpen, onClose, campaignData }: CampaignPreviewModalProps) {
  if (!isOpen || !campaignData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between bg-white z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#02022C] rounded-xl flex items-center justify-center shadow-lg shadow-[#02022C]/10">
              <Icons.Eye className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[17px] font-bold text-[#121212]">{campaignData.title || "Campaign Preview"}</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-[#64748B] font-bold uppercase tracking-widest">SID: {campaignData.session_id}</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-[#F1F5F9] rounded-full transition-colors group"
          >
            <Icons.Plus className="w-5 h-5 rotate-45 text-[#94A3B8] group-hover:text-[#121212]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
          {/* Main Message */}
          <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#F1F5F9]">
            <p className="text-[14px] font-medium text-[#1E293B] leading-relaxed italic">
              "{campaignData.message}"
            </p>
          </div>

          {/* Visual Preview */}
          <div className="space-y-4">
            <h3 className="text-[12px] font-black text-[#02022C] uppercase tracking-[0.2em]">Visual & Video</h3>
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 border border-[#F1F5F9] shadow-inner group">
              {campaignData.video_url ? (
                <video 
                  src={campaignData.video_url} 
                  controls 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-4">
                  <Icons.Image className="w-16 h-16" />
                  <p className="text-xs font-bold uppercase tracking-widest">Video is still processing</p>
                </div>
              )}
            </div>
          </div>

          {/* Audio Tracks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-[12px] font-black text-[#02022C] uppercase tracking-[0.2em]">Voiceover</h3>
              <div className="p-4 bg-white border border-[#F1F5F9] rounded-2xl shadow-sm flex flex-col gap-3">
                {campaignData.voiceover_url ? (
                  <audio src={campaignData.voiceover_url} controls className="w-full h-8" />
                ) : (
                  <div className="text-[11px] text-[#94A3B8] font-medium">No voiceover track available</div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[12px] font-black text-[#02022C] uppercase tracking-[0.2em]">Background Music</h3>
              <div className="p-4 bg-white border border-[#F1F5F9] rounded-2xl shadow-sm flex flex-col gap-3">
                {campaignData.music_url ? (
                  <audio src={campaignData.music_url} controls className="w-full h-8" />
                ) : (
                  <div className="text-[11px] text-[#94A3B8] font-medium">No music track available</div>
                )}
              </div>
            </div>
          </div>

          {/* Script Content */}
          <div className="space-y-4">
            <h3 className="text-[12px] font-black text-[#02022C] uppercase tracking-[0.2em]">Campaign Script</h3>
            <div className="p-6 bg-[#02022C]/2 border border-[#F1F5F9] rounded-[24px] relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Icons.MagicWand className="w-12 h-12 text-[#02022C]" />
                </div>
                <p className="text-[15px] text-[#334155] leading-[1.6] font-medium relative z-10">
                    {campaignData.script || "Script loading..."}
                </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#F1F5F9] bg-[#FDFDFF] flex items-center justify-between sticky bottom-0">
          <div className="flex flex-col gap-1">
            
          </div>
          <button 
            onClick={onClose}
            className="h-11 px-8 bg-[#02022C] text-white rounded-xl font-bold text-sm hover:shadow-xl hover:-translate-y-px transition-all"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
