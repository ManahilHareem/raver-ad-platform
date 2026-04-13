"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import { Icons } from "@/components/ui/icons";

const engagementData = [
  { name: "Day 1", views: 2400, engagement: 400 },
  { name: "Day 2", views: 1398, engagement: 300 },
  { name: "Day 3", views: 9800, engagement: 200 },
  { name: "Day 4", views: 3908, engagement: 2780 },
  { name: "Day 5", views: 4800, engagement: 1890 },
  { name: "Day 6", views: 3800, engagement: 2390 },
  { name: "Day 7", views: 4300, engagement: 3490 },
];

const platformData = [
  { name: "Instagram", value: 45, color: "#EA4164" },
  { name: "Facebook", value: 30, color: "#3B82F6" },
  { name: "TikTok", value: 18, color: "#121212" },
  { name: "YouTube", value: 7, color: "#FF0000" },
];

const contentTypeData = [
  { name: "Before & After", value: 85 },
  { name: "Tutorials", value: 72 },
  { name: "Product Shots", value: 68 },
  { name: "Client Reviews", value: 51 },
  { name: "Behind Scenes", value: 46 },
];

const demographicData = [
  { name: "18-24", female: 40, male: 20 },
  { name: "25-34", female: 55, male: 30 },
  { name: "35-44", female: 45, male: 25 },
  { name: "45-54", female: 30, male: 15 },
  { name: "55+", female: 20, male: 10 },
];

export const EngagementChart = () => (
  <div className="w-full h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={engagementData}>
        <defs>
          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#02022C" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#02022C" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#64748B', fontSize: 12 }} 
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#64748B', fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '12px', 
            border: 'none', 
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
          }} 
        />
        <Area 
          type="monotone" 
          dataKey="views" 
          stroke="#02022C" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorViews)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const PlatformDistributionChart = () => (
  <div className="w-full flex flex-col items-center gap-6">
    <div className="w-[200px] h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={platformData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={85}
            paddingAngle={8}
            cornerRadius={10}
            dataKey="value"
          >
            {platformData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Custom Legend */}
    <div className="grid grid-cols-2 gap-x-12 gap-y-4">
      {platformData.map((item) => (
        <div key={item.name} className="flex items-center gap-3">
          <div 
            className="w-[12px] h-[12px] rounded-full" 
            style={{ backgroundColor: item.color }} 
          />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider">{item.name}</span>
            <span className="text-[14px] font-bold text-[#121212]">{item.value}%</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ContentPerformanceChart = () => (
  <div className="flex flex-col gap-4">
    {contentTypeData.map((item) => (
      <div key={item.name} className="flex flex-col gap-2 transition-all hover:translate-x-1 duration-300">
        <div className="flex justify-between text-[12px] font-medium">
          <span className="text-[#121212] font-semibold">{item.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-[#64748B] text-[10px] uppercase font-bold tracking-widest">24 Assets</span>
            <span className="text-[#121212] font-black">{item.value}%</span>
          </div>
        </div>
        <div className="w-full h-[8px] bg-slate-100 rounded-full overflow-hidden border-[0.5px] border-slate-50">
          <div 
            className="h-full bg-[linear-to-r(90deg,#01012A_0%,#2E2C66_100%)] rounded-full transition-all duration-1000 shadow-sm" 
            style={{ width: `${item.value}%` }}
          />
        </div>
      </div>
    ))}
  </div>
);

export const DemographicsChart = () => (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={demographicData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748B', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748B', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }} 
          />
          <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
          <Bar dataKey="female" name="Female" fill="#01012A" radius={[4, 4, 0, 0]} barSize={20} />
          <Bar dataKey="male" name="Male" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
);
