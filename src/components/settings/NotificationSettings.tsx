"use client";

import React, { useState } from "react";

export default function NotificationSettings() {
  const [settings, setSettings] = useState([
    { id: "campaign", title: "Campaign updates", description: "Get notified about campaign progress and completion", enabled: true },
    { id: "insights", title: "AI insights", description: "Receive AI-powered recommendations and insights", enabled: true },
    { id: "team", title: "Team activity", description: "Updates from team members and collaborators", enabled: false },
    { id: "weekly", title: "Weekly summary", description: "Weekly analytics and performance reports", enabled: true },
  ]);

  const toggle = (id: string) => {
    setSettings(settings.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-[18px] font-medium text-[#121212]">Notification Preferences</h3>
      </div>

      <div className="flex flex-col gap-[12px] px-[12px]">
        {settings.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[16px] font-medium text-[#121212]">{item.title}</span>
              <span className="text-[14px] text-[#64748B]">{item.description}</span>
            </div>
            <button 
              onClick={() => toggle(item.id)}
              className={`relative w-[50px] h-[28px] rounded-full transition-colors duration-200 outline-none ${
                item.enabled ? 'bg-[#02022C]' : 'bg-[#E2E8F0]'
              }`}
            >
              <div className={`absolute top-[4px] left-[4px] w-[20px] h-[20px] bg-white rounded-full shadow-sm transition-transform duration-200 ${
                item.enabled ? 'translate-x-[22px]' : 'translate-x-0'
              }`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
