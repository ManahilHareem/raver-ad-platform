import React from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc: string;
  title: string;
  subtitle: string;
}

export default function AuthLayout({
  children,
  imageSrc,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="flex  h-screen bg-white overflow-hidden">
      {/* Left Side: Product Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative p-[32px]">
        <div className="relative w-full h-full rounded-[24px] overflow-hidden shadow-2xl">
          <Image
            src={imageSrc}
            alt="AI Creative Studio"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay Content */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-[64px] left-[64px] right-[64px] flex flex-col gap-[16px]">
            <h2 className="text-[32px] font-bold text-white leading-tight">
              {title}
            </h2>
            <p className="text-[20px] text-white/90 font-normal max-w-[597px] leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-[32px] gap-[32px] md:p-[64px] lg:p-[96px]">
        <div className="w-full max-w-[551px] flex flex-col gap-[32px]">
          {children}
        </div>
      </div>
    </div>
  );
}
