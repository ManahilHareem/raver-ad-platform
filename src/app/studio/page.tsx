"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import StudioHero from "@/components/studio/StudioHero";
import CampaignCard from "@/components/studio/CampaignCard";
import ProductionPipeline from "@/components/studio/ProductionPipeline";
import CreateCampaignModal from "@/components/studio/CreateCampaignModal";
import { Icons } from "@/components/ui/icons";

/*
### Custom Icon Integration
- Added `Sent` and `Mic` icons to [custom-icons.tsx](file:///Users/muhammadmaaz/Documents/GitHub/Ravi%20AI%20Frontend/src/components/ui/custom-icons.tsx).
- Added `Success` icon (based on `Icon.svg`) to [custom-icons.tsx](file:///Users/muhammadmaaz/Documents/GitHub/Ravi%20AI%20Frontend/src/components/ui/custom-icons.tsx), which is a green circular checkmark asset.
- Updated [icons.tsx](file:///Users/muhammadmaaz/Documents/GitHub/Ravi%20AI%20Frontend/src/components/ui/icons.tsx) to map `Icons.Success` to this new custom asset.
- These icons are automatically available for use throughout the application.
*/

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
  const [campaigns, setCampaigns] = useState(activeCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<
    (typeof activeCampaigns)[0] | null
  >(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };

  const fetchCampaigns = async () => {
    try {
      const token = getCookie("raver_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setCampaigns(
            data.map((c: any) => ({
              title: c.name,
              status: c.status || "Ready",
              image: "/assets/hashtag-campaign.jpg",
            })),
          );
        }
      }
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
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
        />

        {/* Active Campaigns Section */}
        <div className="flex flex-col gap-[16px] bg-[#FFFFFF] border-[0.35px]-[#0000001A] rounded-[12px] p-[16px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[#121212]">
              Active Campaigns
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px]">
            {campaigns.map((campaign, i) => (
              <CampaignCard key={i} {...campaign} />
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

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
