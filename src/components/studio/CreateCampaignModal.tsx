"use client";

import { useState } from "react";
import { Icons } from "@/components/ui/icons";
import CampaignStep1 from "./steps/CampaignStep1";
import CampaignStep2 from "./steps/CampaignStep2";
import CampaignStep3 from "./steps/CampaignStep3";
import CampaignStep4 from "./steps/CampaignStep4";

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

import { apiFetch } from "@/lib/api";

export default function CreateCampaignModal({ isOpen, onClose, onSuccess }: CreateCampaignModalProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [campaignData, setCampaignData] = useState({
    name: "",
    objective: "Brand Awareness",
    audience: "",
    visualStyles: [] as string[],
    tones: [] as string[],
    colorScheme: "",
    platforms: ["Instagram"] as string[],
    duration: "15 sec",
    format: "Square (1:1)"
  });

  const updateData = (fields: Partial<typeof campaignData>) => {
    setCampaignData(prev => ({ ...prev, ...fields }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: campaignData.name,
          platform: campaignData.platforms[0] || "Instagram", // Simple mapping for now
          budget: 0, // Placeholder
          config: campaignData // Store the full wizard data in the JSONB config field
        }),
      });

      if (response.ok) {
        if (onSuccess) onSuccess();
        onClose();
        // Reset state
        setStep(1);
        setCampaignData({
          name: "", objective: "Brand Awareness", audience: "",
          visualStyles: [], tones: [], colorScheme: "",
          platforms: ["Instagram"], duration: "15 sec", format: "Square (1:1)"
        });
      } else {
        const err = await response.json();
        throw new Error(err.message || "Failed to create campaign");
      }
    } catch (err: any) {
      if (err instanceof Error && err.message === 'Unauthorized') return;
      console.error("Campaign Creation Error:", err);
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="bg-[#F8FAFC] w-full max-w-[640px] h-screen flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 rounded-l-[24px] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-white px-8 pt-6 pb-2 border-b border-[#F1F5F9] shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <h2 className="text-[18px] font-medium text-[#121212]">Create New Campaign</h2>
              <span className="text-[13px] text-[#64748B] font-regular">Step {step} of 4</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[#F1F5F9] rounded-full transition-colors">
              <Icons.Plus className="w-5 h-5 rotate-45 text-[#64748B]" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-4 ">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-[3px] flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-[linear-gradient(90deg,#01012A_0%,#2E2C66_100%)] " : "bg-[#E2E8F0]"
              }`} />
            ))}
          </div>
        </div>

        {/* Modal Content */}
        <div className={`px-[24px] py-[20px] flex-1 custom-scrollbar ${step === 4 ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {step === 1 && <CampaignStep1 data={campaignData} updateData={updateData} />}
          {step === 2 && <CampaignStep2 data={campaignData} updateData={updateData} />}
          {step === 3 && <CampaignStep3 data={campaignData} updateData={updateData} />}
          {step === 4 && <CampaignStep4 data={campaignData} />}
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-4 bg-white border-t border-[#F1F5F9] flex items-center justify-between">
          <button 
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1}
            className="flex items-center gap-2 px-6 py-2 bg-white rounded-lg text-[14px] font-bold text-[#121212] hover:bg-[#F1F5F9] transition-all disabled:opacity-0 disabled:pointer-events-none"
          >
            <Icons.ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          {step < 4 ? (
            <button 
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-10 py-2.5 bg-[#02022C] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#1A1A3F] transition-all"
            >
              Next <Icons.ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 px-10 py-2.5 bg-[#02022C] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#1A1A3F] transition-all"
            >
              {isLoading ? "Generating..." : "Generate Campaign"} <Icons.Send className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


