"use client";

import React, { useState } from "react";
import { Icons } from "@/components/ui/icons";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[500px] rounded-[24px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-[#F1F5F9]">
        <div className="p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-[24px] font-bold text-[#121212]">Change Password</h2>
              <p className="text-[14px] font-medium text-[#4F4F4F]">Update your account password</p>
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
              <label className="text-[14px] font-bold text-[#121212]">Current Password</label>
              <div className="relative">
                <input 
                  type={showCurrent ? "text" : "password"} 
                  placeholder="Enter current password"
                  className="w-full h-[52px] px-4 bg-[#F8F8F8] border border-[#F1F5F9] rounded-[12px] text-[15px] outline-none focus:border-[#02022C] transition-colors pr-12"
                />
                <button 
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showCurrent ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-bold text-[#121212]">New Password</label>
              <div className="relative">
                <input 
                  type={showNew ? "text" : "password"} 
                  placeholder="Enter new password"
                  className="w-full h-[52px] px-4 bg-[#F8F8F8] border border-[#F1F5F9] rounded-[12px] text-[15px] outline-none focus:border-[#02022C] transition-colors pr-12"
                />
                <button 
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showNew ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-bold text-[#121212]">Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showConfirm ? "text" : "password"} 
                  placeholder="Confirm new password"
                  className="w-full h-[52px] px-4 bg-[#F8F8F8] border border-[#F1F5F9] rounded-[12px] text-[15px] outline-none focus:border-[#02022C] transition-colors pr-12"
                />
                <button 
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showConfirm ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#EEF2FF] p-4 rounded-[12px] border-l-4 border-[#4F46E5] flex flex-col gap-2">
             <span className="text-[14px] font-bold text-[#4F46E5]">Password requirements:</span>
             <ul className="text-[12px] text-[#64748B] flex flex-col gap-1 list-disc pl-4">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One number</li>
             </ul>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <button 
              onClick={onClose}
              className="flex-1 h-[52px] rounded-[14px] text-[16px] font-bold text-[#64748B] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button className="flex-2 h-[52px] bg-[#02022C] text-white rounded-[14px] text-[16px] font-bold hover:opacity-90 transition-all shadow-[inset_0px_-5px_5px_0px_#4F569B]">
               Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
