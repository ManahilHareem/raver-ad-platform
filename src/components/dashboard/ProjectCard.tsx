import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";

interface ProjectCardProps {
  title: string;
  time: string;
  members: number;
  image: string;
}

export default function ProjectCard({ title, time, members, image }: ProjectCardProps) {
  return (
    <div className="group bg-white rounded-[12px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
        {/* We remove gap-[8px] here because it interferes with the Thumbnail/Content relationship; padding should handle it */}
      {/* Thumbnail Container with 8px padding */}
      <div className="p-[8px] w-full">
        <div className="relative h-[192px] w-full rounded-[8px] overflow-hidden">
          <Image 
            src={image} 
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="pt-[12px] pb-[4px] px-[16px] flex flex-col gap-[12px] flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[16px] font-bold text-[#121212] leading-tight line-clamp-1">{title}</h3>
          <button className="p-1 hover:bg-slate-50 rounded-lg transition-colors">
            <Icons.More className="w-5 h-5 text-[#4F4F4F]" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2 text-[12px] font-regular text-[#4F4F4F]">
            <Icons.Clock className="w-4 h-4" />
            <span>{time} ago</span>
          </div>
          <div className="flex items-center -space-x-2">
           <Icons.User className="w-4 h-4" />
            {members}
          </div>
        </div>

        <button className="w-full h-[40px] border border-slate-100 rounded-xl text-[14px] font-bold text-[#4F4F4F] hover:bg-indigo-900 hover:text-white hover:border-indigo-900 transition-all duration-300">
          Open Project
        </button>
      </div>
    </div>
  );
}
