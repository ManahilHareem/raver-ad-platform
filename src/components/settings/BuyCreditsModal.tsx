"use client";

import React from "react";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface CreditPackage {
  id: number;
  credits: number;
  bonus?: number;
  price: string;
  pricePerCredit: string;
  mostPopular?: boolean;
}

const packages: CreditPackage[] = [
  { id: 1, credits: 100, price: "$29", pricePerCredit: "$0.29 per credit" },
  { id: 2, credits: 250, bonus: 25, price: "$59", pricePerCredit: "$0.24 per credit", mostPopular: true },
  { id: 3, credits: 500, bonus: 75, price: "$99", pricePerCredit: "$0.20 per credit" },
  { id: 4, credits: 1000, bonus: 200, price: "$169", pricePerCredit: "$0.17 per credit" },
];

export default function BuyCreditsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedId, setSelectedId] = React.useState(2);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 left-0 lg:left-[280px] z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[650px] rounded-[24px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col relative border border-[#F1F5F9]">
        
        <div className="p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-[24px] font-bold text-[#121212]">Buy credits</h2>
              <p className="text-[14px] font-medium text-[#4F4F4F]">Choose a package that fits your needs</p>
            </div>
            <button 
              onClick={onClose}
              className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Icons.Plus className="w-5 h-5 rotate-45 text-[#64748B]" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                onClick={() => setSelectedId(pkg.id)}
                className={cn(
                  "relative p-[16px] rounded-[20px] border-2 cursor-pointer transition-all duration-200 flex flex-col gap-[12px]",
                  selectedId === pkg.id 
                    ? "border-[#02022C] bg-white shadow-lg ring-1 ring-[#02022C]/10" 
                    : "border-[#F1F5F9] bg-[#F8F8F8] hover:border-gray-300"
                )}
              >
                {pkg.mostPopular && (
                  <div className="absolute top-0 right-10 -mt-3 shadow-md bg-[#02022C] text-white text-[10px] font-bold px-3 py-1 rounded-[6px]">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[18px] font-bold text-[#121212]">{pkg.credits}</span>
                    <span className="text-[12px] font-medium text-[#4F4F4F]">Credits</span>
                  </div>
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    selectedId === pkg.id ? "border-[#02022C] bg-[#02022C]" : "border-gray-300"
                  )}>
                    {selectedId === pkg.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>

                {pkg.bonus && (
                  <div className="px-2 py-1 bg-[#DCFCE7] text-[#008236] text-[12px] font-bold rounded-[6px] w-fit">
                    +{pkg.bonus} BONUS
                  </div>
                )}

                <div className="flex flex-col mt-2">
                  <span className="text-[20px] font-bold text-[#121212]">{pkg.price}</span>
                  <span className="text-[12px] text-[#4F4F4F]">{pkg.pricePerCredit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 p-4 bg-[#4F94F408] rounded-[16px] mt-2 border-l-4 border-[#0F60D2] ">
             <div className="flex flex-col gap-1 ">
                <span className="text-[14px] font-bold text-[#0F60D2] uppercase tracking-wider">How credits work</span>
                <p className="text-[12px] text-[#4F94F4] leading-relaxed">
                   Credits are used to generate AI content. Each image costs 1-2 credits, videos cost 5-10 credits depending on length and quality.
                </p>
             </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button 
              onClick={onClose}
              className="flex-1 h-[52px] px-6 rounded-[14px] text-[16px] font-bold text-[#64748B] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button className="flex-2 h-[52px] bg-[#02022C] text-white rounded-[14px] text-[16px] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[inset_0px_-5px_5px_0px_#4F569B]">
              <Icons.whiteMagicWand className="w-5 h-5 text-white" /> Purchase Credits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
