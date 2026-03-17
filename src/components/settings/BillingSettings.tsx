"use client";

import React from "react";
import { Icons } from "@/components/ui/icons";

export default function BillingSettings({ 
  onBuyCredits, 
  onAddPayment 
}: { 
  onBuyCredits: () => void;
  onAddPayment: () => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-[12px]">
        <h3 className="text-[18px] font-medium text-[#121212]">Billing & Credits</h3>
        
        <div className="bg-[linear-gradient(135deg,#EEF2FF_0%,#FAF5FF_100%)] p-[20px] rounded-[16px] border border-[#E0E7FF] flex items-center justify-between shadow-sm relative overflow-hidden group">
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

        <div className="bg-[#F8F8F8] p-6 rounded-[16px] border border-[#FFFFFF] flex items-center justify-between hover:border-gray-300 transition-all shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-[48px] h-[32px] bg-gray-50 border border-gray-100 rounded-[4px] flex items-center justify-center p-1">
               <Icons.CreditCard className="w-6 h-6 text-gray-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-[#121212]">Visa •••• 4242</span>
              <span className="text-[12px] text-[#64748B]">Expires 12/26</span>
            </div>
            <span className="px-2 py-1 bg-black text-white text-[10px] font-bold rounded-[4px] ml-2">DEFAULT</span>
          </div>
          <button className="text-[14px] font-medium text-[#64748B] hover:text-[#121212] flex items-center gap-1">
            <Icons.PenLine className="w-4 h-4" /> Edit
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="text-[13px] font-medium text-[#121212] mb-2">This Month's Usage</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#F8F8F8] p-6 rounded-[16px] border border-[#F1F5F9] flex flex-col gap-2 transition-transform hover:scale-[1.02] duration-300">
            <span className="text-[12px] font-medium text-[#4F4F4F] uppercase tracking-wider">Credits Used</span>
            <span className="text-[28px] font-bold text-[#121212]">150</span>
          </div>
          <div className="bg-[#F8F8F8] p-6 rounded-[16px] border border-[#F1F5F9] flex flex-col gap-2 transition-transform hover:scale-[1.02] duration-300">
            <span className="text-[12px] font-medium text-[#4F4F4F] uppercase tracking-wider">Projects Created</span>
            <span className="text-[28px] font-bold text-[#121212]">24</span>
          </div>
          <div className="bg-[#F8F8F8] p-6 rounded-[16px] border border-[#F1F5F9] flex flex-col gap-2 transition-transform hover:scale-[1.02] duration-300">
            <span className="text-[12px] font-medium text-[#4F4F4F] uppercase tracking-wider">Avg. per Project</span>
            <span className="text-[24px] font-bold text-[#02022C]">6.3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
