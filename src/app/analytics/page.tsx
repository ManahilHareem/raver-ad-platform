"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  GenerationTimelineChart,
  AssetDistributionChart,
  AgentUtilizationChart,
  QualityAuditChart
} from "@/components/analytics/AnalyticsCharts";
import CampaignPerformanceTable from "@/components/analytics/CampaignPerformanceTable";
import { Icons } from "@/components/ui/icons";
import { apiFetch } from "@/lib/api";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
        const response = await apiFetch(`${API_BASE}/analytics/deep`);
        const json = await response.json();
        
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch deep analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Map API data to standard AI Studio platform metrics natively
  const topStats = data ? [
    { label: "Assets Generated", value: data.overview.totalAssets, trend: "+42%", color: "#02022C" },
    { label: "Studio Sessions", value: data.overview.totalSessions, trend: "+21%", color: "#02022C" },
    { label: "Active Campaigns", value: data.overview.totalCampaigns, trend: "+12%", color: "#02022C" },
    { label: "Quality Audits", value: data.overview.totalQualityAudits, trend: "+8%", color: "#02022C" },
  ] : [
    { label: "Assets Generated", value: "...", trend: "...", color: "#02022C" },
    { label: "Studio Sessions", value: "...", trend: "...", color: "#02022C" },
    { label: "Active Campaigns", value: "...", trend: "...", color: "#02022C" },
    { label: "Quality Audits", value: "...", trend: "...", color: "#02022C" },
  ];

  // Timeline for generation outputs
  const generationTimelineData = data ? data.generationTimeline.map((item: any) => ({
    name: item.label,
    assets: item.total
  })) : undefined;

  // Pie chart mapping
  const assetDistributionData = data ? [
    { name: "Image Assets", value: data.agentOutputs.images, color: "#EA4164" },
    { name: "Audio Files", value: data.agentOutputs.audio, color: "#3B82F6" },
    { name: "Copy Variants", value: data.agentOutputs.copy, color: "#121212" },
    { name: "Video Exports", value: data.agentOutputs.video, color: "#6366F1" },
  ].filter((d) => d.value > 0) : undefined;

  // Agent Utilization (Horizontal Progress Bars)
  const agentUtilizationData = data ? [
    { name: "Image Director", value: data.agentOutputs?.images || 0, assets: data.agentOutputs?.images || 0 },
    { name: "Audio Engineer", value: data.agentOutputs?.audio || 0, assets: data.agentOutputs?.audio || 0 },
    { name: "Copywriter", value: data.agentOutputs?.copy || 0, assets: data.agentOutputs?.copy || 0 },
    { name: "Video Producer", value: data.agentOutputs?.video || 0, assets: data.agentOutputs?.video || 0 },
  ].filter(c => c.value > 0).map(c => ({
    ...c,
    // Calculate percentage purely for the width of the progress bar display
    value: data.agentOutputs.total > 0 ? Math.round((c.value / data.agentOutputs.total) * 100) : 0
  })) : undefined;

  // Quality Audit Scores mapping for BarChart
  const qualityScoresData = data && data.qualitySummary ? [
    { name: "Visual", score: data.qualitySummary.avgVisualScore || 0 },
    { name: "Brand", score: data.qualitySummary.avgBrandAlignmentScore || 0 },
    { name: "Copy", score: data.qualitySummary.avgCopyScore || 0 },
    { name: "Audio", score: data.qualitySummary.avgAudioFitScore || 0 },
    { name: "Platform", score: data.qualitySummary.avgPlatformFitScore || 0 },
  ] : undefined;


  return (
    <DashboardLayout>
      <div className="flex flex-col gap-[10px] p-[20px] mx-auto w-full bg-[#FFFFFF] border-[0.35px] border-[#0000001A] rounded-[12px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-[30px] font-bold text-[#121212]">Analytics</h1>
            <p className="text-[16px] font-regular text-[#4F4F4F]">
              Comprehensive platform metrics across AI generation, campaigns, and quality governance
            </p>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-[16px] border border-[#0000000D] shadow-sm animate-pulse h-[100px]" />
            ))
          ) : (
            topStats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[16px] border border-[#0000000D] shadow-sm flex flex-col gap-2">
                <span className="text-[12px] font-medium text-[#4F4F4F] uppercase tracking-wider">{stat.label}</span>
                <div className="flex items-baseline justify-between transition-transform hover:scale-105 duration-300">
                  <span className="text-[28px] font-bold text-[#02022C]">{stat.value}</span>
                  <span className={`text-[12px] font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                    }`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-[16px] border border-[#0000000D] shadow-sm">
            <div className="flex flex-col gap-[12px]">
              <h3 className="text-[18px] font-bold text-[#121212]">Asset Generation Timeline</h3>
              <p className="text-[12px] text-[#4F4F4F]">Daily studio production output over the last 30 days</p>
            </div>
            <GenerationTimelineChart data={generationTimelineData} />
          </div>

          <div className="bg-white p-6 rounded-[16px] border border-[#0000000D] shadow-sm">
            <div className="flex flex-col gap-[12px]">
              <h3 className="text-[18px] font-bold text-[#121212]">Asset Distribution</h3>
              <p className="text-[12px] text-[#4F4F4F]">Breakdown of generated AI properties</p>
            </div>
            <AssetDistributionChart data={assetDistributionData} />
          </div>
        </div>

        {/* Campaign Performance Table Section */}
        <div className=" rounded-[16px]">
          <div className="flex flex-col gap-[12px]">
            <h3 className="text-[18px] font-bold text-[#121212]">Campaign Roster & Activity</h3>
          </div>
          <CampaignPerformanceTable data={data?.campaignRanking} />
        </div>

        {/* Details and Execution Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#F8F8F8] p-6 rounded-[16px] border border-[#0000000D] shadow-sm">
            <div className="flex flex-col gap-1 mb-8">
              <h3 className="text-[18px] font-bold text-[#121212]">Agent Utilization</h3>
              <p className="text-[13px] font-regular text-[#4F4F4F]">Frequency of discrete AI service calls</p>
            </div>
            <AgentUtilizationChart data={agentUtilizationData} />
          </div>

          <div className="bg-[#F8F8F8] p-6 rounded-[16px] border border-[#0000000D] shadow-sm">
            <div className="flex flex-col gap-1 mb-6">
              <h3 className="text-[18px] font-bold text-[#121212]">Quality Audit Scores</h3>
              <p className="text-[13px] font-regular text-[#4F4F4F]">Average governance grades mapped across dimensions</p>
            </div>
            <QualityAuditChart data={qualityScoresData} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

