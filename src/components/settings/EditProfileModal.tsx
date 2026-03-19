"use client";

import React, { useState, useEffect } from "react";
import { Icons } from "@/components/ui/icons";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSuccess: () => void;
}

export default function EditProfileModal({ isOpen, onClose, user, onSuccess }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    professionalRole: "Hair Stylish",
    bio: "Tell us about your beauty expertise...",
    instagram: "",
    facebook: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        professionalRole: user.professionalRole || "Hair Stylish",
        bio: user.bio || "Tell us about your beauty expertise...",
        instagram: user.instagram || "",
        facebook: user.facebook || ""
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = getCookie("raver_token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to update profile");
      }
    } catch (err: any) {
      console.error("Update Profile Error:", err);
      setError(err.message || "An error occurred while updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[500px] rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-6 pb-4 border-b border-[#F1F5F9] flex items-center justify-between">
          <h2 className="text-[18px] font-medium text-[#121212]">Edit Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#F1F5F9] rounded-full transition-colors">
            <Icons.Plus className="w-5 h-5 rotate-45 text-[#64748B]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-[#121212]">Full Name</label>
            <input 
              type="text" 
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-5 py-3 bg-[#F8F8F8] border border-[#F1F5F9] rounded-[12px] text-[15px] outline-none focus:border-[#02022C] transition-all"
              placeholder="Your full name"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-[#121212]">Hair Style</label>
            <input 
              type="text" 
              value={formData.professionalRole}
              onChange={(e) => setFormData({ ...formData, professionalRole: e.target.value })}
              className="w-full px-5 py-3 bg-[#F8F8F8] border border-[#F1F5F9] rounded-[12px] text-[15px] outline-none focus:border-[#02022C] transition-all"
              placeholder="e.g. Hair Stylish, Colorist"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-[#121212]">Bio</label>
            <textarea 
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-5 py-3 bg-[#F8F8F8] border border-[#F1F5F9] rounded-[12px] text-[15px] outline-none focus:border-[#02022C] transition-all min-h-[120px] resize-none"
              placeholder="Tell us about your expertise..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-bold text-[#121212]">Instagram</label>
              <div className="relative">
                <Icons.Instagram className="absolute left-3 top-3.5 w-4 h-4 text-[#64748B]" />
                <input 
                  type="text" 
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-[#F8F8F8] border border-[#F1F5F9] rounded-[12px] text-[15px] outline-none focus:border-[#02022C] transition-all"
                  placeholder="@username"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-bold text-[#121212]">Facebook</label>
              <div className="relative">
                <Icons.Facebook className="absolute left-3 top-3.5 w-4 h-4 text-[#64748B]" />
                <input 
                  type="text" 
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-[#F8F8F8] border border-[#F1F5F9] rounded-[12px] text-[15px] outline-none focus:border-[#02022C] transition-all"
                  placeholder="Profile URL"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-[#F1F5F9] rounded-[12px] text-[15px] font-medium text-[#64748B] hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-[#02022C] text-white rounded-[12px] text-[15px] font-medium hover:opacity-90 transition-all shadow-[inset_0px_-5px_5px_0px_#4F569B]"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
