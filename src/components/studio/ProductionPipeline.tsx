
"use client";


import { Icons } from "@/components/ui/icons";
import { CustomIcons } from "../ui/custom-icons";

const steps = [
  { label: "Prompt", icon: Icons.Mic, status: "completed" },
  { label: "Creative Brief", icon: Icons.Clock, status: "pending" },
  { label: "Image Generation", icon: Icons.Image, status: "pending" },
  { label: "Copy Generation", icon: Icons.Text, status: "pending" },
  { label: "Audio Generation", icon: Icons.Video, status: "pending" },
  { label: "Editor", icon: Icons.Maximize, status: "pending" },
  { label: "Quality Check", icon: Icons.Bell, status: "pending" },
  { label: "Rendering", icon: Icons.Database, status: "pending" },
];

export default function ProductionPipeline() {
  return (
    <div className=" p-8 rounded-[12px] overflow-x-auto custom-scrollbar">
      <div className="flex items-center justify-between min-w-[800px] relative">
        {/* Connection Line */}
        
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-3 relative z-10">
            <div className="w-[48px] h-[48px] rounded-[8px] flex items-center justify-center border-[0.35px] border-[#0000001A] backdrop-blur-sm transition-all">
              {step.status === "completed" ? <CustomIcons.Success className="w-5 h-5"/> : <div className="w-[20px] h-[20px] rounded-[8px] flex items-center justify-center border-[0.35px] border-[#0000001A] backdrop-blur-sm transition-all" />}
            </div>
            <span className={`text-[12px] font-medium text-center whitespace-nowrap text-[#121212]`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
