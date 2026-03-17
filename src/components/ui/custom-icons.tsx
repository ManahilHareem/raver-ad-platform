import React from "react";
import Image from "next/image";

export const CustomIcons = {
  Logo: ({ className }: { className?: string }) => (
    <div className={className}>
      <Image
        src="/assets/Vector.svg"
        alt="Logo"
        width={20}
        height={20}
        className="w-full h-full object-contain "
      />
    </div>
  ),
  File: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8 7H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 11H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 21.5V21C13 18.1716 13 16.7574 13.8787 15.8787C14.7574 15 16.1716 15 19 15H19.5M20 13.3431V10C20 6.22876 20 4.34315 18.8284 3.17157C17.6569 2 15.7712 2 12 2C8.22877 2 6.34315 2 5.17157 3.17157C4 4.34314 4 6.22876 4 10V14.5442C4 17.7892 4 19.4117 4.88607 20.5107C5.06508 20.7327 5.26731 20.9349 5.48933 21.1139C6.58831 22 8.21082 22 11.4558 22C12.1614 22 12.5141 22 12.8372 21.886C12.9044 21.8623 12.9702 21.835 13.0345 21.8043C13.3436 21.6564 13.593 21.407 14.0919 20.9081L18.8284 16.1716C19.4065 15.5935 19.6955 15.3045 19.8478 14.9369C20 14.5694 20 14.1606 20 13.3431Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ImageIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7.5 9C8.32843 9 9 8.32843 9 7.5C9 6.67157 8.32843 6 7.5 6C6.67157 6 6 6.67157 6 7.5C6 8.32843 6.67157 9 7.5 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 21C9.37246 15.775 14.2741 8.88407 21.4975 13.5424" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  VideoIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M11 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 11C2 7.70017 2 6.05025 3.02513 5.02513C4.05025 4 5.70017 4 9 4H10C13.2998 4 14.9497 4 15.9749 5.02513C17 6.05025 17 7.70017 17 11V13C17 16.2998 17 17.9497 15.9749 18.9749C14.9497 20 13.2998 20 10 20H9C5.70017 20 4.05025 20 3.02513 18.9749C2 17.9497 2 16.2998 2 13V11Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 8.90585L17.1259 8.80196C19.2417 7.05623 20.2996 6.18336 21.1498 6.60482C22 7.02628 22 8.42355 22 11.2181V12.7819C22 15.5765 22 16.9737 21.1498 17.3952C20.2996 17.8166 19.2417 16.9438 17.1259 15.198L17 15.0941" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Analytics: ({ className }: { className?: string }) => (
    <div className={className}>
      <Image
        src="/assets/analytics-01.svg"
        alt="Analytics"
        width={20}
        height={20}
        className="w-full h-full object-contain brightness-0 group-hover:brightness-0 group-hover:invert transition-all duration-200"
      />
    </div>
  ),
  Gallery: ({ className }: { className?: string }) => (
    <div className={className}>
      <Image
        src="/assets/gallery-horizontal-end.svg"
        alt="Gallery"
        width={20}
        height={20}
        className="w-full h-full object-contain brightness-0 group-hover:brightness-0 group-hover:invert transition-all duration-200"
      />
    </div>
  ),
  MagicWand: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M11 2L5.5 12.5L11 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 2L20.5 12.5L15 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 6.5L2 12.5L7 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 3.33334L5.18423 3.83122C5.42581 4.48407 5.5466 4.8105 5.78472 5.04863C6.02284 5.28674 6.34927 5.40754 7.00212 5.64911L7.5 5.83334L7.00212 6.01758C6.34927 6.25915 6.02284 6.37994 5.78472 6.61807C5.5466 6.85619 5.42581 7.18262 5.18423 7.83547L5 8.33334L4.81577 7.83547C4.57419 7.18262 4.4534 6.85619 4.21528 6.61807C3.97716 6.37994 3.65073 6.25915 2.99788 6.01758L2.5 5.83334L2.99788 5.64911C3.65073 5.40754 3.97716 5.28674 4.21528 5.04862C4.4534 4.8105 4.57419 4.48407 4.81577 3.83122L5 3.33334Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  Settings: ({ className }: { className?: string }) => (
    <div className={className}>
      <Image
        src="/assets/settings-03.svg"
        alt="Settings"
        width={20}
        height={20}
        className="w-full h-full object-contain brightness-0 group-hover:brightness-0 group-hover:invert transition-all duration-200"
      />
    </div>
  ),
  AIAgents: ({ className }: { className?: string }) => (
    <div className={className}>
      <Image
        src="/assets/artificial-intelligence-02.svg"
        alt="AI Agents"
        width={20}
        height={20}
        className="w-full h-full object-contain brightness-0 group-hover:brightness-0 group-hover:invert transition-all duration-200"
      />
    </div>
  ),
  Templates: ({ className }: { className?: string }) => (
    <div className={className}>
      <Image
        src="/assets/folder-library.svg"
        alt="Templates Library"
        width={20}
        height={20}
        className="w-full h-full object-contain brightness-0 group-hover:brightness-0 group-hover:invert transition-all duration-200"
      />
    </div>
  ),
  Folder: ({ className }: { className?: string }) => (
    <div className={className}>
      <Image
        src="/assets/folder-02.svg"
        alt="Projects"
        width={20}
        height={20}
        className="w-full h-full object-contain brightness-0 group-hover:brightness-0 group-hover:invert transition-all duration-200"
      />
    </div>
  ),
  Sent: ({ className }: { className?: string }) => (
    <div className={className}>
      <Image
        src="/assets/sent.svg"
        alt="Sent"
        width={20}
        height={20}
        className="w-full h-full object-contain"
      />
    </div>
  ),
  Mic: ({ className }: { className?: string }) => (
    <div className={className}>
      <Image
        src="/assets/mic-01.svg"
        alt="Microphone"
        width={20}
        height={20}
        className="w-full h-full object-contain"
      />
    </div>
  ),
  Success: ({ className }: { className?: string }) => (
    <div className={className}>
      <Image
        src="/assets/Icon.svg"
        alt="Success"
        width={27}
        height={27}
        className="w-full h-full object-contain"
      />
    </div>
  ),
  whiteMagicWand: ({ className }: { className?: string }) => (
    <div className={className}>
      <Image
        src="/assets/Vector (1).svg"
        alt="Magic Wand"
        width={24}
        height={24}
        className="w-full h-full object-contain"
      />
    </div>
  ),
};
