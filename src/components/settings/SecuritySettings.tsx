"use client";

import React from "react";
import { Icons } from "@/components/ui/icons";

export default function SecuritySettings({ 
  onChangePassword,
  isLoading = false
}: { 
  onChangePassword: () => void;
  isLoading?: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-[18px] font-bold text-[#121212]">Privacy & Security</h3>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          [...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-6 bg-white rounded-[16px] border border-[#F1F5F9] animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-[44px] h-[44px] bg-gray-200 rounded-[12px]" />
                <div className="flex flex-col gap-2">
                  <div className="h-5 w-40 bg-gray-200 rounded" />
                  <div className="h-4 w-64 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="h-5 w-5 bg-gray-200 rounded" />
            </div>
          ))
        ) : (
          <>
            {/* Change Password */}
            <button 
              onClick={onChangePassword}
              className="flex items-center justify-between p-6 bg-white rounded-[16px] border border-[#F1F5F9] hover:border-[#E2E8F0] transition-colors shadow-sm group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-[12px] transition-colors">
                  <Icons.Lock className="w-5 h-5 text-[#64748B]" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[16px] font-bold text-[#121212]">Change Password</span>
                  <span className="text-[14px] text-[#64748B]">Update your account password</span>
                </div>
              </div>
              <Icons.ChevronRight className="w-5 h-5 text-[#64748B]" />
            </button>

            {/* Delete Account */}
            <button className="flex items-center justify-between p-6 bg-[#FD5252] rounded-[16px] border border-[#FEE2E2]  transition-colors shadow-sm group text-left">
              <div className="flex items-center gap-4">
                <div className="p-3  rounded-[12px]">
                  <Icons.Lock className="w-5 h-5 text-[#FFFFFF]" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[16px] font-bold text-[#FFFFFF]">Delete Account</span>
                  <span className="text-[14px] text-[#FFFFFF]">Permanently Delete your account</span>
                </div>
              </div>
              <Icons.ChevronRight className="w-5 h-5 text-[#FFFFFF]" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
