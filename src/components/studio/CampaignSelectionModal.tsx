"use client";

import { Icons } from "@/components/ui/icons";
import { useState } from "react";

interface Campaign {
  title: string;
  status: string;
  image: string;
}

interface CampaignSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: Campaign[];
  onSelect: (campaign: Campaign) => void;
  onCreateNew?: () => void;
}

export default function CampaignSelectionModal({ 
  isOpen, 
  onClose, 
  campaigns, 
  onSelect,
  onCreateNew
}: CampaignSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredCampaigns = campaigns.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[540px] max-h-[80vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-[#121212]">Select Campaign</h2>
            <p className="text-[14px] text-[#64748B]">Choose a campaign to reference in your prompt</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#F1F5F9] rounded-full transition-colors">
            <Icons.Plus className="w-5 h-5 rotate-45 text-[#64748B]" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 bg-[#F8FAFC]">
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-[14px] focus:outline-none focus:border-[#02022C] transition-all"
            />
          </div>
        </div>

        {/* Campaign List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="grid grid-cols-1 gap-3">
            {filteredCampaigns.map((campaign, i) => (
              <button
                key={i}
                onClick={() => {
                  onSelect(campaign);
                  onClose();
                }}
                className="flex items-center gap-4 p-3 rounded-xl border border-[#F1F5F9] hover:border-[#02022C] hover:bg-[#F8FAFC] transition-all group"
              >
                <div className="w-[60px] h-[40px] rounded-lg overflow-hidden shrink-0 border border-[#E2E8F0]">
                  <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-[14px] font-semibold text-[#121212] group-hover:text-[#02022C] line-clamp-1">{campaign.title}</h4>
                  <span className="text-[11px] text-[#64748B] uppercase font-bold">{campaign.status}</span>
                </div>
                <div className="w-6 h-6 rounded-full border border-[#E2E8F0] flex items-center justify-center group-hover:bg-[#02022C] group-hover:border-[#02022C] transition-all">
                  <Icons.ArrowRight className="w-3 h-3 text-[#94A3B8] group-hover:text-white" />
                </div>
              </button>
            ))}
            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12 flex flex-col items-center gap-4">
                <p className="text-[#64748B] text-[14px]">No campaigns found</p>
                {onCreateNew && (
                  <button 
                    onClick={() => {
                      onCreateNew();
                      onClose();
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-[#02022C] text-white rounded-lg text-[14px] font-bold hover:bg-[#1A1A3F] transition-all"
                  >
                    <Icons.Plus className="w-4 h-4" /> Create New Campaign
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
