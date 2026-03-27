"use client";

import React, { useState } from "react";
import AgentCard from "@/components/agents/AgentCard";
import AgentModal from "@/components/agents/AgentModal";
import DashboardLayout from "@/components/DashboardLayout";
import { Icons } from "@/components/ui/icons";

const agents = [
  {
    name: "Raver Director",
    role: "The Conversational Interface",
    description: "The face of the platform. Understands your brand, recalls history, and translates natural language requests into production-ready creative briefs.",
    tasksCompleted: 342,
    imagePath: "/assets/Agents/8984842c071cc3d6c53b1ee1436fcc5be51bf749.png"
  },
  {
    name: "Raver Producer",
    role: "Workflow and Cost Governance",
    description: "The operational backbone. Constructs and supervises every campaign's task graph, enforces budget limits, and coordinates all specialist agents.",
    tasksCompleted: 342,
    imagePath: "/assets/Agents/3312cfe5907b89d344f62300fa14abb98dd36d5f.png"
  },
  {
    name: "Raver Image Lead",
    role: "Visual Creation and Consistency",
    description: "The engine of creative work. Selects or generates visual foundations, enforces consistency across scenes, and manages the Media Vault.",
    tasksCompleted: 342,
    imagePath: "/assets/Agents/60b804a5d0b90e7a913d87fe7ca5c4a34ec70ca3 (1).png"
  },
  {
    name: "Raver Copy Lead",
    role: "Brand Voice and Written Content",
    description: "The voice behind the visual. Generates scripts, captions, overlay text, CTAs, and hashtags within your brand voice profile.",
    tasksCompleted: 342,
    imagePath: "/assets/Agents/967f94460b7fef83ca116b2d2c74567f7b4f30c2 (1).png"
  },
  {
    name: "Raver Audio Lead",
    role: "The Conversational Interface",
    description: "The emotional layer. Selects or generates music and voiceovers for every video campaign, matched to campaign tone and aesthetic.",
    tasksCompleted: 342,
    imagePath: "/assets/Agents/b80a16712c21ce4c5f901b0bcaea57afb9eeaa5a.png",
    isAudio: true
  },
  {
    name: "Raver Editor",
    role: "Composition and Rendering",
    description: "The delivery engine. Assembles all generated assets into finished, platform-ready campaigns in 9:18, 1:1, and 16:9 formats.",
    tasksCompleted: 342,
    imagePath: "/assets/Agents/6d17217682889c113f066a854abc4cbda5f44fde (1).png"
  },
  {
    name: "Raver Quality Lead",
    role: "Automated Quality Scoring",
    description: "The guardrail of the brand. Evaluates every campaign across five weighted dimensions and auto-rejects substandard outputs.",
    tasksCompleted: 342,
    imagePath: "/assets/Agents/c21553f07d62ee70c0e475351ab0cdeee677630b.png"
  },
  {
    name: "Human Creative Director",
    role: "Editorial Oversight",
    description: "The final signal. Every campaign receives mandatory reviews to ensure genuinely excellent work and establish editorial standards.",
    tasksCompleted: 342,
    imagePath: "/assets/Agents/9123f7057876603e4da9619c406b58d24bb89a30.png"
  },
  {
    name: "Memory Service",
    role: "Persistent Professional Context",
    description: "The intelligence that compounds. Stores aesthetic preferences, successful campaigns, brand voice, and seasonal patterns.",
    tasksCompleted: 342,
    imagePath: "/assets/Agents/f22dd5ddf7bd0ad1b90eea1249269b7d6b1b6d83.png"
  },
  {
    name: "Opportunity Engine",
    role: "Proactive Campaign Intelligence",
    description: "Revenue you didn't know to ask for. Monitors trends, events, and weather to generate proactive creative suggestions.",
    tasksCompleted: 342,
    imagePath: "/assets/Agents/d99f94f203e0f1b68ad1ae24e5695f933c4963a9.png"
  }
];

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<typeof agents[0] | null>(null);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-[10px] p-[10px] bg-[#F8FAFC] min-h-screen">
      <div className="flex flex-col gap-[16px] p-[16px] rounded-[12px] bg-[#FFFFFF] border-[0.35px] border-[#0000001A]">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] font-bold text-[#121212]">Ai Agents</h1>
        <p className="text-[16px] text-[#4F4F4F] font-regular">
          10 specialized AI agents working together to create professional beauty marketing campaigns
        </p>
      </div>

      {/* Stats Section */}
      <div className="flex flex-row  w-full   gap-[12px]">
        {[
          { label: "Active Agents", value: "10/10", sub: "100%", trend: "up" },
          { label: "Total Tasks Completed", value: "4,798", sub: "This Month", trend: "up" },
          { label: "Campaign Success Rate", value: "94%", sub: "+8%", trend: "up" }
        ].map((stat, i) => (
          <div key={i} className="bg-[#F8F8F8] w-full h-[98px] px-[21px] pt-[21px] pb-px rounded-[8px] border border-[#F1F5F9] shadow-sm flex flex-col gap-2">
            <span className="text-[12px] font-medium text-[#64748B]">{stat.label}</span>
            <div className="flex items-end justify-between">
              <span className="text-[24px] font-bold text-[#02022C]">{stat.value}</span>
              <span className="text-[12px] font-bold text-[#02022C]">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>
        </div>

      {/* Team Grid */}
      <div className="flex flex-col gap-[16px] bg-[#FFFFFF] p-[16px] rounded-[12px] border-[0.35px] border-[#0000001A]">
        <h2 className="text-[18px] font-medium text-[#121212]">Your AI Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px] w-full">
          {agents.slice(0, 10).map((agent, i) => (
            <AgentCard 
              key={i} 
              {...agent} 
              onClick={() => setSelectedAgent(agent)}
              actionLabel={agent.name === "Raver Image Lead" ? "Start Creating" : undefined}
              onAction={(e) => {
                if (agent.name === "Raver Image Lead") {
                  e.stopPropagation();
                  window.location.href = "/agents/image-lead";
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Workflow Section */}
      <div className="flex flex-col gap-[16px] bg-[#FFFFFF] p-[16px] rounded-[12px] border-[0.35px] border-[#0000001A]">
        <h2 className="text-[18px] font-medium text-[#121212]">How Your AI Team Works Together</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              step: 1, 
              title: "You Speak to Director", 
              desc: "Tell the Director what you need in natural language. It understands your brand and translates your request into a creative brief." 
            },
            { 
              step: 2, 
              title: "Producer Coordinates Team", 
              desc: "The Producer builds a task graph and coordinates Image Lead, Copy Lead, Audio Lead, and Editor to create your campaign." 
            },
            { 
              step: 3, 
              title: "Quality Check & Delivery", 
              desc: "Quality Lead scores the output, Human Creative Director reviews it. You receive platform-ready content in minutes." 
            }
          ].map((item, i) => (
            <div key={i} className="bg-[#F8F8F8] p-[12px] rounded-[12px] border-[0.35px] border-[#0000001A] shadow-sm flex flex-col gap-4">
              <div className="w-[40px] h-[40px] rounded-[12px] bg-white flex items-center justify-center text-[18px] font-bold text-[#02022C]">
                {item.step}
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-[14px] font-medium text-[#121212]">{item.title}</h4>
                <p className="text-[12px] text-[#4F4F4F]  leading-relaxed font-regular">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      <AgentModal 
        agent={selectedAgent} 
        isOpen={!!selectedAgent} 
        onClose={() => setSelectedAgent(null)} 
        onAction={() => {
          if (selectedAgent?.name === "Raver Image Lead") {
            window.location.href = "/agents/image-lead";
          }
        }}
      />
    </DashboardLayout>
  );
}
