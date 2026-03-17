"use client";

import React from "react";
import { Icons } from "@/components/ui/icons";

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPaymentMethodModal({ isOpen, onClose }: AddPaymentMethodModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[500px] rounded-[24px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-[#F1F5F9]">
        <div className="p-[12px] flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-[20px] font-bold text-[#121212]">Add Payment Method</h2>
              <p className="text-[14px] font-medium text-[#4F4F4F]">Enter your card details</p>
            </div>
            <button 
              onClick={onClose}
              className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Icons.Plus className="w-5 h-5 rotate-45 text-[#64748B]" />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#121212]">Full Name</label>
              <input 
                type="text" 
                placeholder="1234 5678 91 34 5602"
                className="w-full h-[52px] px-4 bg-[#F8F8F8] border border-[#F1F5F9] rounded-[12px] text-[15px] outline-none focus:border-[#02022C] transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#121212]">Expire Date</label>
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  className="w-full h-[52px] px-4 bg-[#F8F8F8] border border-[#F1F5F9] rounded-[12px] text-[15px] outline-none focus:border-[#02022C] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#121212]">CVV</label>
                <input 
                  type="text" 
                  placeholder="123"
                  className="w-full h-[52px] px-4 bg-[#F8F8F8] border border-[#F1F5F9] rounded-[12px] text-[15px] outline-none focus:border-[#02022C] transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-bold text-[#121212]">Cardholder Name</label>
              <input 
                type="text" 
                placeholder="Hareem Ahsen"
                className="w-full h-[52px] px-4 bg-[#F8F8F8] border border-[#F1F5F9] rounded-[12px] text-[15px] outline-none focus:border-[#02022C] transition-colors"
              />
            </div>
          </div>

          <div className="bg-[#EEFDF3] p-4 rounded-[12px] border-l-4 border-[#22C55E] flex items-center gap-3">
             <Icons.Shield className="w-5 h-5 text-[#22C55E]" />
             <span className="text-[12px] font-medium text-[#166534]">Your payment information is encrypted and secure</span>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <button 
              onClick={onClose}
              className="flex-1 h-[52px] rounded-[14px] text-[16px] font-bold text-[#64748B] hover:bg-gray-50 transition-colors"
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
