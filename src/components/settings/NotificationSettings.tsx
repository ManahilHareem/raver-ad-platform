"use client";

import React, { useState } from "react";

interface NotificationSettingsProps {
  user: any;
  onUpdate: () => void;
  isLoading?: boolean;
}

import { apiFetch } from "@/lib/api";

export default function NotificationSettings({ user, onUpdate, isLoading = false }: NotificationSettingsProps) {
  const settings = [
    { id: "campaignUpdates", title: "Campaign updates", description: "Get notified about campaign progress and completion", enabled: user?.campaignUpdates ?? true },
    { id: "aiInsights", title: "AI insights", description: "Receive AI-powered recommendations and insights", enabled: user?.aiInsights ?? true },
    { id: "teamActivity", title: "Team activity", description: "Updates from team members and collaborators", enabled: user?.teamActivity ?? false },
    { id: "weeklySummary", title: "Weekly summary", description: "Weekly analytics and performance reports", enabled: user?.weeklySummary ?? true },
  ];

  const toggle = async (id: string, currentVal: boolean) => {
    try {
      const response = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [id]: !currentVal }),
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') return;
      console.error("Failed to update notifications:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-[18px] font-medium text-[#121212]">Notification Preferences</h3>
      </div>

      <div className="flex flex-col gap-[12px] px-[12px]">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 animate-pulse">
              <div className="flex flex-col gap-2">
                <div className="h-5 w-40 bg-gray-200 rounded" />
                <div className="h-4 w-64 bg-gray-100 rounded" />
              </div>
              <div className="w-[50px] h-[28px] bg-gray-200 rounded-full" />
            </div>
          ))
        ) : (
          settings.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[16px] font-medium text-[#121212]">{item.title}</span>
                <span className="text-[14px] text-[#64748B]">{item.description}</span>
              </div>
              <button 
                onClick={() => toggle(item.id, item.enabled)}
                className={`relative w-[50px] h-[28px] rounded-full transition-colors duration-200 outline-none ${
                  item.enabled ? 'bg-[#02022C]' : 'bg-[#E2E8F0]'
                }`}
              >
                <div className={`absolute top-[4px] left-[4px] w-[20px] h-[20px] bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  item.enabled ? 'translate-x-[22px]' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
