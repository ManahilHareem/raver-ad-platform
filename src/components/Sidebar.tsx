"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icons } from "./ui/icons";

const menuItems = [
  { label: "Dashboard", icon: Icons.Dashboard, href: "/home" },
  { label: "AI Creative Studio", icon: Icons.CreativeStudio, href: "/studio" },
  { label: "AI Agents", icon: Icons.AIAgents, href: "/agents" },
  { label: "My Projects", icon: Icons.MyProjects, href: "/projects" },
  { label: "Templates Library", icon: Icons.TemplatesLibrary, href: "/templates" },
  { label: "Asset Library", icon: Icons.AssetLibrary, href: "/assets" },
  { label: "Analytics", icon: Icons.Analytics, href: "/analytics" },
  { label: "Settings", icon: Icons.Settings, href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] h-screen bg-white border-r border-slate-100 flex flex-col">
      {/* Header / Logo Section */}
      <Link 
        href="/home"
        className="w-[227px] h-[78px] pt-[16px] pb-[16px] px-[16px] flex items-center justify-center gap-[10px] border-b border-[#0000000D] mx-auto hover:opacity-80 transition-opacity"
      >
        <div className="w-[23px] h-[23px] flex items-center justify-center">
          <Icons.Logo className="text-[#02022C] w-full h-full" />
        </div>
        <span className="text-xl font-bold text-[#02022C] tracking-tight">raver</span>
      </Link>

      <div className="p-6 flex flex-col gap-8">
        {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-[#02022C] text-white shadow-lg shadow-[#02022C]/10" 
                  : "text-[#02022C] hover:bg-[#02022C] hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-all duration-200",
                isActive ? "brightness-0 invert" : "brightness-0 group-hover:invert"
              )} />
              <span className="text-[14px] font-medium leading-[20px] tracking-[-0.15px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      </div>
    </aside>
  );
}
