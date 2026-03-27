"use client";

import { Suspense, useState, useEffect } from "react";
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

const activeCampaigns = [
  {
    title: "Holiday Special Campaign",
    status: "Ready",
    image: "/assets/hashtag-campaign.jpg",
  },
  {
    title: "Bridal Package Showcase",
    status: "In Production",
    image: "/assets/hashtag-campaign.jpg",
  },
  {
    title: "Nail Art Collection",
    status: "Ready",
    image: "/assets/hashtag-campaign.jpg",
  },
];

const insights = [
  { label: "Campaigns Created", value: "24", change: "+12%" },
  { label: "Credit Remaining", value: "250", change: "-12%" },
  { label: "Avg Quality Score", value: "94%", change: "+5%" },
  { label: "Avg Render Time", value: "4.2m", change: "" },
];

function StudioPageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>();
  const [Videos, setVideos] = useState<Campaign[]>(activeCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
      const res = await apiFetch(`${API_BASE}/campaigns`);
      let mappedCampaigns: Campaign[] = [];
      
      if (res.ok) {
        const responseData = await res.json();
        if (responseData.success && responseData.data && responseData.data.length > 0) {
          mappedCampaigns = responseData.data.map((c: any) => ({
            id: c.id?.toString() || c._id?.toString(),
            title: c.name,
            status: c.status || "Ready",
            image: "/assets/hashtag-campaign.jpg",
            audience: c.audience || c.config?.audience,
            objective: c.objective || c.config?.objective,
            format: c.format || c.config?.format,
            duration: c.duration || c.config?.duration,
            colorScheme: c.colorScheme || c.config?.colorScheme,
            platforms: c.platforms || c.config?.platforms,
            tones: c.tones || c.config?.tones,
            visualStyles: c.visualStyles || c.config?.visualStyles,
            createdAt: c.createdAt,
          }));
        }
      }

      // Merge with user-provided mock data to ensure they appear in the UI
      const userMockData: Campaign[] = [
        {
          id: "68f5f617-46f5-4212-b4e4-fbbb769d5918",
          title: "Summer Glamour Ad Campaign",
          status: "Draft",
          image: "/assets/hashtag-campaign.jpg",
          audience: "teenage and md 20's",
          objective: "Engagement",
          format: "Portrait (9:16)",
          duration: "60 sec",
          colorScheme: "Monochrome",
          platforms: ["Instagram", "Facebook", "Tiktok", "YouTube"],
          tones: ["Friendly", "Inspiring", "Playful", "Sophisticated"],
          visualStyles: ["Modern & Clean", "Elegant & Luxury", "Vibrant & Bold"],
          createdAt: "2026-03-18T21:12:46.035Z",
        },
        {
          id: "321e5ed2-9b46-43bd-a1e1-c246d04532ac",
          title: "Modern Minimalist Showcase",
          status: "Draft",
          image: "/assets/hashtag-campaign.jpg",
          audience: "20 to 40 years",
          objective: "Lead Generation",
          format: "Landscape (16:9)",
          duration: "30 sec",
          colorScheme: "Neutral",
          platforms: ["Instagram", "Facebook", "Tiktok", "YouTube"],
          tones: ["Inspiring", "Friendly", "Playful"],
          visualStyles: ["Modern & Clean", "Elegant & Luxury", "Vibrant & Bold"],
          createdAt: "2026-03-19T20:14:15.144Z",
        }
      ];

      // Combine API results with mock data, avoiding duplicates by ID
      const finalCampaigns = [...mappedCampaigns];
      userMockData.forEach(mock => {
        if (!finalCampaigns.find(c => c.id === mock.id)) {
          finalCampaigns.unshift(mock);
        }
      });

      setCampaigns(finalCampaigns);
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') return;
      console.error("Failed to fetch campaigns:", err);
    }
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setIsDeleteModalOpen(true);
  };

  const handleViewDetails = (campaign: Campaign) => {
    setCampaignToView(campaign);
    setIsModalOpen(true);
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
        <div className="flex flex-col gap-[16px] bg-[#FFFFFF] border-[0.35px]-[#0000001A] rounded-[12px] p-[16px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[#121212]">
              Active Campaigns
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px]">
            {Videos.map((campaign, i) => (
              <CampaignCard 
                key={i} 
                {...campaign} 
                onDelete={() => handleDeleteCampaign(campaign)}
              />
            ))}
          </div>
        </div>

        {/* Production Pipeline */}
        <div className="flex flex-col gap-4 bg-[#FFFFFF] border-[0.35px]-[#0000001A] rounded-[12px] p-[16px]">
          <h2 className="text-[18px] font-medium text-[#121212]">
            AI Production Pipeline
          </h2>
          <ProductionPipeline />
        </div>

        {/* Insights Section */}
        <div className="flex flex-col gap-4 bg-[#FFFFFF] border-[0.35px]-[#0000001A] rounded-[12px] p-[16px]">
          <h2 className="text-[18px] font-medium text-[#121212]">Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {insights.map((insight, i) => (
              <div
                key={i}
                className="bg-[#F8F8F8] p-5 rounded-[8px] border-[0.35px]-[#0000001A] shadow-sm flex flex-col gap-2"
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

      <button className="fixed bottom-6 right-8 w-[60px] h-[60px] bg-[#02022C] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-40">
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
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCampaignToView(null);
        }}
        campaigns={campaigns || []}
        onSelect={(c: Campaign) => setSelectedCampaign(c)}
        onCreateNew={() => setIsModalOpen(true)}
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
