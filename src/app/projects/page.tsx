"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import ProjectCard from "@/components/dashboard/ProjectCard";
import CreateCampaignModal from "@/components/studio/CreateCampaignModal";
import CampaignSelectionModal from "@/components/studio/CampaignSelectionModal";
import CampaignPreviewModal from "@/components/studio/CampaignPreviewModal";
import AIResponseModal from "@/components/studio/AIResponseModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { Icons } from "@/components/ui/icons";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Campaign {
  id?: string;
  title: string;
  status: string;
  image: string;
  sessionId?: string;
  videoUrl?: string | null;
  voiceoverUrl?: string | null;
  musicUrl?: string | null;
  script?: string | null;
  history?: { role: string; content: string }[] | null;
  briefDraft?: any;
  prompt?: string;
  message?: string;
  voiceId?: string | null;
  createdAt?: string;
}

function ProjectsContent() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [campaignToView, setCampaignToView] = useState<Campaign | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAIResponse, setShowAIResponse] = useState(false);
  const [aiResponseContent, setAiResponseContent] = useState("");
  const [initialUserPrompt, setInitialUserPrompt] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const router = useRouter();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      // 1. Fetch AI Director Sessions
      let allSessions: Campaign[] = [];
      try {
        const sessionRes = await apiFetch(`${API_BASE}/ai/director/sessions`);
        if (sessionRes.ok) {
          const sData = await sessionRes.json();
          const sessionsArray = Array.isArray(sData.data?.sessions) ? sData.data.sessions : sData.data;
          if (Array.isArray(sessionsArray)) {
            allSessions = sessionsArray.map((s: any) => ({
              id: s.campaign_id || s.id,
              sessionId: s.session_id || s.id,
              title: s.title || (s.brief_draft?.business_name ? `${s.brief_draft.business_name} Campaign` : `Session ${s.session_id || s.id}`),
              status: s.status || "queued",
              message: s.message,
              videoUrl: s.video_url,
              voiceoverUrl: s.voiceover_url,
              musicUrl: s.music_url,
              script: s.script,
              history: s.history,
              briefDraft: s.brief_draft,
              prompt: s.prompt,
              voiceId: s.voice || s.voice_id || s.production?.voice || s.brief_draft?.voice,
              image: "/assets/hashtag-campaign.jpg",
              createdAt: s.created_at
            }));
          }
        }
      } catch (err) {
        console.warn("Sessions fetch failed:", err);
      }

      // 2. Sort by creation date
      const sorted = allSessions.sort((a, b) => {
        const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tB - tA;
      });

      setCampaigns(sorted.filter(c => c.status));
    } catch (err) {
      console.error("Critical error in fetchCampaigns:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync Ref for polling
  const campaignsRef = useRef<Campaign[]>(campaigns);
  useEffect(() => {
    campaignsRef.current = campaigns;
  }, [campaigns]);

  // Failure tracking for sessions to prevent infinite polling
  const sessionFailuresRef = useRef<Record<string, number>>({});

  // Polling Effect for running pipelines
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const poll = async () => {
      const currentCampaigns = campaignsRef.current;
      const activeStatuses = ["queued", "in_production", "pipeline_running", "In Production", "processing", "rendering"];
      const terminalStatuses = ["completed", "Ready", "delivered", "failed", "ready_for_human_review", "approved"];

      const polls = currentCampaigns.filter(c => {
        if (!c.sessionId) return false;
        const status = c.status?.toLowerCase() || "";
        const isTerminal = terminalStatuses.some(s => status.includes(s.toLowerCase()));
        const isActive = activeStatuses.some(s => status.includes(s.toLowerCase())) || (!isTerminal && status !== "");
        const failureCount = sessionFailuresRef.current[c.sessionId] || 0;
        return isActive && !isTerminal && failureCount < 5;
      });
      
      if (polls.length > 0) {
        let newCampaigns = [...currentCampaigns];
        let hasChanges = false;

        for (const c of polls) {
          if (!c.sessionId) continue;
          try {
            const res = await apiFetch(`${API_BASE}/ai/director/session/${c.sessionId}/update`);
            if (res.ok) {
              const resData = await res.json();
              const updateData = resData.data;
              sessionFailuresRef.current[c.sessionId] = 0;

              if (updateData) {
                const index = newCampaigns.findIndex(vid => vid.sessionId === c.sessionId);
                if (index !== -1) {
                  if (
                    newCampaigns[index].status !== updateData.status || 
                    newCampaigns[index].message !== updateData.message || 
                    newCampaigns[index].videoUrl !== updateData.video_url
                  ) {
                    newCampaigns[index] = {
                      ...newCampaigns[index],
                      status: updateData.status,
                      message: updateData.message,
                      videoUrl: updateData.video_url || newCampaigns[index].videoUrl,
                      voiceoverUrl: updateData.voiceover_url || newCampaigns[index].voiceoverUrl,
                      musicUrl: updateData.music_url || newCampaigns[index].musicUrl,
                      script: updateData.script || newCampaigns[index].script,
                      voiceId: updateData.voice || updateData.voice_id || updateData.brief_draft?.voice || newCampaigns[index].voiceId
                    };
                    hasChanges = true;
                  }
                }
              }
            } else if (res.status === 404) {
              sessionFailuresRef.current[c.sessionId] = (sessionFailuresRef.current[c.sessionId] || 0) + 1;
            }
          } catch (e) {
            sessionFailuresRef.current[c.sessionId] = (sessionFailuresRef.current[c.sessionId] || 0) + 1;
          }
        }
        if (hasChanges) setCampaigns(newCampaigns);
      }
      timeoutId = setTimeout(poll, 5000);
    };

    poll();
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDeleteCampaign = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCampaign = async () => {
    if (!campaignToDelete) return;
    setIsDeleting(true);
    try {
      if (campaignToDelete.id) {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        await apiFetch(`${API_BASE}/campaigns/${campaignToDelete.id}`, { method: "DELETE" });
      }
      setCampaigns(prev => prev.filter(c => c.id !== campaignToDelete.id && c.sessionId !== campaignToDelete.sessionId));
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCampaigns = campaigns.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-[16px] p-[16px] bg-[#FFFFFF] min-h-screen border-[0.35px] border-[#0000001A] rounded-[12px]">
        {/* Header Section */}
        <div className="flex items-center justify-between rounded-[12px]">
          <div className="flex flex-col gap-[2px]">
            <h1 className="text-[30px] font-bold text-[#121212]">My Projects</h1>
            <p className="text-[16px] text-[#4F4F4F] font-regular">
              Manage and organize your creative projects and AI campaigns
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-[320px]">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input 
                type="text" 
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-[14px] focus:outline-none focus:border-[#02022C] transition-all shadow-sm"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 bg-linear-to-r from-[#01012A] to-[#2E2C66] text-white rounded-xl text-[14px] font-bold shadow-lg shadow-[#01012A]/10 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Icons.Plus className="w-4 h-4" /> Create New Project
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-[16px] bg-[#FFFFFF] rounded-[12px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[400px] gap-3">
              <Icons.Loader className="w-8 h-8 animate-spin text-[#02022C]" />
              <p className="text-slate-400 font-medium">Fetching your projects...</p>
            </div>
          ) : filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] w-full">
              {filteredCampaigns.map((campaign, i) => {
                // Map campaign data to ProjectCard props
                const createdAt = campaign.createdAt ? new Date(campaign.createdAt) : new Date();
                const diffTime = Math.abs(new Date().getTime() - createdAt.getTime());
                const hours = Math.floor(diffTime / (1000 * 60 * 60));
                const timeStr = hours > 24 ? `${Math.floor(hours / 24)} days` : `${hours} hours`;

                return (
                  <ProjectCard 
                    key={campaign.sessionId || campaign.id || i}
                    title={campaign.title}
                    image={campaign.image || "/assets/hashtag-campaign.jpg"}
                    time={timeStr}
                    members={3} // Mocked members count
                    status={campaign.status}
                    message={campaign.message}
                    videoUrl={campaign.videoUrl}
                    onPreview={() => {
                      const hasBrief = Object.keys(campaign.briefDraft || {}).length > 0;
                      if (!hasBrief) {
                        // Open Consultation Chat
                        const history = campaign.history || [];
                        const userMsg = history.find(m => m.role === "user")?.content || campaign.prompt || "Starting consultation...";
                        const aiMsg = history.find(m => m.role === "assistant" || m.role === "ai")?.content || campaign.message || "How can I help you today?";
                        
                        setInitialUserPrompt(userMsg);
                        setAiResponseContent(aiMsg);
                        setCurrentSessionId(campaign.sessionId || "");
                        setSelectedCampaign(campaign);
                        setShowAIResponse(true);
                      } else {
                        // Open Asset Preview
                        setCampaignToView(campaign);
                        setIsPreviewOpen(true);
                      }
                    }}
                    onHistory={() => {
                      setCampaignToView(campaign);
                      setIsSelectionModalOpen(true);
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-[24px] gap-4">
              <div className="p-4 bg-slate-50 rounded-full">
                <Icons.Activity className="w-10 h-10 text-slate-300" />
              </div>
              <div className="text-center">
                <h3 className="text-[18px] font-bold text-slate-600">No projects found</h3>
                <p className="text-slate-400 text-[14px]">Try adjusting your search or start a new campaign to see it here.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2.5 bg-linear-to-r from-[#01012A] to-[#2E2C66] text-white rounded-xl text-[14px] font-bold hover:opacity-90 transition-all shadow-lg active:scale-95"
              >
                Preview
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals Integration */}
      <CreateCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCampaigns}
      />

      <CampaignSelectionModal 
        isOpen={isSelectionModalOpen}
        onClose={() => {
          setIsSelectionModalOpen(false);
          setCampaignToView(null);
        }}
        campaigns={campaigns}
        onSelect={() => {}} // Could be used to highlight a campaign
        onCreateNew={() => {
          setIsSelectionModalOpen(false);
          setIsModalOpen(true);
        }}
        initialSelectedCampaign={campaignToView}
      />

      <CampaignPreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setCampaignToView(null);
        }}
        campaignData={campaignToView ? {
          title: campaignToView.title,
          session_id: campaignToView.sessionId,
          status: campaignToView.status,
          message: campaignToView.message,
          video_url: campaignToView.videoUrl,
          voiceover_url: campaignToView.voiceoverUrl,
          music_url: campaignToView.musicUrl,
          script: campaignToView.script,
          history: campaignToView.history,
          prompt: campaignToView.prompt,
          campaign_id: campaignToView.id,
          voice_id: campaignToView.voiceId
        } : null}
        showHistory={true}
      />

      <AIResponseModal 
        isOpen={showAIResponse}
        onClose={() => {
          setShowAIResponse(false);
          setAiResponseContent("");
          setInitialUserPrompt("");
          setCurrentSessionId("");
          setSelectedCampaign(null);
        }}
        initialUserMessage={initialUserPrompt}
        initialAIResponse={aiResponseContent}
        sessionId={currentSessionId}
        initialHistory={selectedCampaign?.history || []}
        selectedCampaign={selectedCampaign}
        onCampaignStart={() => fetchCampaigns()}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteCampaign}
        title="Delete Project"
        message={`Are you sure you want to delete "${campaignToDelete?.title}"? This will permanently remove all associated assets.`}
        confirmText="Delete Project"
        variant="danger"
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
