"use client";


import { Icons } from "@/components/ui/icons";
import { CustomIcons } from "../ui/custom-icons";
import { cn } from "@/lib/utils"; // Assuming cn utility is available here

interface ProductionPipelineProps {
  status: string;
  message: string;
  videoUrl?: string | null;
}

export default function ProductionPipeline({ status, message, videoUrl }: ProductionPipelineProps) {
  const getStepStatus = (label: string): "completed" | "active" | "pending" => {
    const s = status?.toLowerCase();
    if (s === "delivered" || s === "ready" || s === "completed") return "completed";
    if (!status || s === "draft") return "pending";
    if (s === "failed") return "pending";

    const msg = message?.toLowerCase() || "";
    
    // Mapping statuses based on the provided backend logic
    switch (label) {
      case "Prompt":
      case "Creative Brief":
        return "completed"; // These are always done before we reach queued/production

      case "Image Generation":
        if (s === "queued") return "pending";
        if (s === "in_production" && msg.includes("images")) return "active";
        if (s === "in_production" || s === "ready_for_human_review" || s === "approved") return "completed";
        return "pending";

      case "Copy Generation":
        if (s === "in_production" && msg.includes("copy")) return "active";
        if (s === "ready_for_human_review" || s === "approved") return "completed";
        return "pending";

      case "Audio Generation":
        if (s === "in_production" && msg.includes("audio")) return "active";
        if (s === "ready_for_human_review" || s === "approved") return "completed";
        return "pending";

      case "Editor":
        if (s === "in_production" && msg.includes("video")) return "active";
        if (s === "ready_for_human_review" || s === "approved" || s === "delivered" || videoUrl) return "completed";
        return "pending";

      case "Rendering":
        if (s === "in_production" && msg.includes("render")) return "active";
        if (videoUrl || s === "ready_for_human_review" || s === "approved" || s === "delivered") return "completed";
        return "pending";

      case "Quality Check":
        if (s === "ready_for_human_review" || s === "approved") return "active";
        // If video exists but status hasn't caught up, it's effectively in quality check
        if (videoUrl && s === "in_production") return "active";
        if (s === "delivered" || s === "ready") return "completed";
        return "pending";

      default:
        return "pending";
    }
  };

  const steps = [
    { label: "Prompt", status: getStepStatus("Prompt") },
    { label: "Creative Brief", status: getStepStatus("Creative Brief") },
    { label: "Image Generation", status: getStepStatus("Image Generation") },
    { label: "Copy Generation", status: getStepStatus("Copy Generation") },
    { label: "Audio Generation", status: getStepStatus("Audio Generation") },
    { label: "Editor", status: getStepStatus("Editor") },
    { label: "Rendering", status: getStepStatus("Rendering") },
    { label: "Quality Check", status: getStepStatus("Quality Check") },
  ];

  return (
    <div className="p-8 rounded-[12px] overflow-x-auto custom-scrollbar">
      <div className="flex items-center justify-between min-w-[800px] relative">
        {/* Connection Line */}

        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-3 relative z-10">
            <div className="w-[48px] h-[48px] rounded-[8px] flex items-center justify-center border-[0.35px] border-[#0000001A] backdrop-blur-sm transition-all">
              {step.status === "completed" ? (
                <CustomIcons.Success className="w-5 h-5"/> 
              ) : (
                <div className={cn(
                  "w-[20px] h-[20px] rounded-[8px] flex items-center justify-center border-[0.35px] border-[#0000001A] backdrop-blur-sm transition-all",
                  step.status === "active" && "bg-[#02022C]/10 border-[#02022C] animate-pulse"
                )} />
              )}
            </div>
            <span className={cn(
              "text-[12px] font-medium text-center whitespace-nowrap text-[#121212]",
              step.status === "active" && "text-[#02022C] font-bold"
            )}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
