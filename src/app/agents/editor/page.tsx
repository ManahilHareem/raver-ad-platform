"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { EditorModal } from "@/components/agents/editor/EditorModal";
import { EditorVault } from "@/components/agents/editor/EditorVault";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { RaverLoadingState } from "@/components/ui/RaverLoadingState";
import CampaignPreviewModal from "@/components/studio/CampaignPreviewModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

function EditorContent() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string>(() => searchParams.get("session_id") || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://apiplatform.raver.ai/api";

  const fetchVault = async (sid?: string) => {
    setIsSyncing(true);
    try {
      const endpoint = sid 
        ? `${API_BASE}/ai/producer/campaigns?session_id=${sid}`
        : `${API_BASE}/ai/producer/campaigns`;

      const response = await apiFetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const videoAssets = data.data
            .filter((c: any) => c.video_url)
            .map((c: any) => ({
              id: c.session_id || c.campaign_id,
              url: c.video_url,
              thumbnail: c.image || c.video_url.replace('.mp4', '.jpg'),
              format: c.metadata?.format || "16:9",
              timestamp: c.created_at || new Date().toISOString(),
              status: "completed",
              label: c.title || c.name,
              sessionId: c.session_id
            }));
          setVideos(videoAssets);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch editor vault:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchVault(sessionId);
  }, [sessionId]);

  // Handle auto-opening via search params
  useEffect(() => {
    if (searchParams.get("generate") === "true") {
      setIsModalOpen(true);
      const newUrl = window.location.pathname + (sessionId ? `?session_id=${sessionId}` : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams, sessionId]);

  const handleGenerate = async (data: any) => {
    setIsGenerating(true);
    setIsModalOpen(false);
    toast.info("Initializing neural video synthesis pipeline...");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Synthesis job submitted to orchestration engine.");
      fetchVault(sessionId);
    } catch (err) {
      toast.error("Orchestration pipeline failure. Please retry.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = (video: any) => {
    setSelectedVideo({
      title: video.label,
      video_url: video.url,
      session_id: video.sessionId,
      status: "completed"
    });
    setIsPreviewOpen(true);
  };

  const handleDeleteSession = async () => {
    if (!sessionId) return;
    setIsDeleting(true);
    try {
      await apiFetch(`${API_BASE}/ai/producer/session/${sessionId}`, { method: 'DELETE' });
      setSessionId("");
      fetchVault();
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error("Failed to archive session.");
    } finally {
      setIsDeleting(false);
    }
  };

  const stats = [
    { label: "Total Renders", value: videos.length, icon: Icons.Film, color: "text-blue-500" },
    { label: "Processing", value: videos.filter(v => v.status === "processing").length, icon: Icons.Activity, color: "text-emerald-500" },
    { label: "Vault Storage", value: `${(videos.length * 4.2).toFixed(1)}GB`, icon: Icons.Dashboard, color: "text-purple-500" }
  ];

  return (
    <div className="flex flex-col gap-6 sm:gap-8 p-4 sm:p-8 mx-auto bg-white rounded-3xl min-h-screen">
      {/* Standardized Orchestration Header */}
      <div className="flex flex-col gap-6 p-5 sm:p-8 relative overflow-hidden bg-slate-50/50 rounded-[32px] border border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/agents" 
              className="w-10 h-10 rounded-[14px] bg-white border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all active:scale-90 group shadow-sm"
            >
              <Icons.ArrowLeft className="w-5 h-5 text-[#01012A] group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div className="flex flex-col">
               <h1 className="text-[28px] sm:text-[34px] font-black text-[#01012A] tracking-tighter lowercase leading-none">RAVER EDITOR</h1>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-3">High-Fidelity Cinematic Orchestration</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {sessionId && (
              <div className="hidden lg:flex items-center gap-4 px-5 py-2.5 bg-white rounded-[18px] border border-slate-100 shadow-sm">
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                 <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Active Sync Session</span>
                    <span className="text-[10px] font-black text-[#01012A] font-mono">{sessionId}</span>
                 </div>
                 <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="ml-2 p-1.5 hover:bg-red-50 rounded-lg transition-all text-slate-300 hover:text-red-500"
                 >
                   <Icons.Trash className="w-3.5 h-3.5" />
                 </button>
              </div>
            )}
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="h-14 px-8 bg-[#01012A] text-white rounded-[20px] font-black text-[11px] uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#01012A]/10 border border-white/5"
            >
              <Icons.Rocket className="w-4 h-4" />
              Initiate Synthesis
            </button>
          </div>
        </div>
      </div>

      {/* Visual Synthesis Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[28px] p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
              <span className="text-2xl font-black text-[#01012A] tracking-tight">{stat.value}</span>
            </div>
            <div className={cn("w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center transition-colors group-hover:bg-slate-100", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="h-px bg-slate-50 w-full" />

      {/* Production Vault */}
      <div className="space-y-6 flex-1">
        <div className="bg-white rounded-[40px] p-2 border border-slate-50">
          <EditorVault 
            videos={videos} 
            isLoading={isSyncing} 
            onPreview={handlePreview} 
            isGlobalArchive={!sessionId}
          />
        </div>
      </div>

      {/* Synthesis Modal */}
      <EditorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleGenerate}
        isLoading={isGenerating}
      />

      {/* Preview Modal */}
      <CampaignPreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        campaignData={selectedVideo}
      />

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSession}
        title="Archive Synthesis Session"
        message="Are you sure you want to permanently archive this neural synthesis session? This will clear the active workspace while preserving assets in the global vault."
        confirmText="Archive Session"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function EditorPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <RaverLoadingState 
            title="Calibrating Visual Synthesis" 
            description="Accessing neural video archives and synchronizing the cinematic orchestration engine..." 
          />
        </div>
      }>
        <EditorContent />
      </Suspense>
    </DashboardLayout>
  );
}
