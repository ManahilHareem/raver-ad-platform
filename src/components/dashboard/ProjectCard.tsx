import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  time: string;
  members: number;
  image: string;
  status?: string;
  message?: string;
  videoUrl?: string | null;
  onPreview?: () => void;
  onHistory?: () => void;
}

export default function ProjectCard({ 
  title, 
  time, 
  members, 
  image,
  status,
  message,
  videoUrl,
  onPreview,
  onHistory
}: ProjectCardProps) {
  const isReady = status === "Ready" || status === "completed" || status === "delivered";
  const isInProduction = status === "in_production" || status === "queued" || status === "In Production";

  return (
    <div className="group p-[8px] bg-white rounded-[12px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
        {/* We remove gap-[8px] here because it interferes with the Thumbnail/Content relationship; padding should handle it */}
      {/* Thumbnail Container with 8px padding */}
      <div className=" w-full">
        <div className="relative h-[192px] w-full rounded-[8px] overflow-hidden bg-slate-100">
          {videoUrl ? (
            <video 
              src={videoUrl} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <Image 
              src={image} 
              alt={title}
              fill
              className={cn(
                "object-cover transition-transform duration-500",
                isInProduction ? "scale-105 blur-sm" : "group-hover:scale-110"
              )}
            />
          )}

          {isInProduction && (
            <div className="absolute inset-0 bg-[#02022C]/40 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-10 transition-all">
              <Icons.Loader className="w-5 h-5 text-white animate-spin mb-1.5" />
              <p className="text-white text-[10px] font-bold uppercase tracking-wider">
                {status === "queued" ? "Queued" : "Pipeline Running"}
              </p>
              {message && (
                <p className="text-white/90 text-[9px] mt-1 font-medium max-w-[90%] line-clamp-2">
                  {message}
                </p>
              )}
            </div>
          )}

          <div className="absolute top-2 right-2 z-20">
            <span className={cn(
              "px-[6px] py-[3px] rounded-[4px] text-[9px] font-bold uppercase tracking-wider shadow-sm",
              isReady ? "bg-linear-to-r from-[#01012A] to-[#2E2C66] text-white shadow-lg shadow-[#01012A]/10" 
              : isInProduction ? "bg-white text-[#02022C] animate-pulse" 
              : "bg-linear-to-r from-[#AD46FF] to-[#2B7FFF] text-white"
            )}>
              {(status || "Draft").replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-[12px] pb-[4px]  flex flex-col gap-[12px] flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[16px] font-bold text-[#121212] leading-tight line-clamp-1">{title}</h3>
        </div>

        <div className="flex items-center gap-[16px] mt-auto">
          <div className="flex items-center gap-2 text-[12px] font-regular text-[#4F4F4F]">
            <Icons.Clock className="w-4 h-4" />
            <span>{time} ago</span>
          </div>
          <div className="flex items-center -space-x-2">
           <Icons.User className="w-4 h-4" />
            {members}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onPreview}
            className="flex-1 h-[40px] bg-linear-to-r from-[#01012A] to-[#2E2C66] text-white rounded-xl text-[14px] font-bold shadow-lg shadow-[#01012A]/10 hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Icons.Eye className="w-4 h-4" /> Preview
          </button>
          {/* <button 
            onClick={onHistory}
            className="h-[40px] px-4 border border-slate-200 rounded-xl text-[14px] font-bold text-[#4F4F4F] hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2"
            title="View History & Details"
          >
            <Icons.Clock className="w-4 h-4" />
          </button> */}
        </div>
      </div>
    </div>
  );
}
