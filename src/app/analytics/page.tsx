"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  EngagementChart, 
  PlatformDistributionChart, 
  ContentPerformanceChart, 
  DemographicsChart 
} from "@/components/analytics/AnalyticsCharts";
import CampaignPerformanceTable from "@/components/analytics/CampaignPerformanceTable";
import { Icons } from "@/components/ui/icons";

const topStats = [
  { label: "Total Views", value: "18.4K", trend: "+12%", color: "#02022C" },
  { label: "Total Likes", value: "4.3K", trend: "+21%", color: "#02022C" },
  { label: "New Followers", value: "1.3K", trend: "+15%", color: "#02022C" },
  { label: "Shares", value: "250", trend: "-5%", color: "#02022C" },
];

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-[10px] p-[20px] mx-auto w-full bg-[#FFFFFF] border-[0.35px] border-[#0000001A] rounded-[12px]">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
                <h1 className="text-[30px] font-bold text-[#121212]">Analytics</h1>
                <p className="text-[16px] font-regular text-[#4F4F4F]">
                    Track your campaign performance and engagement across platforms
                </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-[12px] text-[14px] font-medium text-[#121212] hover:bg-gray-50 transition-colors shadow-sm">
                <Icons.Clock className="w-4 h-4 text-[#64748B]" />
                Select Date
                <Icons.Plus className="w-4 h-4 rotate-45 text-[#64748B]" />
            </button>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topStats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[16px] border border-[#0000000D] shadow-sm flex flex-col gap-2">
              <span className="text-[12px] font-medium text-[#4F4F4F] uppercase tracking-wider">{stat.label}</span>
              <div className="flex items-baseline justify-between transition-transform hover:scale-105 duration-300">
                <span className="text-[28px] font-bold text-[#02022C]">{stat.value}</span>
                <span className={`text-[12px] font-bold px-2 py-1 rounded-full ${
                  stat.trend.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                }`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-[16px] border border-[#0000000D] shadow-sm">
            <div className="flex flex-col gap-[12px]">
                <h3 className="text-[18px] font-bold text-[#121212]">Engagement Over Time</h3>
                <p className="text-[12px] text-[#4F4F4F]">Daily performance overview for the last 7 days</p>
            </div>
            <EngagementChart />
          </div>
          
          <div className="bg-white p-6 rounded-[16px] border border-[#0000000D] shadow-sm">
            <div className="flex flex-col gap-[12px]">
                <h3 className="text-[18px] font-bold text-[#121212]">Platform Distribution</h3>
                <p className="text-[12px] text-[#4F4F4F]">Traffic source breakdown</p>
            </div>
            <PlatformDistributionChart />
          </div>
        </div>

        {/* Campaign Performance Table Section */}
        <div className=" rounded-[16px]">
            <div className="flex flex-col gap-[12px]">
                <h3 className="text-[18px] font-bold text-[#121212]">Top Performing Campaigns</h3>
            </div>
            <CampaignPerformanceTable />
        </div>

        {/* Demographics and Performance Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#F8F8F8] p-6 rounded-[16px] border border-[#0000000D] shadow-sm">
                <div className="flex flex-col gap-1 mb-8">
                    <h3 className="text-[18px] font-bold text-[#121212]">Content Type Performance</h3>
                    <p className="text-[13px] font-regular text-[#4F4F4F]">Which types of content perform best</p>
                </div>
                <ContentPerformanceChart />
            </div>

            <div className="bg-[#F8F8F8] p-6 rounded-[16px] border border-[#0000000D] shadow-sm">
                <div className="flex flex-col gap-1 mb-6">
                    <h3 className="text-[18px] font-bold text-[#121212]">Audience Demographics</h3>
                    <p className="text-[13px] font-regular text-[#4F4F4F]">Age and gender breakdown of your audience</p>
                </div>
                <DemographicsChart />
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
