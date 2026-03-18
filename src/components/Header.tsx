"use client";

import { Icons } from "./ui/icons";
import { Button } from "./ui/Button";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="h-[78px] bg-white border-b border-slate-100 flex items-center justify-between px-8">
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
          <Link href="/messages" className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors relative">
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

        <Link href="/settings" className="flex items-center gap-3 pl-2">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm hover:ring-2 hover:ring-indigo-500/20 transition-all">
            <Image 
              src="/assets/7441684aa4149b2fd6d813ffefd24cdc9a178dba.jpg" 
              alt="User" 
              fill 
              className="object-cover"
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
