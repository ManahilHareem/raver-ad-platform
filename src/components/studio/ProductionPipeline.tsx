"use client";


import { Icons } from "@/components/ui/icons";
import { CustomIcons } from "../ui/custom-icons";
import { cn } from "@/lib/utils"; // Assuming cn utility is available here

interface ProductionPipelineProps {
  status: string;
  message: string;
  videoUrl?: string | null;
  completedNodes?: string[];
}

export default function ProductionPipeline({ status, message, videoUrl, completedNodes = [] }: ProductionPipelineProps) {
  const getStepStatus = (label: string): "completed" | "active" | "pending" => {
    const s = status?.toLowerCase() || "";
    const msg = message?.toLowerCase() || "";
    
    // Explicit completion nodes from director API
    const nodeMap: Record<string, string[]> = {
      "Image Generation": ["generate_image", "generate_images", "generate-images"],
      "Copy Generation": ["generate_text", "generate_script", "generate-copy"],
      "Audio Generation": ["generate_voice", "generate_music", "generate-audio"],
      "Editor": ["render", "assemble_video", "build_video"], 
      "Rendering": ["render", "video_render"],
      "Quality Check": ["score_quality", "check_quality", "guardrails"]
    };

    // Terminal statuses that mean everything is done
    const terminalStatuses = ["delivered", "ready", "completed", "ready_for_human_review", "ready for human review", "approved", "shipped"];
    const isTerminal = terminalStatuses.some(ts => s === ts || s.includes(ts) || s.replace(/_/g, ' ') === ts);

    // Define step order for waterfall logic
    const stepOrder = [
      "Prompt",
      "Creative Brief",
      "Image Generation",
      "Copy Generation",
      "Audio Generation",
      "Editor",
      "Rendering",
      "Quality Check"
    ];

    const currentStepIndex = stepOrder.indexOf(label);

    // Waterfall logic: If any later step is completed, this step is also completed
    const isLaterStepCompleted = stepOrder.slice(currentStepIndex + 1).some(laterLabel => {
      // Check if later step is in completedNodes
      if (nodeMap[laterLabel]?.some(node => completedNodes.includes(node))) return true;
      
      // Check if later step is implied by terminal status
      if (isTerminal) return true;

      // Special case: if videoUrl exists, everything up to Rendering is done
      if (videoUrl && (laterLabel === "Rendering" || laterLabel === "Editor")) return true;

      return false;
    });

    if (isLaterStepCompleted) return "completed";

    // Direct check for current step in completedNodes
    if (nodeMap[label]?.some(node => completedNodes.includes(node))) {
      return "completed";
    }

    // Implicit completion based on status or video presence
    if (isTerminal) return "completed";
    
    // Default completions for early stages
    if (label === "Prompt" || label === "Creative Brief") return "completed";

    // Status/Message based active/completed fallbacks
    switch (label) {
      case "Image Generation":
        if (s === "in_production" && (msg.includes("image") || msg.includes("visual"))) return "active";
        if (s === "in_production" || s === "ready_for_human_review" || s === "approved") return "completed";
        break;

      case "Copy Generation":
        if (s === "in_production" && (msg.includes("copy") || msg.includes("script") || msg.includes("text"))) return "active";
        if (s === "ready_for_human_review" || s === "approved") return "completed";
        break;

      case "Audio Generation":
        if (s === "in_production" && (msg.includes("audio") || msg.includes("voice") || msg.includes("music"))) return "active";
        if (s === "ready_for_human_review" || s === "approved") return "completed";
        break;

      case "Editor":
        if (s === "in_production" && (msg.includes("video") || msg.includes("editing") || msg.includes("assemble"))) return "active";
        if (s === "ready_for_human_review" || s === "approved" || videoUrl) return "completed";
        break;

      case "Rendering":
        if (s === "in_production" && (msg.includes("render") || msg.includes("encoding"))) return "active";
        if (videoUrl || s === "ready_for_human_review" || s === "approved") return "completed";
        break;

      case "Quality Check":
        if (s === "ready_for_human_review") return "active";
        if (videoUrl && s === "in_production" && !msg.includes("render")) return "active";
        if (s === "delivered" || s === "ready" || s === "approved") return "completed";
        break;
    }

    return "pending";
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
