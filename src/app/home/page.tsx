"use client";

import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import QuickCreateCard from "@/components/dashboard/QuickCreateCard";
import ProjectCard from "@/components/dashboard/ProjectCard";
import { Icons } from "@/components/ui/icons";
import {CustomIcons} from "@/components/ui/custom-icons";
const stats = [
  { label: "Total Projects", value: "24", change: "12%", icon: Icons.Dashboard, trend: "up" as const },
  { label: "Content Generated", value: "1,847", change: "5.2%", icon: Icons.CreativeStudio, trend: "up" as const },
  { label: "Team Members", value: "12", change: "2%", icon: Icons.AIAgents, trend: "up" as const },
  { label: "Credits Remaining", value: "250", change: "10%", icon: Icons.Database, trend: "down" as const },
];

const quickActions = [
  { title: "Create Image", icon: Icons.Image, gradient: "bg-[linear-gradient(90deg,_#01012A_0%,_#2E2C66_100%)]" },
  { title: "Create Video", icon: Icons.Video, gradient: "bg-[linear-gradient(135deg,_#F6339A_0%,_#FB2C36_100%)]" },
  { title: "Generate Text", icon: Icons.Text, gradient: "bg-[linear-gradient(135deg,_#00C950_0%,_#00BC7D_100%)]" },
  { title: "Start AI Project", icon: Icons.MagicWand, gradient: "bg-[linear-gradient(135deg,_#FF6900_0%,_#F0B100_100%)]" },
  { title: "Open Template", icon: CustomIcons.Templates, gradient: "bg-[linear-gradient(90deg,_#01012A_0%,_#2E2C66_100%)]" },
];

const recentProjects = [
  { 
    title: "Summer Campaign 2024", 
    time: "2 hours", 
    members: 3, 
    image: "/assets/f3866e13f8851b89b6d19d9a6186e137dbe58fcc.jpg" 
  },
  { 
    title: "Social Media Content", 
    time: "5 hours", 
    members: 1, 
    image: "/assets/6a42346bb1ab28815fb6775ac20c4470feb95d78.jpg" 
  },
  { 
    title: "Website Redesign", 
    time: "1 hour", 
    members: 5, 
    image: "/assets/f3866e13f8851b89b6d19d9a6186e137dbe58fcc.jpg" 
  },
];

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col bg-[#FFFFFF] gap-[16px] rounded-[12px] max-w-[1400px] mx-auto p-[16px]">
        {/* Welcome Section */}
        <div className="flex flex-col gap-[2px]">
          <h1 className="text-[30px] font-bold text-[#121212]">Welcome back!</h1>
          <p className="text-[16px] text-[#4F4F4F]">Here&apos;s an overview of your workspace.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatsCard key={i} {...stat} />
          ))}
        </div>

        {/* Quick Create Section */}
        <div className="flex flex-col gap-[12px]">
          <h2 className="text-[18px] font-medium text-[#02022C]">Quick Create</h2>
          <div className="flex flex-wrap gap-[9px]">
            {quickActions.map((action, i) => (
              <QuickCreateCard key={i} {...action} />
            ))}
          </div>
        </div>

        {/* Recent Projects Section */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-medium text-[#02022C]">Recent Projects</h2>
            <button className="text-[14px] font-semibold text-[#02022C] hover:underline flex items-center gap-2">
              View All <Icons.ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentProjects.map((project, i) => (
              <ProjectCard key={i} {...project} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
