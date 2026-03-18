"use client";

import React from "react";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";

interface ProfileInfoProps {
  user: any;
  onEdit: () => void;
}

export default function ProfileInfo({ user, onEdit }: ProfileInfoProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h3 className="text-[18px] font-medium text-[#121212]">Profile Information</h3>
        
        {/* Banner and Avatar section */}
        <div className="relative w-full h-[180px] rounded-[16px] overflow-visible mb-16">
          <div className="w-full h-full bg-[linear-gradient(90deg,#ABABFC_0%,#C4C4F4_50%,rgba(252,171,236,0.72)_100%)]  rounded-[16px]" />
          <div className="absolute -bottom-12 left-6 w-[120px] h-[120px] rounded-[24px] border-4 border-white overflow-hidden bg-white shadow-sm">
            <Image 
              src="/assets/Template images /5848f944078b1cf8c3d4dc417dae4c9e60024951.jpg" 
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <h4 className="text-[24px] font-bold text-[#121212]">{user?.fullName || "Hareem Ahsen"}</h4>
            <span className="text-[14px] text-[#4F4F4F]">{user?.email || "hareem.ahsen@example.com"}</span>
          </div>
          <button 
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-[#F8F8F8] border border-[#F1F5F9] rounded-[12px] text-[14px] font-medium text-[#121212] hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Icons.PenLine className="w-4 h-4 text-[#121212]" />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="bg-[#F8F8F8] p-6 rounded-[16px] border border-[#F1F5F9] flex flex-col gap-6">
        <div className="flex items-center justify-between h-[38px] border-b border-[#0000001A] pb-[12px]">
          <h5 className="text-[20px] font-medium text-[#121212]">Profile details</h5>
          <button 
            onClick={onEdit}
            className="text-[14px] font-medium text-[#64748B] hover:text-[#121212] flex items-center gap-1 transition-colors"
          >
            <Icons.PenLine className="w-4 h-4" /> Edit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          <div className="flex items-start gap-3">
             <div className="p-2 bg-white rounded-[8px] border border-[#F1F5F9]">
                <Icons.User className="w-5 h-5 text-[#64748B]" />
             </div>
             <div className="flex flex-col">
                <span className="text-[12px] text-[#4F4F4F] font-regular uppercase tracking-wider">Full Name</span>
                <span className="text-[16px] font-medium text-[#121212]">{user?.fullName || "Hareem Ahsen"}</span>
             </div>
          </div>

          <div className="flex items-start gap-3">
             <div className="p-2 bg-white rounded-[8px] border border-[#F1F5F9]">
                <Icons.Mail className="w-5 h-5 text-[#64748B]" />
             </div>
             <div className="flex flex-col">
                <span className="text-[12px] text-[#4F4F4F] font-regular uppercase tracking-wider">Email</span>
                <span className="text-[16px] font-medium text-[#121212]">{user?.email || "hareem.ahsen@example.com"}</span>
             </div>
          </div>

          <div className="flex items-start gap-3">
             <div className="p-2 bg-white rounded-[8px] border border-[#F1F5F9]">
                <Icons.MagicWand className="w-5 h-5 text-[#64748B]" />
             </div>
             <div className="flex flex-col">
                <span className="text-[12px] text-[#4F4F4F] font-regular uppercase tracking-wider">Hair Style</span>
                <span className="text-[16px] font-medium text-[#121212]">{user?.professionalRole || "Hair Stylish"}</span>
             </div>
          </div>

          <div className="flex items-start gap-3">
             <div className="p-2 bg-white rounded-[8px] border border-[#F1F5F9]">
                <Icons.Instagram className="w-5 h-5 text-[#64748B]" />
             </div>
             <div className="flex flex-col">
                <span className="text-[12px] text-[#4F4F4F] font-regular uppercase tracking-wider">Instagram</span>
                <span className="text-[16px] font-medium text-[#121212]">{user?.instagram || "Not linked"}</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
           <div className="p-[20px] bg-white rounded-[16px] border border-[#F1F5F9]  gap-[12px] min-h-[170px]">
              <span className="text-[12px] text-[#4F4F4F] font-regular uppercase tracking-wider block mb-2">Bio</span>
              <p className="text-[14px] text-[#121212] font-medium">{user?.bio || "Tell us about your beauty expertise..."}</p>
           </div>
        </div>
      </div>
    </div>
  );
}
