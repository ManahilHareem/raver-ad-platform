"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import StudioHero from "@/components/studio/StudioHero";
import CampaignSelectionModal from "@/components/studio/CampaignSelectionModal";
import CampaignCard from "@/components/studio/CampaignCard";
import ProductionPipeline from "@/components/studio/ProductionPipeline";
import CreateCampaignModal from "@/components/studio/CreateCampaignModal";
import AIResponseModal from "@/components/studio/AIResponseModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { Icons } from "@/components/ui/icons";
import { getToken } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { cn, enrichMessageWithCampaign } from "@/lib/utils";

/*
### Custom Icon Integration
- Added `Sent` and `Mic` icons to [custom-icons.tsx](file:///Users/muhammadmaaz/Documents/GitHub/Ravi%20AI%20Frontend/src/components/ui/custom-icons.tsx).
- Added `Success` icon (based on `Icon.svg`) to [custom-icons.tsx](file:///Users/muhammadmaaz/Documents/GitHub/Ravi%20AI%20Frontend/src/components/ui/custom-icons.tsx), which is a green circular checkmark asset.
- Updated [icons.tsx](file:///Users/muhammadmaaz/Documents/GitHub/Ravi%20AI%20Frontend/src/components/ui/icons.tsx) to map `Icons.Success` to this new custom asset.
- These icons are automatically available for use throughout the application.
*/

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
  message?: string;
  audience?: string;
  objective?: string;
  format?: string;
  duration?: string;
  colorScheme?: string;
  platforms?: string[];
  tones?: string[];
  visualStyles?: string[];
  createdAt?: string;
}




function StudioPageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>();
  const [Videos, setVideos] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [campaignToView, setCampaignToView] = useState<Campaign | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showAIResponse, setShowAIResponse] = useState(false);
  const [aiResponseContent, setAiResponseContent] = useState("");
  const [initialUserPrompt, setInitialUserPrompt] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchCampaigns = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      // 1. Fetch campaigns from primary DB
      const res = await apiFetch(`${API_BASE}/campaigns`);
      let mappedCampaigns: Campaign[] = [];
      
      if (res.ok) {
        const responseData = await res.json();
        if (responseData.success && responseData.data && (Array.isArray(responseData.data) || typeof responseData.data === 'object')) {
          const rawData = Array.isArray(responseData.data) ? responseData.data : [responseData.data];
          console.log(`Fetched ${rawData.length} campaigns from primary DB`, rawData);
          
          mappedCampaigns = rawData.map((c: any) => {
            // Robust config parsing
            let config = c.config;
            if (typeof config === "string") {
              try { config = JSON.parse(config); } catch (e) { console.warn("Failed to parse config string", e); }
            }
            
            const m = {
              id: c.id?.toString() || c._id?.toString(),
              title: c.name || c.title || "Untitled",
              status: c.status || "Ready",
              image: "/assets/hashtag-campaign.jpg",
              sessionId: c.session_id || c.sessionId,
              videoUrl: c.video_url || c.videoUrl,
              voiceoverUrl: c.voiceover_url || c.voiceoverUrl,
              musicUrl: c.music_url || c.musicUrl,
              script: c.script,
              message: c.message,
              audience: config?.audience || c.audience,
              objective: config?.objective || c.objective,
              format: config?.format || c.format,
              duration: config?.duration || c.duration,
              colorScheme: config?.color_scheme || config?.colorScheme || c.colorScheme,
              platforms: config?.platforms || (Array.isArray(c.platforms) && c.platforms.length > 0 ? c.platforms : (c.platform ? [c.platform] : [])),
              tones: config?.tones || c.tones,
              visualStyles: config?.visual_style || config?.visualStyles || c.visualStyles,
              createdAt: c.createdAt || c.created_at,
            };
            return m;
          });
          console.log("Mapped primary campaigns:", mappedCampaigns);
        }
      }

      // 2. Fetch Sessions from AI Director
      let allSessions: Campaign[] = [];
      try {
        const sessionRes = await apiFetch(`${API_BASE}/ai/director/sessions`, {
          headers: { "accept": "*/*" }
        });
        
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          if (sessionData.success && (Array.isArray(sessionData.data?.sessions) || Array.isArray(sessionData.data))) {
            const sessionsArray = Array.isArray(sessionData.data?.sessions) ? sessionData.data.sessions : sessionData.data;
            console.log(`Fetched ${sessionsArray.length} sessions from AI Director`);
            allSessions = sessionsArray.map((s: any) => {
              const brief = s.brief_draft || {};
              return {
                id: s.campaign_id || s.id,
                sessionId: s.session_id || s.id,
                title: s.title || (brief.business_name ? `${brief.business_name} Campaign` : `Session ${s.session_id || s.id}`),
                status: s.status || "queued",
                message: s.message,
                videoUrl: s.video_url,
                voiceoverUrl: s.voiceover_url,
                musicUrl: s.music_url,
                script: s.script,
                audience: brief.audience,
                objective: brief.objective,
                format: brief.format,
                duration: brief.duration,
                colorScheme: brief.color_scheme || brief.colorScheme,
                platforms: brief.platforms || (brief.platform ? [brief.platform] : []),
                tones: brief.tones,
                visualStyles: brief.visual_style || brief.visualStyles,
                image: "/assets/hashtag-campaign.jpg",
                createdAt: s.created_at
              };
            });
          }
        }
      } catch (err) {
        console.warn("Sessions fetch failed:", err);
      }

      // 3. Fetch AI Director Insights
      try {
        const insightRes = await apiFetch(`${API_BASE}/ai/insights/director`);
        if (insightRes.ok) {
          const insightData = await insightRes.json();
          if (insightData.success && insightData.data?.metrics) {
            setInsights(insightData.data.metrics);
          }
        }
      } catch (err) {
        console.error("Failed to fetch insights:", err);
      }

      // 4. Consolidate and update initial state (progressive loading)
      const initialVideos = [...allSessions];
      const activePrimary = mappedCampaigns.filter(c => 
        ["in_production", "queued", "In Production", "ready_for_human_review", "approved", "delivered", "Ready"].includes(c.status)
      );
      
      activePrimary.forEach(c => {
        if (!initialVideos.some(v => v.sessionId === c.sessionId || (v.id && c.id && v.id === c.id))) {
          initialVideos.unshift(c);
        }
      });

      const sortLatest = (list: Campaign[]) => {
        return list
          .sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            if (isNaN(timeA) && isNaN(timeB)) return 0;
            if (isNaN(timeA)) return 1;
            if (isNaN(timeB)) return -1;
            return timeB - timeA;
          });
      };

      // Filter out any sessions without a status (invalid or non-synced)
      const validInitialVideos = initialVideos.filter(v => v.status);
      setVideos(sortLatest(validInitialVideos));
      setCampaigns(mappedCampaigns);

      // 4. One-by-one status check for active sessions (deep check)
      const terminalStatuses = ["completed", "Ready", "delivered", "failed", "ready_for_human_review", "approved"];
      const activeCandidates = allSessions
        .filter(s => {
          const status = s.status?.toLowerCase() || "";
          return !terminalStatuses.some(ts => status.includes(ts.toLowerCase()));
        })
        .sort((a, b) => {
          const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tB - tA;
        })
        .slice(0, 5);

      if (activeCandidates.length > 0) {
        const updatedSessions = await Promise.all(activeCandidates.map(async (s) => {
          try {
            const updateRes = await apiFetch(`${API_BASE}/ai/director/session/${s.sessionId}/update`);
            if (updateRes.ok) {
              const uData = await updateRes.json();
              if (uData.success && uData.data) {
                return {
                  ...s,
                  status: uData.data.status,
                  message: uData.data.message,
                  videoUrl: uData.data.video_url || s.videoUrl,
                  voiceoverUrl: uData.data.voiceover_url || s.voiceoverUrl,
                  musicUrl: uData.data.music_url || s.musicUrl,
                  script: uData.data.script || s.script
                };
              }
            }
          } catch (e) {
            console.warn(`Initial deep check failed for session ${s.sessionId}:`, e);
          }
          return s;
        }));

        // Merge updated data back into final view
        setVideos(prev => {
          const updatedList = prev.map(v => {
            const up = updatedSessions.find(u => u.sessionId === v.sessionId);
            return up ? { ...v, ...up } : v;
          });
          return sortLatest(updatedList);
        });
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') return;
      console.error("Critical error in fetchCampaigns:", err);
    }
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setIsDeleteModalOpen(true);
  };

  const handleViewDetails = (campaign: Campaign) => {
    setCampaignToView(campaign);
    setIsSelectionModalOpen(true);
  };

  const handlePromptSend = async (prompt: string) => {
    if (isSending) return;
    setIsSending(true);

    const sessionId = Date.now().toString();
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    // Enrich message with campaign context if available
    const enrichedMessage = enrichMessageWithCampaign(prompt, selectedCampaign);

    try {
      // 1. Call AI Director API
      const response = await apiFetch(`${API_BASE}/ai/director/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { "Authorization": `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: enrichedMessage,
          professional_name: "", // Using name from UI
          tag: "director"
        }),
      });

      if (!response.ok) throw new Error("Failed to communicate with AI Director");
      const data = await response.json();
      const aiResponse = data?.data?.response || data?.response || data?.message || "I've analyzed your requirements. Let's start building your campaign.";

      // 2. Persist to chat history in localStorage (matching ChatPage structure)
      const userMessage = {
        id: Date.now().toString(),
        role: "user",
        content: enrichedMessage, // Saving the full enriched prompt for transparency
        timestamp: new Date().toISOString()
      };

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      const newSession = {
        id: sessionId,
        title: prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt,
        messages: [userMessage, aiMessage],
        urls: [],
        tag: "director",
        createdAt: new Date().toISOString()
      };

      const existingSessionsStr = localStorage.getItem("chat_sessions");
      let existingSessions = [];
      if (existingSessionsStr) {
        try {
          existingSessions = JSON.parse(existingSessionsStr);
        } catch (e) {
          console.error("Failed to parse existing sessions", e);
        }
      }

      localStorage.setItem("chat_sessions", JSON.stringify([newSession, ...existingSessions]));

      // 3. Show local AI response instead of redirecting
      setInitialUserPrompt(enrichedMessage);
      setAiResponseContent(aiResponse);
      setCurrentSessionId(sessionId);
      setShowAIResponse(true);

      // 4. Update Videos if a campaign was created
      const campaignStatus = data?.data?.campaign_status;
      if (campaignStatus === "queued" || campaignStatus === "in_production") {
        const brief = data?.data?.brief_draft || {};
        const title = brief.business_name ? `${brief.business_name} Campaign` : prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt;
        
        setVideos(prev => [{
          id: data?.data?.campaign_id,
          sessionId: sessionId,
          title: title,
          status: campaignStatus,
          image: "/assets/hashtag-campaign.jpg"
        }, ...prev]);
      }

      setIsSending(false);
    } catch (err) {
      console.error("AI Director Error:", err);
      alert("Failed to connect to AI Director. Please ensure the backend is running.");
      setIsSending(false);
    }
  };

  const confirmDeleteCampaign = async () => {
    if (!campaignToDelete) return;
    
    setIsDeleting(true);
    try {
      if (campaignToDelete.id) {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await apiFetch(`${API_BASE}/campaigns/${campaignToDelete.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete campaign");
      }
      
      // Update local state regardless of whether it had an ID (for mock data)
      setCampaigns(prev => prev?.filter(c => (c.id && campaignToDelete.id && c.id !== campaignToDelete.id) || (c.title !== campaignToDelete.title)));
      setVideos(prev => prev.filter(v => (v.id && campaignToDelete.id && v.id !== campaignToDelete.id) || (v.title !== campaignToDelete.title)));
      
      if (selectedCampaign?.title === campaignToDelete.title) {
        setSelectedCampaign(null);
      }
      setIsDeleteModalOpen(false);
      setCampaignToDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete campaign. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Ref for Videos to avoid stale closures in polling
  const videosRef = useRef<Campaign[]>(Videos);
  useEffect(() => {
    videosRef.current = Videos;
  }, [Videos]);

  // Failure tracking for sessions to prevent infinite polling on non-existent IDs
  const sessionFailuresRef = useRef<Record<string, number>>({});

  // Polling Effect for running pipelines
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const poll = async () => {
      const currentVideos = videosRef.current;
      
      // Specifically target active statuses for polling
      const activeStatuses = ["queued", "in_production", "pipeline_running", "In Production", "processing", "rendering"];
      const terminalStatuses = ["completed", "Ready", "delivered", "failed", "ready_for_human_review", "approved"];

      const polls = currentVideos.filter(v => {
        if (!v.sessionId) return false;
        
        const status = v.status?.toLowerCase() || "";
        const isTerminal = terminalStatuses.some(s => status.includes(s.toLowerCase()));
        const isActive = activeStatuses.some(s => status.includes(s.toLowerCase())) || (!isTerminal && status !== "");
        
        // Don't poll if it's already terminal or if it's failed too many times
        const failureCount = sessionFailuresRef.current[v.sessionId] || 0;
        return isActive && !isTerminal && failureCount < 5;
      });
      
      if (polls.length > 0) {
        let newVideos = [...currentVideos];
        let hasChanges = false;

        for (const v of polls) {
          if (!v.sessionId) continue;

          try {
            const res = await apiFetch(`${API_BASE}/ai/director/session/${v.sessionId}/update`, {
              headers: { "accept": "*/*" }
            });

            if (res.ok) {
              const resData = await res.json();
              const updateData = resData.data;
              
              // Reset failures on success
              sessionFailuresRef.current[v.sessionId] = 0;

              if (updateData) {
                const index = newVideos.findIndex(vid => vid.sessionId === v.sessionId);
                if (index !== -1) {
                  if (
                    newVideos[index].status !== updateData.status || 
                    newVideos[index].message !== updateData.message || 
                    newVideos[index].videoUrl !== updateData.video_url
                  ) {
                    newVideos[index] = {
                      ...newVideos[index],
                      status: updateData.status,
                      message: updateData.message,
                      videoUrl: updateData.video_url || newVideos[index].videoUrl,
                      voiceoverUrl: updateData.voiceover_url || newVideos[index].voiceoverUrl,
                      musicUrl: updateData.music_url || newVideos[index].musicUrl,
                      script: updateData.script || newVideos[index].script
                    };
                    hasChanges = true;
                  }
                }
              }
            } else if (res.status === 404) {
              // ID doesn't exist on backend (e.g. mock or ancient), increment failure
              sessionFailuresRef.current[v.sessionId] = (sessionFailuresRef.current[v.sessionId] || 0) + 1;
            }
          } catch (e) {
            // Network error (Failed to fetch)
            const isNetworkError = e instanceof TypeError && e.message.includes("fetch");
            if (isNetworkError) {
              console.warn(`Polling network issue for ${v.sessionId}. Backend might be down.`);
            } else {
              console.error("Polling error for", v.sessionId, e);
            }
            // Increment failure count for this session
            sessionFailuresRef.current[v.sessionId] = (sessionFailuresRef.current[v.sessionId] || 0) + 1;
          }
        }
        
        if (hasChanges) {
          setVideos(newVideos);
        }
      }

      timeoutId = setTimeout(poll, 5000);
    };

    poll();

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setIsModalOpen(true);
      // Clean up the URL after opening the modal
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("create");
      const newUrl = `${window.location.pathname}${newParams.toString() ? `?${newParams.toString()}` : ""}`;
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-[12px]  mx-auto p-4 lg:p-6">
        {/* Hero Section */}
        <StudioHero
          onCreateClick={() => setIsModalOpen(true)}
          campaigns={campaigns}
          selectedCampaign={selectedCampaign}
          onCampaignSelect={setSelectedCampaign}
          onCampaignDelete={handleDeleteCampaign}
          onViewDetails={handleViewDetails}
          onSend={handlePromptSend}
          isSending={isSending}
        />

        {/* Active Campaigns Section */}
        <div className="flex flex-col gap-[16px] bg-[#FFFFFF] border-[0.35px] border-[#0000001A] rounded-[12px] p-[16px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[#121212]">
              Active Campaigns
            </h2>
            <button 
              onClick={() => router.push("/studio/all-campaigns")}
              className="px-3 py-1.5 rounded-lg text-[13px] font-bold text-[#121212] transition-all flex items-center gap-1.5 group hover:bg-gradient-to-r hover:from-[#01012A] hover:to-[#2E2C66] hover:text-white active:scale-95"
            >
              View More 
              <Icons.ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px]">
            {Videos.filter(v => v.status).length > 0 ? (
              Videos.filter(v => v.status).slice(0, 3).map((campaign, i) => (
                <CampaignCard 
                  key={campaign.sessionId || campaign.id || i} 
                  {...campaign} 
                  videoUrl={campaign.videoUrl}
                  voiceover_url={campaign.voiceoverUrl}
                  music_url={campaign.musicUrl}
                  onDelete={() => handleDeleteCampaign(campaign)}
                />
              ))
            ) : (
              <div className="col-span-full h-[150px] flex flex-col items-center justify-center bg-[#F8FAFC] border border-dashed border-slate-200 rounded-[12px] gap-2">
                <Icons.Activity className="w-8 h-8 text-slate-300" />
                <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">No active campaigns right now</p>
              </div>
            )}
          </div>
        </div>

        {/* Production Pipeline */}
        <div className="flex flex-col gap-4 bg-[#FFFFFF] border-[0.35px] border-[#0000001A] rounded-[12px] p-[16px]">
          <h2 className="text-[18px] font-medium text-[#121212]">
            AI Production Pipeline
          </h2>
          <ProductionPipeline 
            status={Videos[0]?.status || "Draft"} 
            message={Videos[0]?.message || ""} 
            videoUrl={Videos[0]?.videoUrl}
          />
        </div>

        {/* Insights Section */}
        <div className="flex flex-col gap-4 bg-[#FFFFFF] border-[0.35px] border-[#0000001A] rounded-[12px] p-[16px]">
          <h2 className="text-[18px] font-medium text-[#121212]">Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {insights.map((insight, i) => (
              <div
                key={i}
                className="bg-[#F8F8F8] p-5 rounded-[8px] border-[0.35px] border-[#0000001A] shadow-sm flex flex-col gap-2"
              >
                <span className="text-[12px] text-[#4F4F4F] font-medium">
                  {insight.label}
                </span>
                <div className="flex items-end justify-between">
                  <span className="text-[24px] font-bold text-[#02022C] leading-none">
                    {insight.value}
                  </span>
                  {insight.change && (
                    <span
                      className={cn(
                        "text-[12px] font-semibold mb-1 text-[#02022C]",
                      )}
                    >
                      {insight.change}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="fixed bottom-6 right-8 w-[60px] h-[60px] bg-gradient-to-r from-[#01012A] to-[#2E2C66] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-40 shadow-[#01012A]/20">
        <Icons.MessageCircle className="w-6 h-6" />
      </button>

      <CreateCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCampaigns}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteCampaign}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${campaignToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />

      <CampaignSelectionModal 
        isOpen={isSelectionModalOpen}
        onClose={() => {
          setIsSelectionModalOpen(false);
          setCampaignToView(null);
        }}
        campaigns={campaigns || []}
        onSelect={(c: Campaign) => setSelectedCampaign(c)}
        onCreateNew={() => {
          setIsSelectionModalOpen(false);
          setIsModalOpen(true);
        }}
        initialSelectedCampaign={campaignToView}
      />

      <CampaignSelectionModal 
        isOpen={isSelectionModalOpen}
        onClose={() => {
          setIsSelectionModalOpen(false);
          setCampaignToView(null);
        }}
        campaigns={campaigns || []}
        onSelect={(c: Campaign) => setSelectedCampaign(c)}
        onCreateNew={() => {
          setIsSelectionModalOpen(false);
          setIsModalOpen(true);
        }}
        initialSelectedCampaign={campaignToView}
      />

      <AIResponseModal 
        isOpen={showAIResponse}
        onClose={() => {
          setShowAIResponse(false);
          setAiResponseContent("");
          setInitialUserPrompt("");
          setCurrentSessionId("");
        }}
        initialUserMessage={initialUserPrompt}
        initialAIResponse={aiResponseContent}
        sessionId={currentSessionId}
        selectedCampaign={selectedCampaign}
        onCampaignStart={(campaign) => {
          setVideos(prev => [campaign, ...prev]);
        }}
      />
    </DashboardLayout>
  );
}

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="p-6">Loading studio...</div>
        </DashboardLayout>
      }
    >
      <StudioPageContent />
    </Suspense>
  );
}
