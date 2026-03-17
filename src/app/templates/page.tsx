"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import TemplateCard from "@/components/templates/TemplateCard";
import TemplateModal from "@/components/templates/TemplateModal";
import { cn } from "@/lib/utils";

const categories = [
  "All Templates",
  "Social Media",
  "Ads & Promotions",
  "Branding",
  "Video Content"
];

const templates = [
  // Column 1
  {
    title: "Makeup Tutorial Series",
    imagePath: "/assets/Template images /35282b8da06ec3e8e994540eff7f2fdbc623a01f.jpg",
    category: "Video Content",
    aspectRatio: "portrait",
    time: "2 hours ago",
    members: 3
  },
  {
    title: "Luxury Spa Promotion",
    imagePath: "/assets/Template images /40156466b18f4c31e97beb972b4b9008524c7b98.jpg",
    category: "Ads & Promotions",
    aspectRatio: "landscape",
    time: "1 hour ago",
    members: 2
  },
  {
    title: "Signature Glow Campaign",
    imagePath: "/assets/Template images /76aa3198e62eb617bb9f0d5cafa17ab8b1b1f2e2.jpg",
    category: "Social Media",
    aspectRatio: "portrait",
    time: "30 mins ago",
    members: 5
  },
  // Column 2
  {
    title: "Summer Hair Color Campaign",
    imagePath: "/assets/Template images /e014f16d6ac266d999b6cfaa999eceec057a361d.jpg",
    category: "Social Media",
    aspectRatio: "portrait",
    time: "2 hours ago",
    members: 3
  },
  {
    title: "Minimalist Skincare Ad",
    imagePath: "/assets/Template images /3247e2d37a108f21ab9ab00ab905d73decf83b64.jpg",
    category: "Ads & Promotions",
    aspectRatio: "square",
    time: "4 hours ago",
    members: 1
  },
  {
    title: "Fragrance Collection",
    imagePath: "/assets/Template images /4b7bdcb179e32b9af114fd0170adf50c53a4b060.jpg",
    category: "Branding",
    aspectRatio: "portrait",
    time: "1 day ago",
    members: 4
  },
  // Column 3
  {
    title: "Product Launch Video",
    imagePath: "/assets/Template images /71e298c05e8d785491ebb24678f8c88e1b7194cd.jpg",
    category: "Video Content",
    aspectRatio: "landscape",
    time: "3 hours ago",
    members: 6
  },
  {
    title: "Daily Skincare Routine",
    imagePath: "/assets/Template images /5848f944078b1cf8c3d4dc417dae4c9e60024951.jpg",
    category: "Social Media",
    aspectRatio: "square",
    time: "5 hours ago",
    members: 2
  },
  {
    title: "Beauty Brand Story",
    imagePath: "/assets/Template images /1f26e30e7625c0d9542da3aa237eb1766fd402e0.jpg",
    category: "Branding",
    aspectRatio: "portrait",
    time: "2 days ago",
    members: 3
  }
];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("All Templates");
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);

  const filteredTemplates = templates.filter(t => 
    activeCategory === "All Templates" || t.category === activeCategory
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-[10px] p-[10px] bg-[#F8FAFC] min-h-screen">
        
        {/* Header & Stats Section */}
        <div className="flex flex-col gap-[24px] p-[24px] rounded-[12px] bg-[#FFFFFF] border-[0.35px] border-[#0000001A]">
          <div className="flex flex-col gap-2">
            <h1 className="text-[30px] font-bold text-[#121212]">Templates Library</h1>
            <p className="text-[16px] text-[#4F4F4F] font-regular">
              Professional beauty marketing templates ready to customize for your brand
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
            {[
              { label: "Total Templates", value: "9" },
              { label: "Templates Used", value: "5" },
              { label: "Custom Templates", value: "2" }
            ].map((stat, i) => (
              <div key={i} className="bg-[#F8F8F8] p-5 rounded-[8px] border border-[#F1F5F9] shadow-sm flex flex-col gap-1">
                <span className="text-[12px] font-medium text-[#64748B]">{stat.label}</span>
                <span className="text-[24px] font-bold text-[#02022C]">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-[24px] bg-[#FFFFFF] p-[24px] rounded-[12px] border-[0.35px] border-[#0000001A] flex-1">
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 h-[48px]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-[16px] py-[12px] rounded-[8px] text-[14px] font-bold transition-all duration-200",
                  activeCategory === cat 
                    ? "bg-[linear-gradient(90deg,#01012A_0%,#2E2C66_100%)] text-white shadow-lg" 
                    : "bg-[#F1F5F9] text-[#121212] hover:bg-[linear-gradient(90deg,#01012A_0%,#2E2C66_100%)] hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry Grid Implementation */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-[16px] space-y-[16px]">
            {filteredTemplates.map((template, i) => (
              <div key={i} className="break-inside-avoid">
                <TemplateCard 
                  {...template} 
                  aspectRatio={template.aspectRatio as any}
                  onClick={() => setSelectedTemplate(template)}
                />
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-[#64748B]">
              <p className="text-[16px] font-medium">No templates found in this category.</p>
            </div>
          )}
        </div>
      </div>

      <TemplateModal 
        template={selectedTemplate}
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
      />
    </DashboardLayout>
  );
}
