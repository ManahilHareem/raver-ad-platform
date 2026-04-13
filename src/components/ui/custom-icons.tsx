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
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M11.6048 10.6479L9.81458 8.85767C9.57058 8.61367 9.44858 8.49167 9.31692 8.42642C9.0665 8.30232 8.7725 8.30232 8.522 8.42642C8.39042 8.49167 8.26839 8.61367 8.02436 8.85767C7.78032 9.10176 7.6583 9.22376 7.59307 9.35534C7.46898 9.60584 7.46898 9.89984 7.59307 10.1503C7.6583 10.2819 7.78032 10.4039 8.02436 10.6479L9.81458 12.4382M11.6048 10.6479L16.9757 16.0188C17.2197 16.2628 17.3417 16.3848 17.4069 16.5164C17.531 16.7668 17.531 17.0608 17.4069 17.3113C17.3417 17.4429 17.2197 17.5649 16.9757 17.809C16.7316 18.053 16.6096 18.175 16.478 18.2403C16.2275 18.3643 15.9335 18.3643 15.6831 18.2403C15.5514 18.175 15.4294 18.053 15.1854 17.809L9.81458 12.4382M11.6048 10.6479L9.81458 12.4382" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.1667 1.66666L14.4124 2.33049C14.7345 3.20096 14.8955 3.6362 15.213 3.9537C15.5305 4.2712 15.9657 4.43225 16.8362 4.75435L17.5 4.99999L16.8362 5.24563C15.9657 5.56773 15.5305 5.72879 15.213 6.04628C14.8955 6.36378 14.7345 6.79901 14.4124 7.66949L14.1667 8.33332L13.921 7.66949C13.599 6.79902 13.4379 6.36378 13.1204 6.04628C12.8029 5.72878 12.3677 5.56773 11.4972 5.24563L10.8334 4.99999L11.4972 4.75435C12.3677 4.43225 12.8029 4.2712 13.1204 3.9537C13.4379 3.6362 13.599 3.20096 13.921 2.33049L14.1667 1.66666Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M5 3.33334L5.18423 3.83122C5.42581 4.48407 5.5466 4.8105 5.78472 5.04863C6.02284 5.28674 6.34927 5.40754 7.00212 5.64911L7.5 5.83334L7.00212 6.01758C6.34927 6.25915 6.02284 6.37994 5.78472 6.61807C5.5466 6.85619 5.42581 7.18262 5.18423 7.83547L5 8.33334L4.81577 7.83547C4.57419 7.18262 4.4534 6.85619 4.21528 6.61807C3.97716 6.37994 3.65073 6.25915 2.99788 6.01758L2.5 5.83334L2.99788 5.64911C3.65073 5.40754 3.97716 5.28674 4.21528 5.04862C4.4534 4.8105 4.57419 4.48407 4.81577 3.83122L5 3.33334Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
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
  Templates: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M13.5523 8.75H6.44771C4.29643 8.75 3.22078 8.75 2.72619 9.4605C2.23161 10.171 2.5992 11.1882 3.33438 13.2225L4.23788 15.7225C4.62121 16.7832 4.81288 17.3136 5.24075 17.6151C5.66863 17.9167 6.22948 17.9167 7.35119 17.9167H12.6488C13.7705 17.9167 14.3313 17.9167 14.7593 17.6151C15.1871 17.3136 15.3788 16.7832 15.7622 15.7225L16.6656 13.2225C17.4008 11.1882 17.7684 10.171 17.2738 9.4605C16.7793 8.75 15.7036 8.75 13.5523 8.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square"/>
      <path d="M15.8333 6.66666C15.8333 6.27837 15.8333 6.08423 15.7699 5.93109C15.6853 5.7269 15.523 5.56466 15.3189 5.48009C15.1657 5.41666 14.9715 5.41666 14.5833 5.41666H5.41663C5.02834 5.41666 4.8342 5.41666 4.68106 5.48009C4.47687 5.56466 4.31463 5.7269 4.23006 5.93109C4.16663 6.08423 4.16663 6.27837 4.16663 6.66666" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.75 3.33334C13.75 2.94506 13.75 2.75092 13.6866 2.59778C13.602 2.39359 13.4397 2.23135 13.2356 2.14678C13.0824 2.08334 12.8882 2.08334 12.5 2.08334H7.5C7.11172 2.08334 6.91758 2.08334 6.76443 2.14678C6.56024 2.23135 6.39801 2.39359 6.31343 2.59778C6.25 2.75092 6.25 2.94506 6.25 3.33334" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
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
  Mic: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M14.1666 5.83329V9.16663C14.1666 11.4678 12.3011 13.3333 9.99992 13.3333C7.69874 13.3333 5.83325 11.4678 5.83325 9.16663V5.83329C5.83325 3.53211 7.69874 1.66663 9.99992 1.66663C12.3011 1.66663 14.1666 3.53211 14.1666 5.83329Z" stroke="currentColor" strokeWidth="1.25"/>
      <path d="M14.1667 5.83337H11.6667M14.1667 9.16671H11.6667" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
      <path d="M16.6666 9.16663C16.6666 12.8485 13.6818 15.8333 9.99992 15.8333M9.99992 15.8333C6.31802 15.8333 3.33325 12.8485 3.33325 9.16663M9.99992 15.8333V18.3333M9.99992 18.3333H12.4999M9.99992 18.3333H7.49992" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
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
  whiteMagicWand: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5.95682 9.66667C5.8973 9.43596 5.77705 9.22541 5.60857 9.05693C5.44009 8.88844 5.22953 8.76819 4.99882 8.70867L0.908821 7.654C0.839041 7.6342 0.777627 7.59217 0.733896 7.5343C0.690165 7.47643 0.666504 7.40587 0.666504 7.33334C0.666504 7.2608 0.690165 7.19024 0.733896 7.13237C0.777627 7.0745 0.839041 7.03248 0.908821 7.01267L4.99882 5.95734C5.22945 5.89787 5.43995 5.77772 5.60842 5.60936C5.7769 5.44101 5.8972 5.23059 5.95682 5L7.01149 0.910003C7.03109 0.839949 7.07308 0.778231 7.13103 0.734266C7.18899 0.690302 7.25974 0.666504 7.33249 0.666504C7.40523 0.666504 7.47598 0.690302 7.53394 0.734266C7.5919 0.778231 7.63388 0.839949 7.65349 0.910003L8.70749 5C8.76701 5.23072 8.88726 5.44127 9.05574 5.60975C9.22422 5.77823 9.43477 5.89849 9.66549 5.958L13.7555 7.012C13.8258 7.0314 13.8878 7.07334 13.932 7.13139C13.9762 7.18943 14.0002 7.26038 14.0002 7.33334C14.0002 7.4063 13.9762 7.47724 13.932 7.53529C13.8878 7.59333 13.8258 7.63527 13.7555 7.65467L9.66549 8.70867C9.43477 8.76819 9.22422 8.88844 9.05574 9.05693C8.88726 9.22541 8.76701 9.43596 8.70749 9.66667L7.65282 13.7567C7.63322 13.8267 7.59123 13.8884 7.53327 13.9324C7.47532 13.9764 7.40457 14.0002 7.33182 14.0002C7.25907 14.0002 7.18833 13.9764 7.13037 13.9324C7.07241 13.8884 7.03043 13.8267 7.01082 13.7567L5.95682 9.66667Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Tiktok: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-3.932 1.321 6.33 6.33 0 0 0-2.316 8.528 6.331 6.331 0 0 0 8.528 2.316 6.33 6.33 0 0 0 2.316-8.528V8.034c.769.548 1.696.868 2.693.896l.445.012V5.5l-.5-.014z" fill="currentColor" />
    </svg>
  ),
};
