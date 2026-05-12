"use client";

import { Icons } from "@/components/ui/icons";

interface CampaignStep3Props {
  data: any;
  updateData: (fields: any) => void;
  errors: Record<string, string>;
}

export default function CampaignStep3({ data, updateData, errors }: CampaignStep3Props) {
  const togglePlatform = (platform: string) => {
    const prev = data.platforms || [];
    const next = prev.includes(platform) ? prev.filter((p: string) => p !== platform) : [...prev, platform];
    updateData({ platforms: next });
  };

  const platforms = [
    { label: "Instagram", icon: Icons.Instagram },
    { label: "Facebook", icon: Icons.Facebook },
    { label: "Tiktok", icon: Icons.Video },
    { label: "YouTube", icon: Icons.Youtube },
  ];

  const durations = ["15 sec", "30 sec", "60 sec", "90 sec"];

  const formats = [
    {
      label: "Square (1:1)",
      desc: "Perfect for Instagram feed",
      dimensions: "1:1"
    },
    {
      label: "Vertical (9:16)",
      desc: "Instagram Stories, Tiktok",
      dimensions: "9:16"
    },
    {
      label: "Landscape (16:9)",
      desc: "YouTube, Facebook",
      dimensions: "16:9"
    },
    {
      label: "Portrait (9:16)",
      desc: "Instagram feed optimized",
      dimensions: "9:16"
    },
  ];

  return (
    <div className="flex flex-col gap-[24px] animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-1">
        <h3 className="text-h3 text-text-primary">Platform & Format</h3>
        <p className="text-body text-text-secondary">Where will your campaign be published?</p>
      </div>

      <div className="flex flex-col gap-[16px]">
        {/* Social Media Platform */}
        <div className={`flex flex-col gap-[12px] bg-[#FFFFFF] p-[16px] rounded-[16px] border ${errors.platforms ? 'border-red-500' : 'border-[#1212121A]'}`}>
          <label className="text-label text-text-primary">Social Media Platform *</label>
          <div className="flex flex-wrap gap-[12px]">
            {platforms.map((p) => {
              const isSelected = data.platforms?.includes(p.label);
              return (
                <button
                  key={p.label}
                  onClick={() => togglePlatform(p.label)}
                  className={`px-[16px] py-[8px] rounded-xl text-body font-medium items-center justify-center transition-all flex flex-row gap-[10px] ${isSelected ? "text-brand-primary" : "bg-white border text-text-secondary border-[#E2E8F0] hover:border-brand-primary "
                    }`}
                  style={isSelected ? {
                    border: '1px solid transparent',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #01012A 0%, #2E2C66 100%) border-box'
                  } : {}}
                >
                  <p.icon className={`w-4 h-4 ${isSelected ? "text-brand-primary" : "text-text-secondary"}`} />
                  {p.label}
                </button>
              );
            })}
          </div>
          {errors.platforms && <p className="text-red-500 text-[12px] font-medium mt-1">{errors.platforms}</p>}
        </div>

        {/* Video Duration */}
        <div className="flex flex-col gap-4 bg-[#FFFFFF] p-[16px] rounded-[16px] border-[0.35px] border-[#1212121A]">
          <label className="text-label text-text-primary">Video Duration *</label>
          <div className="flex flex-wrap gap-[12px]">
            {durations.map((d) => {
              const isSelected = data.duration === d;
              return (
                <button
                  key={d}
                  onClick={() => updateData({ duration: d })}
                  className={`px-[16px] py-[8px] rounded-xl text-body font-medium items-center justify-center transition-all flex flex-row gap-[10px] ${isSelected ? "text-brand-primary" : "bg-white border text-text-secondary border-[#E2E8F0] hover:border-brand-primary "
                    }`}
                  style={isSelected ? {
                    border: '1px solid transparent',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #01012A 0%, #2E2C66 100%) border-box'
                  } : {}}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Video Format */}
        <div className="flex flex-col gap-4 bg-[#FFFFFF] p-[16px] rounded-[16px] border-[0.35px] border-[#1212121A]">
          <label className="text-label text-text-primary">Video Format *</label>
          <div className="grid grid-cols-2 gap-[12px]">
            {formats.map((f) => {
              const isSelected = data.format === f.label;
              return (
                <button
                  key={f.label}
                  onClick={() => updateData({ format: f.label })}
                  className={`px-[16px] py-[8px] rounded-xl text-body font-medium items-start transition-all flex flex-col gap-[5px] ${isSelected ? "text-brand-primary" : "bg-white border text-text-secondary border-[#E2E8F0] hover:border-brand-primary "
                    }`}
                  style={isSelected ? {
                    border: '1px solid transparent',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #01012A 0%, #2E2C66 100%) border-box'
                  } : {}}
                >
                  <span className={`text-caption font-bold mb-1 ${isSelected ? "text-brand-primary" : "text-text-primary"}`}>{f.label}</span>
                  <span className="text-[11px] font-medium text-text-secondary leading-tight">{f.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
