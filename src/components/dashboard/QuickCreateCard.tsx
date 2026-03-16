import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickCreateCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  hoverColor?: string;
  gradient?: string;
}

export default function QuickCreateCard({ title, icon: Icon, hoverColor, gradient }: QuickCreateCardProps) {
  return (
    <button className={cn(
      "group relative flex-1 min-w-[181.8px] h-[84px] bg-white rounded-[8px] border-[0.35px]-[#0000001A]  p-5 flex flex-col items-start gap-3 transition-all duration-300 overflow-hidden shadow-sm",
      "hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1"
    )}>
      {/* Dynamic Hover Gradient Background */}
      <div 
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          gradient || "bg-indigo-900"
        )}
      />

      <div className="relative z-10 flex flex-col items-start gap-3">
        <Icon className={cn(
          "w-6 h-6 transition-colors duration-300",
          "text-[#02022C] group-hover:text-white"
        )} />
        <span className={cn(
          "text-[14px] font-medium text-[#02022C] group-hover:text-white transition-colors duration-300"
        )}>
          {title}
        </span>
      </div>
    </button>
  );
}
