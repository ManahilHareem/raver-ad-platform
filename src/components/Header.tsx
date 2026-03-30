import React, { useState, useRef, useEffect } from "react";
import { Icons } from "./ui/icons";
import { Button } from "./ui/Button";
import Image from "next/image";
import Link from "next/link";
import { logout } from "@/lib/auth";
import { useUser } from "@/context/UserContext";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useUser();
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="h-[78px] bg-white border-b border-slate-100 flex items-center justify-between px-8 relative z-50">
      {/* Search Bar */}
      <div className="relative w-[341px]">
        <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4F4F4F] w-5 h-5" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-[42px] bg-[#F8F8F8] border border-[#0000000D] border-t-[#FFFFFF] rounded-[4px] pt-[11px] pr-[16px] pb-[10px] pl-[48px] text-[14px] font-normal text-[#4F4F4F] leading-[100%] tracking-[-0.15px] focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-[#4F4F4F]/50"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-[16px]">
        <div className="flex items-center gap-2">
          <Link href="/chat" className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors relative">
            <Icons.MessageCircle className="w-5 h-5 text-[#4F4F4F]" />
          </Link>
          <Link href="/notifications" className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors relative">
            <Icons.Bell className="w-5 h-5 text-[#4F4F4F]" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </Link>
        </div>

        <Link href="/studio?create=true">
          <Button className="w-[144px] h-[48px] px-6 rounded-xl flex items-center gap-2">
            <Icons.Plus className="w-5 h-5" />
            <span>Create</span>
          </Button>
        </Link>

        {/* Profile Dropdown Container */}
        <div className="relative pl-2" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 relative w-10 h-10 rounded-xl overflow-hidden shadow-sm hover:ring-2 hover:ring-indigo-500/20 transition-all border border-transparent focus:border-indigo-500/20 outline-none"
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
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right overflow-hidden z-100">
              <Link 
                href="/settings" 
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-[14px] text-[#4F4F4F] hover:bg-slate-50 transition-colors"
              >
                <Icons.User className="w-4 h-4" />
                <span>My Profile</span>
              </Link>
              <Link 
                href="/settings?tab=security" 
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-[14px] text-[#4F4F4F] hover:bg-slate-50 transition-colors"
              >
                <Icons.Lock className="w-4 h-4" />
                <span>Security</span>
              </Link>
              <div className="h-px bg-slate-100 my-1 mx-2" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-[14px] text-red-500 hover:bg-red-50 transition-colors"
              >
                <Icons.Trash className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
