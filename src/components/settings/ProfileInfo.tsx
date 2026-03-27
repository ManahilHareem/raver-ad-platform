import React, { useRef, useState } from "react";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";

interface ProfileInfoProps {
  user: any;
  onEdit: () => void;
  onAvatarUpdate: () => void;
  isLoading?: boolean;
}

export default function ProfileInfo({ user, onEdit, onAvatarUpdate, isLoading = false }: ProfileInfoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Get Pre-signed URL
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const response = await apiFetch(`${API_BASE}/users/profile-picture/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
        }),
      });

      if (!response.ok) throw new Error("Failed to get upload URL");
      const { data } = await response.json();
      const uploadUrl = data.uploadUrl;

      // 2. Upload to S3 (or compatible backend storage)
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadRes.ok) throw new Error("Failed to upload image");

      // 3. Inform parent to refresh
      onAvatarUpdate();
    } catch (err) {
      console.error("Profile Picture Upload Error:", err);
      alert(err instanceof Error ? err.message : "Failed to upload profile picture");
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h3 className="text-[18px] font-medium text-[#121212]">Profile Information</h3>
        
        {/* Banner and Avatar section with dynamic upload */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        <div className="relative w-full h-[180px] rounded-[16px] overflow-visible mb-16">
          <div className={cn(
            "w-full h-full rounded-[16px]",
            isLoading ? "bg-gray-100 animate-pulse" : "bg-[linear-gradient(90deg,#ABABFC_0%,#C4C4F4_50%,rgba(252,171,236,0.72)_100%)]"
          )} />
          <div className="absolute -bottom-12 left-6 w-[120px] h-[120px] rounded-[24px] border-4 border-white overflow-hidden bg-white shadow-sm group cursor-pointer transition-all hover:scale-[1.02]" onClick={handleAvatarClick}>
            {isLoading || isUploading ? (
              <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                {isUploading && <Icons.Loader className="w-6 h-6 text-slate-400 animate-spin" />}
              </div>
            ) : (
              <>
                <Image 
                  src={user?.avatarUrl || "/assets/Template images /5848f944078b1cf8c3d4dc417dae4c9e60024951.jpg"} 
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Icons.Camera className="w-6 h-6 text-white" />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col gap-2">
            {isLoading ? (
              <>
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
              </>
            ) : (
              <>
                <h4 className="text-[24px] font-bold text-[#121212]">{user?.fullName || "Hareem Ahsen"}</h4>
                <span className="text-[14px] text-[#4F4F4F]">{user?.email || "hareem.ahsen@example.com"}</span>
              </>
            )}
          </div>
          {!isLoading && (
            <button 
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 bg-[#F8F8F8] border border-[#F1F5F9] rounded-[12px] text-[14px] font-medium text-[#121212] hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Icons.PenLine className="w-4 h-4 text-[#121212]" />
              Edit Profile
            </button>
          )}
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
          {[
            { label: "Full Name", value: user?.fullName || "Hareem Ahsen", icon: Icons.User },
            { label: "Email", value: user?.email || "hareem.ahsen@example.com", icon: Icons.Mail },
            { label: "Hair Style", value: user?.professionalRole || "Hair Stylish", icon: Icons.MagicWand },
            { label: "Instagram", value: user?.instagram || "Not linked", icon: Icons.Instagram },
          ].map((field, idx) => (
            <div key={idx} className="flex items-start gap-3">
               <div className="p-2 bg-white rounded-[8px] border border-[#F1F5F9]">
                  <field.icon className="w-5 h-5 text-[#64748B]" />
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[12px] text-[#4F4F4F] font-regular uppercase tracking-wider">{field.label}</span>
                  {isLoading ? (
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <span className="text-[16px] font-medium text-[#121212]">{field.value}</span>
                  )}
               </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 mt-2">
           <div className="p-[20px] bg-white rounded-[16px] border border-[#F1F5F9]  gap-[12px] min-h-[120px]">
              <span className="text-[12px] text-[#4F4F4F] font-regular uppercase tracking-wider block mb-2">Bio</span>
              {isLoading ? (
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-4/6 bg-gray-100 rounded animate-pulse" />
                </div>
              ) : (
                <p className="text-[14px] text-[#121212] font-medium">{user?.bio || "Tell us about your beauty expertise..."}</p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
