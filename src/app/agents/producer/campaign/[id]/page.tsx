"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/DashboardLayout";
import { apiFetch } from "@/lib/api";
import { RaverLoadingState } from "@/components/ui/RaverLoadingState";

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/producer/campaign/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setCampaign(data.data);
          } else {
            setError("Campaign not found in the neural archives.");
          }
        } else {
          setError("Failed to synchronize with synchronization matrix.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Neural thread synchronization failed.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchCampaign();
  }, [id]);

  if (isLoading) {
    return (
      <RaverLoadingState
        title="Accessing Auditing Matrix"
        description="Retrieving production dossiers and quality reports from the neural archives..."
      />
    );
  }

  if (error || !campaign) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center p-8">
          <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center border border-slate-100 mb-4">
            <Icons.Activity className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-2xl font-black text-[#01012A] tracking-tighter lowercase">{error || "Production Not Sourced"}</h2>
          <button
            onClick={() => router.push("/agents/producer")}
            className="h-12 px-8 bg-[#01012A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#01012A]/10 active:scale-95 transition-all"
          >
            Return to Orchestration Hub
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const brief = campaign.config?.brief || campaign.brief || {};
  const nodes = campaign.config?.nodes || campaign.nodes || {};
  const result = campaign.config?.result || campaign.result || {};
  const quality = result.quality_report || {};
  const campaignName = campaign.name || brief.business_name || "unnamed_production";
  const campaignId = campaign.id || campaign.campaign_id || id;

  const getNodeStatus = (nodeKey: string) => {
    const node = nodes[nodeKey];
    if (!node) return "pending";
    if (node.status === "completed" || node.status === "success") return "done";
    if (node.status === "running" || node.status === "processing" || node.status === "started") return "running";
    if (node.status === "failed" || node.error) return "failed";
    return "pending";
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `raver-production-${campaignId}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(url, '_blank');
    }
  };

  const steps = [
    { id: "generate_text", label: "Narrative Synthesis", icon: Icons.Mic },
    { id: "generate_image", label: "Visual Matrix", icon: Icons.Image },
    { id: "generate_voice", label: "Neural Voice", icon: Icons.AudioWave },
    { id: "generate_music", label: "Atmospheric Score", icon: Icons.AudioWave },
    { id: "render", label: "Neural Rendering", icon: Icons.Video },
    { id: "score_quality", label: "Quality Audit", icon: Icons.Success },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50/10 relative overflow-hidden flex flex-col">

        {/* Persistent Header Section */}
        <div className="px-6 md:px-10 py-6 md:py-10 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-8 md:gap-10 shrink-0 bg-white relative z-20">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 overflow-hidden">
            <button
              onClick={() => router.push("/agents/producer")}
              className="w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-100 transition-all active:scale-90 shrink-0 self-start md:self-auto"
            >
              <Icons.ArrowLeft className="w-5 h-5 text-[#01012A]" />
            </button>
            <div className="flex flex-col gap-1 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 overflow-hidden">
                <h1 className="text-[24px] sm:text-[30px] md:text-[34px] font-black text-[#121212] tracking-tighter lowercase leading-tight truncate max-w-full">
                  {campaignName}
                </h1>
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm w-fit shrink-0",
                  campaign.status === "delivered" || campaign.status === "ready_for_human_review" || campaign.status === "completed"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100/50"
                    : "bg-slate-50 text-slate-500 border-slate-100"
                )}>
                  {campaign.status}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">
                <span className="truncate">CAMPAIGN_ID: {campaignId}</span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-200" />
                <span className="truncate">Neural Thread: {new Date(campaign.createdAt || campaign.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button className="h-12 md:h-14 px-6 md:px-8 bg-white border border-slate-200 text-[#01012A] rounded-[20px] md:rounded-[22px] text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all hover:bg-slate-50 active:scale-95">
              Download PDF
            </button>
          </div>
        </div>

        {/* Main Body Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-8 md:gap-12 pb-32">

            {/* HERO: Cinema Mode Video Showcase */}
            {result.video_url && (
              <div className="bg-[#01012A] rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl shadow-black/20 relative group h-[60vh] sm:h-[70vh] lg:h-[80vh] transition-all duration-700">

                {/* Immersive Hover Overlays */}
                <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/80 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-start justify-between p-8 md:p-12 pointer-events-none">
                  <div className="flex flex-col gap-2 pointer-events-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/70">Master Production Render</span>
                    </div>
                    <h2 className="text-[20px] md:text-[32px] font-black text-white tracking-tighter lowercase leading-none mt-1 shadow-black/20 drop-shadow-lg">Finalized Synthesis Output</h2>
                  </div>

                  <div className="flex gap-4 pointer-events-auto">
                    <button
                      onClick={() => handleDownload(result.video_url)}
                      className="w-14 h-14 bg-white/10 backdrop-blur-xl text-white border border-white/20 rounded-[20px] flex items-center justify-center hover:bg-white/30 transition-all active:scale-90"
                      title="Download Master"
                    >
                      <Icons.Download className="w-6 h-6" />
                    </button>
                    <a
                      href={result.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-14 px-8 bg-white text-[#01012A] rounded-[20px] text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20"
                    >
                      <Icons.ExternalLink className="w-4 h-4" />
                      External
                    </a>
                  </div>
                </div>

                {/* Bottom Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/80 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="h-full w-full bg-slate-900 relative flex items-center justify-center overflow-hidden">
                  {/* Background ambiance for any format */}
                  <div className="absolute inset-0 blur-[100px] opacity-40 transform scale-150 pointer-events-none">
                    <video
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={result.video_url} type="video/mp4" />
                    </video>
                  </div>

                  <div className={cn(
                    "relative z-10 h-full flex items-center justify-center py-6 sm:py-10 md:py-16 w-full",
                    brief.format === "9:16" ? "max-w-[500px]" : brief.format === "1:1" ? "max-w-[70vh]" : "max-w-6xl px-4"
                  )}>
                    <video
                      controls
                      autoPlay
                      loop
                      playsInline
                      className={cn(
                        "max-h-full rounded-[24px] md:rounded-[40px] shadow-2xl border border-white/10 object-contain h-full bg-black/60 transition-transform duration-700 group-hover:scale-[1.01]",
                        brief.format === "9:16" ? "aspect-9/16" :
                          brief.format === "1:1" ? "aspect-square" :
                            "aspect-video"
                      )}
                    >
                      <source src={result.video_url} type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            )}

            {/* Top Row: Visual Matrix & Node Intel */}
            <div className="grid grid-cols-12 gap-6 md:gap-10">
              {/* Assets Showcase */}
              <div className="col-span-12 lg:col-span-8 bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 border border-slate-100 shadow-sm flex flex-col gap-8 md:gap-10 overflow-hidden">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-[18px] md:rounded-[20px] flex items-center justify-center border border-slate-100">
                    <Icons.Image className="w-5 h-5 md:w-6 md:h-6 text-[#01012A]" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <h4 className="text-lg md:text-xl font-black text-[#01012A] tracking-tighter lowercase leading-none truncate">visual assets_matrix</h4>
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-300 mt-2 truncate">Neural Sequence</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {result.scene_images?.map((scene: any, idx: number) => (
                    <div
                      key={idx}
                      className="group bg-slate-50 rounded-[24px] md:rounded-[32px] overflow-hidden border border-slate-200/50 relative"
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={scene.image_url}
                          alt={`Scene ${scene.scene_id}`}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 md:p-8 flex flex-col justify-end">
                          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1 italic">Prompt_ID: {idx + 1}</span>
                          <p className="text-[10px] md:text-xs font-medium text-white/90 leading-relaxed italic line-clamp-4">
                            "{scene.prompt_used}"
                          </p>
                        </div>
                      </div>
                      <div className="p-4 md:p-6 bg-white border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-[#01012A] uppercase tracking-[0.2em]">Scene_0{scene.scene_id}</span>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-lg border border-emerald-100">completed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Orchestration & Tracking Intel */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 md:gap-10">
                {/* Neural Thread */}
                <div className="bg-linear-to-br from-[#01012A] to-[#2E2C66] rounded-[32px] md:rounded-[40px] p-8 md:p-10 text-white shadow-2xl shadow-[#01012A]/10 relative overflow-hidden group">
                  <h4 className="text-lg md:text-xl font-black tracking-tighter lowercase leading-none mb-8 md:mb-10 relative z-10 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    orchestration_thread
                  </h4>
                  <div className="flex flex-col gap-6 md:gap-8 relative z-10">
                    <div className="absolute left-[13.5px] top-6 bottom-6 w-px bg-white/10" />
                    {steps.map((step) => {
                      const status = getNodeStatus(step.id);
                      const isDone = status === "done";
                      const isRunning = status === "running";
                      const nodeData = nodes[step.id];
                      return (
                        <div key={step.id} className="flex gap-5 md:gap-6 group/node">
                          <div className="relative shrink-0">
                            <div className={cn(
                              "w-7 h-7 rounded-[10px] flex items-center justify-center transition-all duration-700 relative z-10",
                              isDone ? "bg-white text-[#01012A] shadow-[0_0_15px_rgba(255,255,255,0.3)]" :
                                isRunning ? "bg-white/20 text-white animate-pulse" :
                                  "bg-white/5 text-white/20 border border-white/5"
                            )}>
                              {isDone ? <Icons.Success className="w-3.5 h-3.5" /> :
                                isRunning ? <Icons.Loader className="w-3.5 h-3.5 animate-spin" /> :
                                  <div className="w-1 h-1 rounded-full bg-white/20" />}
                            </div>
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className={cn(
                              "text-[13px] md:text-[14px] font-bold tracking-tight truncate transition-colors duration-500",
                              isDone ? "text-white" : isRunning ? "text-white/80" : "text-white/30"
                            )}>
                              {step.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Implementation Meta */}
                <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 border border-slate-100 shadow-sm flex flex-col gap-8 md:gap-10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-[18px] flex items-center justify-center border border-slate-100">
                      <Icons.PenLine className="w-5 h-5 text-[#01012A]" />
                    </div>
                    <h4 className="text-lg md:text-xl font-black text-[#01012A] tracking-tighter lowercase leading-none truncate">intel_matrix</h4>
                  </div>
                  <div className="flex flex-col gap-5 md:gap-6">
                    {[
                      { label: "Target Profile", value: brief.target_audience || campaign.audience },
                      { label: "Visual Engine", value: brief.video_model || "Standard GPU Cluster" },
                      { label: "Platform Canvas", value: brief.format || campaign.format },
                    ].map((p, idx) => (
                      <div key={idx} className="flex flex-col gap-2">
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-300 pl-1">{p.label}</span>
                        <div className="p-4 md:p-5 bg-slate-50/50 rounded-2xl md:rounded-[24px] border border-slate-100/50">
                          <p className="text-[11px] md:text-[12px] font-bold text-[#121212] leading-tight line-clamp-2">{p.value || "Config Ready"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Dimensions Grid */}
            <div className="grid grid-cols-12 gap-6 md:gap-10">
              {/* Metrics Breakdown */}
              <div className="col-span-12 lg:col-span-8 bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 border border-slate-100 shadow-sm flex flex-col gap-8 md:gap-10 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-[18px] md:rounded-[20px] flex items-center justify-center border border-slate-100">
                      <Icons.Success className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-lg md:text-xl font-black text-[#01012A] tracking-tighter lowercase leading-none">dimension_breakdown</h4>
                      <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 mt-2">Weighted Audit Results</span>
                    </div>
                  </div>
                  <div className="flex items-center sm:items-end flex-row sm:flex-col justify-between sm:justify-start">
                    <span className="text-3xl md:text-4xl font-black text-[#01012A] tracking-tighter tabular-nums">{Math.round((quality.overall_score || 0) * 100)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {quality.dimension_details && Object.entries(quality.dimension_details).map(([key, dim]: any) => (
                    <div key={key} className="p-6 md:p-8 bg-slate-50/50 rounded-[24px] md:rounded-[32px] border border-slate-100/50 flex flex-col gap-5 hover:bg-white hover:border-slate-200 transition-all">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#01012A]">{key.replace('_', ' ')}</span>
                        <span className="text-xl md:text-2xl font-black text-[#01012A]/40 tabular-nums">{Math.round((dim.score || 0) * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent Audit Cluster */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 md:gap-10">
                <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 border border-slate-100 shadow-sm flex flex-col gap-8 md:gap-10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-[18px] flex items-center justify-center border border-slate-100">
                      <Icons.Shield className="w-5 h-5 text-[#01012A]" />
                    </div>
                    <h4 className="text-lg md:text-xl font-black text-[#01012A] tracking-tighter lowercase leading-none">auditing_agents</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quality.evaluator_models?.map((model: string, idx: number) => (
                      <div key={idx} className="px-3 md:px-4 py-1.5 md:py-2 bg-slate-900 text-white rounded-lg md:rounded-xl text-[9px] font-black uppercase tracking-[0.2em]">
                        {model}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 border border-slate-100 shadow-sm flex flex-col gap-8 md:gap-10 grow">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-[18px] flex items-center justify-center border border-slate-100">
                      <Icons.Rocket className="w-5 h-5 text-[#01012A]" />
                    </div>
                    <h4 className="text-lg md:text-xl font-black text-[#01012A] tracking-tighter lowercase leading-none truncate">master_assets</h4>
                  </div>
                  <div className="flex flex-col gap-4">
                    {result.video_url && <AssetLink label="Video Render" url={result.video_url} icon={Icons.Video} />}
                    {result.music_url && <AssetLink label="Ambient Score" url={result.music_url} icon={Icons.AudioWave} />}
                    {result.voiceover_url && <AssetLink label="Neural Voice" url={result.voiceover_url} icon={Icons.Mic} />}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function AssetLink({ label, url, icon: Icon }: any) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-4 bg-slate-50/50 border border-slate-100/50 rounded-[18px] md:rounded-[20px] flex items-center justify-between group hover:bg-white hover:border-[#01012A]/10 transition-all"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center border border-slate-100 shrink-0 group-hover:scale-110 transition-transform">
          <Icon className="w-4 h-4 text-[#01012A]" />
        </div>
        <span className="text-[11px] font-bold text-[#01012A] lowercase truncate">{label}</span>
      </div>
      <Icons.ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#01012A] transition-colors shrink-0" />
    </a>
  );
}
