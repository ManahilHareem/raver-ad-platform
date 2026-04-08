"use client";

import React from "react";
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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-linear-to-r from-[#01012A] to-[#2E2C66]  backdrop-blur-sm z-100 lg:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 w-[280px] h-screen bg-white border-r border-slate-100 flex flex-col z-100 transition-transform duration-500 lg:translate-x-0 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header / Logo Section */}
        <div className="flex items-center justify-between px-6 border-b border-[#0000000D] h-[78px] shrink-0">
          <Link
            href="/home"
            className="flex items-center gap-[10px] hover:opacity-80 transition-opacity"
          >
            <div className="w-[23px] h-[23px] flex items-center justify-center">
              <Icons.Logo className="text-[#02022C] w-full h-full" />
            </div>
            <span className="text-xl font-bold text-[#02022C] tracking-tight">raver</span>
          </Link>
          
          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <Icons.Plus className="w-5 h-5 rotate-45 text-slate-400" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-8 flex-1 overflow-y-auto custom-scrollbar">
          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => { if (window.innerWidth < 1024) onClose(); }}
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
    </>
  );
}
