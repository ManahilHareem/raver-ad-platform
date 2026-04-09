import React, { useState, useRef, useEffect } from "react";
import { Icons } from "./ui/icons";
import { Button } from "./ui/Button";
import Image from "next/image";
import Link from "next/link";
import { logout } from "@/lib/auth";
import { useUser } from "@/context/UserContext";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useUser();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initial check
    const saved = localStorage.getItem("raver_notifications");
    if (saved) {
      try {
        const notifications = JSON.parse(saved);
        setUnreadCount(notifications.filter((n: any) => !n.isRead).length);
      } catch (e) {
        console.error("Failed to parse notifications", e);
      }
    }

    const handleUpdate = (e: any) => {
      setUnreadCount(e.detail?.unreadCount || 0);
    };

    window.addEventListener("notifications_updated", handleUpdate);
    return () => window.removeEventListener("notifications_updated", handleUpdate);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="h-[78px] bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 relative z-50 shrink-0">
      {/* Search Bar / Menu Toggle */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-50 rounded-xl transition-colors shrink-0"
        >
          <Icons.Menu className="w-6 h-6 text-[#01012A]" />
        </button>

        <div className="relative w-full max-w-[341px] hidden sm:block">
          <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search platform..."
            className="w-full h-[42px] bg-slate-50 border border-slate-100 rounded-xl pt-[11px] pr-[16px] pb-[10px] pl-[44px] text-[13px] font-medium text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#01012A]/5 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-6">
        <div className="hidden md:flex items-center gap-2 border-r border-slate-100 pr-4">
          <Link href="/chat" className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors relative group">
            <Icons.MessageCircle className="w-5 h-5 text-slate-400 group-hover:text-[#01012A]" />
          </Link>
          <Link href="/notifications" className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors relative group">
            <Icons.Bell className="w-5 h-5 text-slate-400 group-hover:text-[#01012A]" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 px-1.5 py-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[9px] font-black rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>

        <Link href="/studio?create=true" className="hidden sm:block">
          <Button className="h-11 px-6 rounded-xl flex items-center gap-2 bg-linear-to-r from-[#01012A] to-[#2E2C66]  text-white hover:bg-slate-900 shadow-lg shadow-[#01012A]/10 transition-all active:scale-95">
            <Icons.Plus className="w-4 h-4" />
            <span className="text-[12px] font-black uppercase tracking-widest text-white">Create</span>
          </Button>
        </Link>
        
        <Link href="/studio?create=true" className="sm:hidden">
          <button className="w-10 h-10 bg-linear-to-r from-[#01012A] to-[#2E2C66]  text-white rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-lg shadow-[#01012A]/10">
            <Icons.Plus className="w-5 h-5" />
          </button>
        </Link>

        {/* Profile Dropdown Container */}
        <div className="relative pl-2" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-sm hover:ring-2 hover:ring-[#01012A]/10 transition-all border border-slate-100 focus:border-indigo-500/20 outline-none"
          >
            <Image 
              src={user?.avatarUrl || "/assets/7441684aa4149b2fd6d813ffefd24cdc9a178dba.jpg"} 
              alt="User" 
              fill 
              className="object-cover"
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right overflow-hidden z-200">
              <div className="px-4 py-3 border-b border-slate-50 mb-1">
                 <p className="text-[13px] font-black text-[#01012A] truncate">{user?.fullName || 'Creative Director'}</p>
                 <p className="text-[10px] font-bold text-slate-400 truncate uppercase mt-0.5 tracking-widest">{user?.professionalRole || 'Global Admin'}</p>
              </div>
              <Link 
                href="/settings" 
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-[#4F4F4F] hover:bg-slate-50 transition-colors group"
              >
                <Icons.User className="w-4 h-4 text-slate-400 group-hover:text-[#01012A]" />
                <span>My Profile</span>
              </Link>
              <Link 
                href="/settings?tab=security" 
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-[#4F4F4F] hover:bg-slate-50 transition-colors group"
              >
                <Icons.Lock className="w-4 h-4 text-slate-400 group-hover:text-[#01012A]" />
                <span>Security</span>
              </Link>
              <div className="h-px bg-slate-100 my-1 mx-2" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-black text-red-500 hover:bg-red-50 transition-colors group"
              >
                <Icons.Trash className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
