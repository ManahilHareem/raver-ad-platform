"use client";

import { Icons } from "@/components/ui/icons";
import { useState, useEffect } from "react";

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

interface CampaignSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: Campaign[];
  onSelect: (campaign: Campaign) => void;
  onCreateNew?: () => void;
  onDelete?: (campaign: Campaign) => void;
  initialSelectedCampaign?: Campaign | null;
}

export default function CampaignSelectionModal({ 
  isOpen, 
  onClose, 
  campaigns, 
  onSelect,
  onCreateNew,
  onDelete,
  initialSelectedCampaign
}: CampaignSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaignDetail, setSelectedCampaignDetail] = useState<Campaign | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedCampaignDetail(initialSelectedCampaign || null);
    } else {
      setSelectedCampaignDetail(null);
    }
  }, [isOpen, initialSelectedCampaign]);

  if (!isOpen) return null;

  const handleBackToList = () => {
    setSelectedCampaignDetail(null);
  };

  const handleConfirmSelect = (campaign: Campaign) => {
    onSelect(campaign);
    onClose();
    setSelectedCampaignDetail(null);
  };

  const filteredCampaigns = campaigns.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-y-0 right-0 left-0 lg:left-[280px] z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[540px] max-h-[90vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-[#121212]">
              {selectedCampaignDetail ? "Campaign Details" : "Select Campaign"}
            </h2>
            <p className="text-[14px] text-[#64748B]">
              {selectedCampaignDetail 
                ? "Review campaign details before selection" 
                : "Choose a campaign to reference in your prompt"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#F1F5F9] rounded-full transition-colors">
            <Icons.Plus className="w-5 h-5 rotate-45 text-[#64748B]" />
          </button>
        </div>

        {selectedCampaignDetail ? (
          /* Detailed View */
          <div className="flex-1 overflow-y-auto flex flex-col custom-scrollbar">
            <div className="p-6 flex flex-col gap-6">

              {/* Info Stack */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[22px] font-bold text-[#121212]">{selectedCampaignDetail.title}</h3>
                  <div className="flex items-center gap-2 text-[13px] text-[#64748B]">
                    <Icons.Clock className="w-4 h-4" />
                    <span>Created on {selectedCampaignDetail.createdAt ? new Date(selectedCampaignDetail.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}</span>
                    <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
                    <span>ID: #{selectedCampaignDetail.id?.slice(-6) || "N/A"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-[#94A3B8] font-bold uppercase">Objective</span>
                    <span className="text-[14px] font-semibold text-[#121212]">{selectedCampaignDetail.objective || "N/A"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-[#94A3B8] font-bold uppercase">Audience</span>
                    <span className="text-[14px] font-semibold text-[#121212]">{selectedCampaignDetail.audience || "N/A"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-[#94A3B8] font-bold uppercase">Format</span>
                    <span className="text-[14px] font-semibold text-[#121212]">{selectedCampaignDetail.format || "N/A"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-[#94A3B8] font-bold uppercase">Duration</span>
                    <span className="text-[14px] font-semibold text-[#121212]">{selectedCampaignDetail.duration || "N/A"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-[#94A3B8] font-bold uppercase">Color Scheme</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-[#121212]">{selectedCampaignDetail.colorScheme || "N/A"}</span>
                      {selectedCampaignDetail.colorScheme && (
                        <div className="flex gap-1">
                          {(
                            {
                              "Warm Tones": ["#F97066", "#FBAD37", "#F79009"],
                              "Cool Tones": ["#53B1FD", "#7F56D9", "#2E90FA"],
                              "Neutral": ["#344054", "#667085", "#D0D5DD"],
                              "Pastel": ["#FEE4E2", "#D1E9FF", "#D1FADF"],
                              "Earth Tones": ["#7A5E43", "#A67C52", "#D4A373"],
                              "Monochrome": ["#000000", "#4B4B4B", "#9E9E9E"]
                            }[selectedCampaignDetail.colorScheme] || []
                          ).map((c, i) => (
                            <div key={i} className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] text-[#94A3B8] font-bold uppercase">Platforms</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCampaignDetail.platforms?.map((p, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#F1F5F9] text-[#475569] text-[11px] font-bold rounded-md">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] text-[#94A3B8] font-bold uppercase">Tones & Style</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCampaignDetail.tones?.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#02022C]/5 text-[#02022C] text-[11px] font-bold rounded-md border border-[#02022C]/10">
                          {t}
                        </span>
                      ))}
                      {selectedCampaignDetail.visualStyles?.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#AD46FF]/5 text-[#AD46FF] text-[11px] font-bold rounded-md border border-[#AD46FF]/10">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                  <h4 className="text-[13px] font-bold text-[#121212] mb-2">Campaign Strategy</h4>
                  <p className="text-[14px] text-[#475569] leading-relaxed">
                    Targeting {selectedCampaignDetail.audience || "a broad audience"} with a {selectedCampaignDetail.objective?.toLowerCase() || "general"} objective. 
                    The creative uses a {selectedCampaignDetail.colorScheme?.toLowerCase() || "custom"} color scheme and {selectedCampaignDetail.visualStyles?.[0]?.toLowerCase() || "modern"} visual styles to maximize impact across {selectedCampaignDetail.platforms?.join(", ") || "multiple platforms"}.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto p-6 bg-[#F8FAFC] border-t border-[#F1F5F9] flex gap-3">
              <button 
                onClick={handleBackToList}
                className="flex-1 h-[48px] bg-white border border-[#E2E8F0] text-[#475569] rounded-xl font-bold text-[15px] hover:bg-[#F1F5F9] transition-all flex items-center justify-center gap-2"
              >
                <Icons.ArrowLeft className="w-4 h-4" /> Back
              </button>
              
              {onDelete && (
                <button 
                  onClick={() => {
                    onDelete(selectedCampaignDetail);
                    onClose();
                  }}
                  className="h-[48px] px-4 bg-red-50 border border-red-100 text-red-600 rounded-xl font-bold text-[15px] hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                  title="Delete Campaign"
                >
                  <Icons.Trash className="w-4 h-4" />
                </button>
              )}

              <button 
                onClick={() => handleConfirmSelect(selectedCampaignDetail)}
                className="flex-2 h-[48px] bg-linear-to-r from-[#01012A] to-[#2E2C66] text-white rounded-xl font-bold text-[15px] shadow-lg shadow-[#01012A]/10 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Select Campaign <Icons.ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* List View */
          <>
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

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div className="grid grid-cols-1 gap-3">
                {filteredCampaigns.map((campaign, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedCampaignDetail(campaign)}
                    className="flex items-center gap-4 p-3 rounded-xl border border-[#F1F5F9] hover:border-[#02022C] hover:bg-[#F8FAFC] cursor-pointer transition-all group"
                  >
                    <div className="w-[60px] h-[40px] rounded-lg overflow-hidden shrink-0 border border-[#E2E8F0]">
                      <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-[14px] font-semibold text-[#121212] group-hover:text-[#02022C] line-clamp-1">{campaign.title}</h4>
                      <span className="text-[11px] text-[#64748B] uppercase font-bold">{campaign.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(campaign);
                            onClose();
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                          title="Delete Campaign"
                        >
                          <Icons.Trash className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <div className="w-6 h-6 rounded-full border border-[#E2E8F0] flex items-center justify-center group-hover:bg-[#02022C] group-hover:border-[#02022C] transition-all">
                        <Icons.ArrowRight className="w-3 h-3 text-[#94A3B8] group-hover:text-white" />
                      </div>
                    </div>
                  </div>
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
                        className="flex items-center gap-2 px-6 py-2 bg-linear-to-r from-[#01012A] to-[#2E2C66] text-white rounded-lg text-[14px] font-bold shadow-lg shadow-[#01012A]/10 active:scale-95 transition-all"
                      >
                        <Icons.Plus className="w-4 h-4" /> Create New Campaign
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
