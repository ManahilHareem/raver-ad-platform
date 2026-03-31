"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

import { LaunchBriefForm } from "@/components/producer/LaunchBriefForm";
import { ProducerModal } from "@/components/producer/ProducerModal";
import { LiveProductionTracker } from "@/components/producer/LiveProductionTracker";
import { CampaignHistoryList } from "@/components/producer/CampaignHistoryList";
import { RaverLoadingState } from "@/components/ui/RaverLoadingState";

function ProducerContent() {
  const searchParams = useSearchParams();
  const [isSyncing, setIsSyncing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulation data for initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSyncing(false);
      // Fallback example history
      setHistory([
        {
          id: "f8dd0923-5f3e-4a1b-8a7c-c44700051968",
          name: "shipera",
          status: "in_production",
          created_at: new Date().toISOString(),
          brief: {
            business_name: "shipera",
            product_description: "hair styling",
            target_audience: "Women 25-40",
            mood: "elegant",
            platform: "instagram",
            tone: "elegant",
            num_scenes: 7,
            voice: "oversea_male1",
            format: "9:16",
            video_model: "kling-video"
          }
        }
      ]);
      setActiveCampaign({
        id: "f8dd0923-5f3e-4a1b-8a7c-c44700051968",
        status: "in_production",
        message: "Image Generation",
        pipeline: "Attempt 1/3"
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLaunch = async (formData: any) => {
    setIsLoading(true);
    try {
      // Simulate launching
      await new Promise(resolve => setTimeout(resolve, 2500));
      const newId = `raver_prod_${new Date().getTime()}`;
      const newCampaign = {
        id: newId,
        name: formData.business_name,
        status: "in_production",
        created_at: new Date().toISOString(),
        brief: formData
      };
      
      setActiveCampaign({
        id: newId,
        status: "in_production",
        message: "Prompt Engine",
        pipeline: "Matrix Initialized"
      });
      setHistory(prev => [newCampaign, ...prev]);
    } catch (err) {
      console.error("Launch failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSyncing) {
    return (
      <RaverLoadingState 
        title="Calibrating Neural Producer" 
        description="Synchronizing Matrix infrastructure and preparing high-fidelity Kling AI configuration..." 
      />
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Subtle Mesh Background Orchestration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-white/5 blur-[120px] rounded-full" />
           <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-[#01012A]/5 blur-[100px] rounded-full" />
        </div>

        <div className="flex flex-col gap-8 sm:gap-12 p-4 sm:p-10 mx-auto relative z-10 max-w-[1600px]">
          {/* Header - Orchestration Hub */}
          <div className="flex flex-col gap-8 p-6 sm:p-10 bg-white/40 backdrop-blur-md rounded-[40px] border border-white/40 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <Link 
                    href="/agents" 
                    className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 hover:border-slate-300 shadow-sm transition-all"
                  >
                    <Icons.ArrowLeft className="w-5 h-5 text-[#01012A]" />
                  </Link>
                </div>
                <div className="flex flex-col">
                   <h1 className="text-[30px] font-bold text-[#121212] tracking-tighter lowercase leading-none">Raver Producer</h1>
                   <div className="flex items-center gap-2 mt-2">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Operational Hub</p>
                   </div>
                 </div>
              </div>

              <div className="hidden sm:flex items-center gap-4">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="h-14 px-10  text-[#01012A] border border-slate-100 rounded-[24px] font-black text-xs flex items-center gap-3 transition-all bg-linear-to-r from-[#01012A] to-[#2E2C66] text-white hover:border-transparent active:scale-95 group shadow-xl shadow-black/5"
                >
                   <Icons.Plus className="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" />
                   <span className="uppercase tracking-widest text-[11px]">Initiate Master Production</span>
                </button>
                
              </div>
            </div>
          </div>

          {/* Main Orchestration Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Real-time Status Tracker - Neural Pulse */}
            <div className="lg:col-span-12">
              <LiveProductionTracker 
                campaignId={activeCampaign?.id}
                status={activeCampaign?.status}
                statusMessage={activeCampaign?.message}
                pipelineMessage={activeCampaign?.pipeline}
              />
            </div>
          </div>

          {/* Archive Matrix - Dossier Feed */}
          <div className="pt-8">
             <CampaignHistoryList history={history} />
          </div>
        </div>

        {/* Orchestration Suite Modal Overlay */}
        {isModalOpen && (
          <ProducerModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onLaunch={handleLaunch}
            isLoading={isLoading}
            activeCampaign={activeCampaign}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default function ProducerPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="p-8 flex items-center justify-center min-h-[600px]">
          <div className="flex flex-col items-center gap-6">
             <div className="w-16 h-16 border-4 border-slate-100 border-t-[#0A0A0A] rounded-full animate-spin" />
             <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Initializing Matrix...</p>
          </div>
        </div>
      </DashboardLayout>
    }>
      <ProducerContent />
    </Suspense>
  );
}
