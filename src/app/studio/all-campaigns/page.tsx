"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import CampaignCard from "@/components/studio/CampaignCard";
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
  message?: string;
  createdAt?: string;
}

function AllCampaignsContent() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      // 1. Primary DB Campaigns
      const res = await apiFetch(`${API_BASE}/campaigns`);
      let mappedPrimary: Campaign[] = [];
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          mappedPrimary = data.data.map((c: any) => ({
            id: c.id?.toString() || c._id?.toString(),
            title: c.name,
            status: c.status || "Ready",
            image: "/assets/hashtag-campaign.jpg",
            sessionId: c.session_id || c.sessionId,
            videoUrl: c.video_url || c.videoUrl,
            voiceoverUrl: c.voiceover_url || c.voiceoverUrl,
            musicUrl: c.music_url || c.musicUrl,
            script: c.script,
            message: c.message,
            createdAt: c.createdAt,
          }));
        }
      }

      // 2. AI Director Sessions
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
              image: "/assets/hashtag-campaign.jpg",
              createdAt: s.created_at
            }));
          }
        }
      } catch (err) {
        console.warn("Sessions fetch failed:", err);
      }

      // 3. Consolidate and Sort
      const combined = [...allSessions];
      mappedPrimary.forEach(c => {
        if (!combined.some(v => v.sessionId === c.sessionId || (v.id && c.id && v.id === c.id))) {
          combined.unshift(c);
        }
      });

      const sorted = combined.sort((a, b) => {
        const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tB - tA;
      });

      // Filter out null statuses as per user request
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

  // Failure tracking for sessions to prevent infinite polling on non-existent IDs
  const sessionFailuresRef = useRef<Record<string, number>>({});

  // Polling Effect for running pipelines
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const poll = async () => {
      const currentCampaigns = campaignsRef.current;
      
      // Specifically target active statuses for polling
      const activeStatuses = ["queued", "in_production", "pipeline_running", "In Production", "processing", "rendering"];
      const terminalStatuses = ["completed", "Ready", "delivered", "failed", "ready_for_human_review", "approved"];

      const polls = currentCampaigns.filter(c => {
        if (!c.sessionId) return false;
        
        const status = c.status?.toLowerCase() || "";
        const isTerminal = terminalStatuses.some(s => status.includes(s.toLowerCase()));
        const isActive = activeStatuses.some(s => status.includes(s.toLowerCase())) || (!isTerminal && status !== "");
        
        // Don't poll if it's already terminal or if it's failed too many times
        const failureCount = sessionFailuresRef.current[c.sessionId] || 0;
        return isActive && !isTerminal && failureCount < 5;
      });
      
      if (polls.length > 0) {
        let newCampaigns = [...currentCampaigns];
        let hasChanges = false;

        for (const c of polls) {
          if (!c.sessionId) continue;

          try {
            const res = await apiFetch(`${API_BASE}/ai/director/session/${c.sessionId}/update`, {
              headers: { "accept": "*/*" }
            });

            if (res.ok) {
              const resData = await res.json();
              const updateData = resData.data;
              
              // Reset failures on success
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
                      script: updateData.script || newCampaigns[index].script
                    };
                    hasChanges = true;
                  }
                }
              }
            } else if (res.status === 404) {
              sessionFailuresRef.current[c.sessionId] = (sessionFailuresRef.current[c.sessionId] || 0) + 1;
            }
          } catch (e) {
            const isNetworkError = e instanceof TypeError && e.message.includes("fetch");
            if (isNetworkError) {
              console.warn(`Polling network issue for ${c.sessionId}. Backend might be down.`);
            } else {
              console.error("Polling error for", c.sessionId, e);
            }
            sessionFailuresRef.current[c.sessionId] = (sessionFailuresRef.current[c.sessionId] || 0) + 1;
          }
        }
        
        if (hasChanges) {
          setCampaigns(newCampaigns);
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
      <div className="flex flex-col gap-6 mx-auto p-4 lg:p-6 max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button 
              onClick={() => router.push("/studio")}
              className="flex items-center gap-2 text-[14px] text-[#64748B] hover:text-[#02022C] transition-colors mb-2"
            >
              <Icons.ArrowLeft className="w-4 h-4" /> Back to Studio
            </button>
            <h1 className="text-[28px] font-bold text-[#121212]">All Campaigns</h1>
            <p className="text-[14px] text-[#64748B]">Browse and manage your full campaign history</p>
          </div>
          
          <div className="relative w-full md:w-[320px]">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input 
              type="text" 
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[14px] focus:outline-none focus:border-[#02022C] transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-3">
            <Icons.Loader className="w-8 h-8 animate-spin text-[#02022C]" />
            <p className="text-slate-400 font-medium">Fetching campaigns...</p>
          </div>
        ) : filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCampaigns.map((campaign, i) => (
              <CampaignCard 
                key={campaign.sessionId || campaign.id || i}
                {...campaign}
                onDelete={() => handleDeleteCampaign(campaign)}
              />
            ))}
          </div>
        ) : (
          <div className="h-[400px] flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-[24px] gap-4">
            <div className="p-4 bg-slate-50 rounded-full">
              <Icons.Activity className="w-10 h-10 text-slate-300" />
            </div>
            <div className="text-center">
              <h3 className="text-[18px] font-bold text-slate-600">No campaigns found</h3>
              <p className="text-slate-400 text-[14px]">Try adjusting your search or start a new campaign in the studio.</p>
            </div>
            <button 
              onClick={() => router.push("/studio")}
              className="px-6 py-2.5 bg-[#02022C] text-white rounded-xl text-[14px] font-bold hover:bg-[#1A1A3F] transition-all shadow-lg"
            >
              Go to Studio
            </button>
          </div>
        )}
      </div>

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
    </DashboardLayout>
  );
}

export default function AllCampaignsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllCampaignsContent />
    </Suspense>
  );
}
