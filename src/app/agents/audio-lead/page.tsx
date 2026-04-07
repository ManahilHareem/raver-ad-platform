"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { RaverLoadingState } from "@/components/ui/RaverLoadingState";

import { AudioLeadModal } from "@/components/agents/audio-lead/AudioLeadModal";
import { AudioVault } from "@/components/agents/audio-lead/AudioVault";

interface AudioAsset {
  filename: string;
  url: string;
  type: "music" | "voiceover" | "full";
  timestamp: string;
  session_id: string;
}

function AudioLeadContent() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string>(() => 
    searchParams.get("session_id") || ""
  );
  const [vault, setVault] = useState<AudioAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://apiplatform.raver.ai/api";

  const fetchVault = async (sid: string) => {
    if (!sid) return;
    setIsSyncing(true);
    try {
      const response = await apiFetch(`${API_BASE}/ai/audio-lead/vault/${sid}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setVault(data.data.map((item: any) => ({
            ...item,
            timestamp: item.timestamp || new Date().toISOString()
          })));
        }
      }
    } catch (err) {
      console.warn("Vault sync failed:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchVault(sessionId);
    }
  }, [sessionId]);

  // Handle auto-opening the modal via search params
  useEffect(() => {
    if (searchParams.get("generate") === "true") {
      setIsModalOpen(true);
      // Clean up URL after opening
      const newUrl = window.location.pathname + (sessionId ? `?session_id=${sessionId}` : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams, sessionId]);

  const handleGenerateMusic = async (data: any) => {
    setIsLoading(true);
    setIsModalOpen(false);
    const timestamp = new Date().getTime();
    const sid = sessionId || `raver_audio_${timestamp}`;
    if (!sessionId) setSessionId(sid);

    try {
      const response = await apiFetch(`${API_BASE}/ai/audio-lead/music`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, session_id: sid })
      });

      if (response.ok) {
        // Start polling for results
        const interval = setInterval(async () => {
           const vResponse = await apiFetch(`${API_BASE}/ai/audio-lead/vault/${sid}`);
           if (vResponse.ok) {
              const vData = await vResponse.json();
              if (vData.data && vData.data.length > 0) {
                 setVault(vData.data);
                 clearInterval(interval);
                 setIsLoading(false);
              }
           }
        }, 3000);

        // Max polling time 45s
        setTimeout(() => { clearInterval(interval); setIsLoading(false); }, 45000);
      } else {
        setIsLoading(false);
        alert("Music synthesis failed.");
      }
    } catch (err) {
      console.error("Music generation error:", err);
      setIsLoading(false);
    }
  };

  const handleGenerateVoiceover = async (data: any) => {
    setIsLoading(true);
    setIsModalOpen(false);
    const timestamp = new Date().getTime();
    const sid = sessionId || `raver_audio_${timestamp}`;
    if (!sessionId) setSessionId(sid);

    try {
      const response = await apiFetch(`${API_BASE}/ai/audio-lead/voiceover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, session_id: sid })
      });

      if (response.ok) {
        // Polling
        const interval = setInterval(async () => {
           const vResponse = await apiFetch(`${API_BASE}/ai/audio-lead/vault/${sid}`);
           if (vResponse.ok) {
              const vData = await vResponse.json();
              if (vData.data && vData.data.length > 0) {
                 setVault(vData.data);
                 clearInterval(interval);
                 setIsLoading(false);
              }
           }
        }, 3000);
        setTimeout(() => { clearInterval(interval); setIsLoading(false); }, 45000);
      } else {
        setIsLoading(false);
        alert("Voiceover synthesis failed.");
      }
    } catch (err) {
      console.error("Voiceover error:", err);
      setIsLoading(false);
    }
  };

  const handleProduceFull = async (data: any) => {
    setIsLoading(true);
    setIsModalOpen(false);
    const timestamp = new Date().getTime();
    const sid = sessionId || `raver_audio_${timestamp}`;
    if (!sessionId) setSessionId(sid);

    try {
      const response = await apiFetch(`${API_BASE}/ai/audio-lead/produce`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, session_id: sid })
      });

      if (response.ok) {
        // Polling
        const interval = setInterval(async () => {
           const vResponse = await apiFetch(`${API_BASE}/ai/audio-lead/vault/${sid}`);
           if (vResponse.ok) {
              const vData = await vResponse.json();
              if (vData.data && vData.data.length > 0) {
                 setVault(vData.data);
                 clearInterval(interval);
                 setIsLoading(false);
              }
           }
        }, 3000);
        setTimeout(() => { clearInterval(interval); setIsLoading(false); }, 60000); // 60s for full production
      } else {
        setIsLoading(false);
        alert("Full production synthesis failed.");
      }
    } catch (err) {
      console.error("Production error:", err);
      setIsLoading(false);
    }
  };

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `neural_audio_${new Date().getTime()}.mp3`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 sm:gap-8 p-4 sm:p-8 mx-auto bg-white rounded-3xl min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col gap-6 p-5 sm:p-8 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link 
                href="/agents" 
                className="w-10 h-10 rounded-[14px] bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-all active:scale-90 group"
              >
                <Icons.ArrowLeft className="w-5 h-5 text-[#01012A] group-hover:-translate-x-0.5 transition-transform" />
              </Link>
              <div className="flex flex-col">
                 <h1 className="text-[28px] sm:text-[34px] font-black text-[#01012A] tracking-tighter lowercase leading-none">RAVER AI AUDIO LEAD</h1>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-3">Synthesizing the Atmosphere of Production</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {sessionId && (
                <div className="hidden lg:flex items-center gap-4 px-5 py-2.5 bg-slate-50 rounded-[18px] border border-slate-100/50">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                   <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Active Sync Session</span>
                      <span className="text-[10px] font-black text-[#01012A] font-mono">{sessionId}</span>
                   </div>
                   <button 
                    onClick={() => { setSessionId(""); setVault([]); }}
                    className="ml-2 p-1.5 hover:bg-white rounded-lg transition-all text-slate-300 hover:text-red-500"
                   >
                     <Icons.Trash className="w-3.5 h-3.5" />
                   </button>
                </div>
              )}
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="h-14 px-8 bg-[#01012A] text-white rounded-[20px] font-black text-[11px] uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#01012A]/10 border border-white/5"
              >
                <Icons.Activity className="w-4 h-4" />
                Initiate Synthesis
              </button>
            </div>
          </div>
        </div>

        {/* Neural Vault Section */}
        <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.01)] h-full">
           <AudioVault 
             assets={vault}
             isLoading={isSyncing}
             onDownload={handleDownload}
           />
        </div>

        {/* Neural Orchestration Modal */}
        <AudioLeadModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onGenerateMusic={handleGenerateMusic}
          onGenerateVoiceover={handleGenerateVoiceover}
          onProduceFull={handleProduceFull}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
}

export default function AudioLeadPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <RaverLoadingState 
            title="Calibrating Neural Acoustics" 
            description="Preparing the audio synthesis engine and synchronizing your creative vault..." 
          />
        </div>
      </DashboardLayout>
    }>
      <AudioLeadContent />
    </Suspense>
  );
}
