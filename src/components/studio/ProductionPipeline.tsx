"use client";


import { Icons } from "@/components/ui/icons";
import { CustomIcons } from "../ui/custom-icons";
import { cn } from "@/lib/utils"; // Assuming cn utility is available here

interface ProductionPipelineProps {
  status: string;
  message: string;
  videoUrl?: string | null;
  completedNodes?: string[];
  campaignStatus?: string | null;
}

export default function ProductionPipeline({ status, message, videoUrl, completedNodes = [], campaignStatus }: ProductionPipelineProps) {
  const getStepStatus = (label: string): "completed" | "active" | "pending" | "awaiting_approval" => {
    const s = status?.toLowerCase() || "";
    const msg = message?.toLowerCase() || "";
    
    // Explicit completion nodes from director API
    const nodeMap: Record<string, string[]> = {
      "Image Generation": ["generate_image", "generate_images", "generate-images"],
      "Copy Generation": ["generate_text", "generate_script", "generate-copy"],
      "Voice Generation": ["generate_voice", "generate-voice"],
      "Music Generation": ["generate_music", "generate-music"],
      "Rendering": ["render", "video_render", "assemble_video", "build_video"],
      "Quality Check": ["score_quality", "check_quality", "guardrails"]
    };

    // Terminal statuses that mean everything is done
    const terminalStatuses = ["delivered", "ready", "completed", "ready_for_human_review", "ready for human review", "approved", "shipped"];
    const isTerminal = 
      terminalStatuses.some(ts => s === ts || s.includes(ts) || s.replace(/_/g, ' ') === ts) && 
      campaignStatus !== "in_production";

    // Define step order for waterfall logic
    const stepOrder = [
      "Prompt",
      "Creative Brief",
      "Image Generation",
      "Copy Generation",
      "Voice Generation",
      "Music Generation",
      "Rendering",
      "Quality Check"
    ];

    const currentStepIndex = stepOrder.indexOf(label);

    // HITL check: if status is awaiting_approval_x and x matches our current label
    // This takes precedence over completion logic because even once a node generates, 
    // it's not 'completed' in the UI until approved.
    const awaitingStep = s.startsWith("awaiting_approval_") ? s.replace("awaiting_approval_", "") : null;
    if (awaitingStep && nodeMap[label]?.some(node => awaitingStep.includes(node))) {
      return "awaiting_approval";
    }

    // Waterfall logic: If any later step is completed, this step is also completed
    const isLaterStepCompleted = stepOrder.slice(currentStepIndex + 1).some(laterLabel => {
      // Check if later step is in completedNodes
      if (nodeMap[laterLabel]?.some(node => completedNodes.includes(node))) return true;
      
      // Check if later step is implied by terminal status
      if (isTerminal) return true;

      // Special case: if videoUrl exists, everything up to Rendering is done
      if (videoUrl && (laterLabel === "Rendering")) return true;

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

      case "Voice Generation":
        if (s === "in_production" && (msg.includes("voice") || msg.includes("vocal"))) return "active";
        if (s === "ready_for_human_review" || s === "approved") return "completed";
        break;

      case "Music Generation":
        if (s === "in_production" && msg.includes("music")) return "active";
        if (s === "ready_for_human_review" || s === "approved") return "completed";
        break;

      case "Rendering":
        if (s === "in_production" && (msg.includes("render") || msg.includes("encoding") || msg.includes("video") || msg.includes("editing") || msg.includes("assemble"))) return "active";
        if (videoUrl || s === "ready_for_human_review" || s === "approved") return "completed";
        break;

      case "Quality Check":
        if (s === "ready_for_human_review") return "active";
        if (videoUrl && s === "in_production" && !msg.includes("render")) return "active";
        if (s === "delivered" || s === "ready" || s === "approved") return "completed";
        break;
    }

    // ... existing logic ...


    return "pending";
  };

  const steps = [
    { label: "Prompt", status: getStepStatus("Prompt") },
    { label: "Creative Brief", status: getStepStatus("Creative Brief") },
    { label: "Image Generation", status: getStepStatus("Image Generation") },
    { label: "Copy Generation", status: getStepStatus("Copy Generation") },
    { label: "Voice Generation", status: getStepStatus("Voice Generation") },
    { label: "Music Generation", status: getStepStatus("Music Generation") },
    { label: "Rendering", status: getStepStatus("Rendering") },
    { label: "Quality Check", status: getStepStatus("Quality Check") },
  ];

  const isAwaiting = status?.toLowerCase().startsWith("awaiting_approval_");

  return (
    <div className="p-4 md:p-8 rounded-[12px] overflow-hidden">
      {isAwaiting && message && (
        <div className="mb-8 p-5 bg-amber-50 border border-amber-100 rounded-[22px] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-amber-100">
            <Icons.Zap className="w-6 h-6 text-amber-500 animate-pulse" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.15em]">Human Intervention Required</span>
            <p className="text-[15px] font-bold text-[#02022C] leading-tight">
              {message}
            </p>
          </div>
        </div>
      )}
      <div className="overflow-x-auto custom-scrollbar">
      <div className="flex items-center justify-between min-w-[800px] relative">
        {/* Connection Line */}

        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-3 relative z-10">
            <div className="w-[48px] h-[48px] rounded-[8px] flex items-center justify-center border-[0.35px] border-[#0000001A] backdrop-blur-sm transition-all">
              {step.status === "completed" ? (
                <CustomIcons.Success className="w-5 h-5"/> 
              ) : step.status === "awaiting_approval" ? (
                <div className="flex items-center justify-center bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 animate-pulse rounded-lg p-2">
                  <Icons.Zap className="w-5 h-5 text-amber-600" />
                </div>
              ) : (
                <div className={cn(
                  "w-[20px] h-[20px] rounded-[8px] flex items-center justify-center border-[0.35px] border-[#0000001A] backdrop-blur-sm transition-all",
                  step.status === "active" && "bg-[#02022C]/10 border-[#02022C] animate-pulse"
                )} />
              )}
            </div>
            <span className={cn(
              "text-[12px] font-medium text-center whitespace-nowrap text-[#121212]",
              (step.status === "active" || step.status === "awaiting_approval") && "text-[#02022C] font-bold"
            )}>
              {step.label}
            </span>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
