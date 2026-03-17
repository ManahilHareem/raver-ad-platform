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
}

export default function CreateCampaignModal({ isOpen, onClose }: CreateCampaignModalProps) {
  const [step, setStep] = useState(1);

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
          {step === 1 && <CampaignStep1 />}
          {step === 2 && <CampaignStep2 />}
          {step === 3 && <CampaignStep3 />}
          {step === 4 && <CampaignStep4 />}
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
              onClick={onClose}
              className="flex items-center gap-2 px-10 py-2.5 bg-[#02022C] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#1A1A3F] transition-all"
            >
              Generate Campaign <Icons.Send className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


