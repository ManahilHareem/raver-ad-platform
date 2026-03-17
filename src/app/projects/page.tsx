"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProjectCard from "@/components/dashboard/ProjectCard";
import { Icons } from "@/components/ui/icons";

const projects = [
  {
    title: "Summer Campaign 2024",
    time: "2 hours",
    members: 3,
    image: "/assets/hashtag-campaign.jpg"
  },
  {
    title: "Social Media Content",
    time: "2 hours",
    members: 3,
    image: "/assets/hashtag-campaign.jpg"
  },
  {
    title: "Website Redesign",
    time: "1 hour",
    members: 5,
    image: "/assets/hashtag-campaign.jpg"
  },
  {
    title: "Mobile App Launch",
    time: "0 minutes",
    members: 4,
    image: "/assets/hashtag-campaign.jpg"
  },
  {
    title: "Social Media Content",
    time: "2 hours",
    members: 3,
    image: "/assets/hashtag-campaign.jpg"
  },
  {
    title: "Website Redesign",
    time: "1 hour",
    members: 5,
    image: "/assets/hashtag-campaign.jpg"
  }
];

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-[16px] p-[16px] bg-[#FFFFFF] min-h-screen border-[0.35px] border-[#0000001A] rounded-[12px]">
        {/* Header Section */}
        <div className="flex flex-col gap-[16px] rounded-[12px]  ">
          <div className="flex flex-col gap-[2px]">
            <h1 className="text-[30px] font-bold text-[#121212]">My Projects</h1>
            <p className="text-[16px] text-[#4F4F4F] font-regular">
              Manage and organize your creative projects
            </p>
          </div>
        </div>

        {/* Projects Grid Section */}
        <div className="flex flex-col gap-[16px] bg-[#FFFFFF] rounded-[12px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] w-full">
            {projects.map((project, i) => (
              <ProjectCard key={i} {...project} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
