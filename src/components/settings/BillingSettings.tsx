import React, { useState, useEffect } from "react";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

import { apiFetch } from "@/lib/api";

export default function BillingSettings({ 
  onBuyCredits, 
  onAddPayment,
  onEdit,
  isLoading: globalLoading = false
}: { 
  onBuyCredits: () => void;
  onAddPayment: () => void;
  onEdit: (card: any) => void;
  isLoading?: boolean;
}) {
  const [cards, setCards] = useState<any[]>([]);
  const [isCardsLoading, setIsCardsLoading] = useState(true);

  const fetchCards = async () => {
    try {
      const response = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/payment-methods`);
      if (response.ok) {
        const result = await response.json();
        setCards(result.data || []);
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') return;
      console.error("Failed to fetch cards:", err);
    } finally {
      setIsCardsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-[12px]">
        <h3 className="text-[18px] font-medium text-[#121212]">Billing & Credits</h3>
        
        <div className={cn(
          "p-[20px] rounded-[16px] border flex items-center justify-between shadow-sm relative overflow-hidden group",
          globalLoading ? "bg-gray-50 border-gray-100 animate-pulse" : "bg-[linear-gradient(135deg,#EEF2FF_0%,#FAF5FF_100%)] border-[#E0E7FF]"
        )}>
          {globalLoading ? (
            <div className="flex flex-col gap-2 w-1/2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-10 w-48 bg-gray-200 rounded" />
            </div>
          ) : (
            <>
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-400 opacity-5 blur-[100px] -mr-32 -mt-32 transition-opacity group-hover:opacity-10 duration-500" />
              <div className="flex flex-col relative z-10">
                <span className="text-[13px] text-[#4F4F4F] font-regular  tracking-wider">Current Balance</span>
                <div className="flex flex-col">
                  <span className="text-[32px] font-bold text-[#121212]">250 Credits</span>
                  <span className="text-[12px] font-regular text-[#64748B]">Renews on April 15, 2026</span>
                </div>
              </div>
              <button 
                onClick={onBuyCredits}
                className="flex items-center gap-2 px-6 py-3 bg-[linear-gradient(90deg,#01012A_0%,#2E2C66_100%)] text-white rounded-[12px] text-[16px] font-bold hover:opacity-90 transition-all shadow-[inset_0px_-5px_5px_0px_#4F569B] relative z-10"
              >
                <Icons.whiteMagicWand className="w-5 h-5" /> Buy Credits
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[14px] font-medium text-[#121212]">Payment Methods</h4>
          <button 
            onClick={onAddPayment}
            className="flex items-center gap-2 text-[14px] font-medium bg-[#F8F8F8] text-[#64748B] hover:text-[#121212] transition-colors px-[12px] py-[16px] rounded-[8px]"
          >
            <Icons.Plus className="w-4 h-4" /> Add Method
          </button>
        </div>

        {isCardsLoading ? (
          <div className="flex flex-col gap-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-[#F8F8F8] p-6 rounded-[16px] border border-[#FFFFFF] flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-[48px] h-[32px] bg-gray-200 rounded-[4px]" />
                  <div className="flex flex-col gap-2">
                    <div className="h-5 w-40 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="h-4 w-12 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : cards.length > 0 ? (
          cards.map((card) => (
            <div key={card.id} className="bg-[#F8F8F8] p-6 rounded-[16px] border border-[#FFFFFF] flex items-center justify-between hover:border-gray-300 transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-[48px] h-[32px] bg-gray-50 border border-gray-100 rounded-[4px] flex items-center justify-center p-1">
                   <Icons.CreditCard className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-bold text-[#121212]">
                    {card.brand || "Card"} •••• {card.last4 || card.cardNumber?.slice(-4)}
                  </span>
                  <span className="text-[12px] text-[#64748B]">Expires {card.expiryDate}</span>
                </div>
                {card.isDefault && <span className="px-2 py-1 bg-black text-white text-[10px] font-bold rounded-[4px] ml-2">DEFAULT</span>}
              </div>
              <button 
                onClick={() => onEdit(card)}
                className="text-[14px] font-medium text-[#64748B] hover:text-[#121212] flex items-center gap-1 transition-colors"
              >
                <Icons.PenLine className="w-4 h-4" /> Edit
              </button>
            </div>
          ))
        ) : (
          <div className="p-10 border-2 border-dashed border-gray-100 rounded-[16px] text-center flex flex-col items-center gap-2">
            <Icons.CreditCard className="w-10 h-10 text-gray-200" />
            <p className="text-[14px] text-gray-400">No payment methods added yet</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="text-[13px] font-medium text-[#121212] mb-2">This Month's Usage</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Credits Used", value: "150" },
            { label: "Projects Created", value: "24" },
            { label: "Avg. per Project", value: "6.3", small: true }
          ].map((stat, i) => (
            <div key={i} className="bg-[#F8F8F8] p-6 rounded-[16px] border border-[#F1F5F9] flex flex-col gap-2 transition-transform hover:scale-[1.02] duration-300">
              <span className="text-[12px] font-medium text-[#4F4F4F] uppercase tracking-wider">{stat.label}</span>
              {globalLoading ? (
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              ) : (
                <span className={cn("font-bold text-[#121212]", stat.small ? "text-[24px] text-[#02022C]" : "text-[28px]")}>
                  {stat.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
