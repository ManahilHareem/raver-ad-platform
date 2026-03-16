"use client";

import { useState } from "react";
import { Icons } from "@/components/ui/icons";

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCampaignModal({ isOpen, onClose }: CreateCampaignModalProps) {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="bg-[#F8FAFC] w-full max-w-[640px] h-screen flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 rounded-l-[24px] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-white px-8 pt-6 pb-2 border-b border-[#F1F5F9] shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <h2 className="text-[18px] font-medium text-[#121212]">Create New Campaign</h2>
              <span className="text-[13px] text-[#64748B] font-regular">Step {step} of 4</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[#F1F5F9] rounded-full transition-colors">
              <Icons.Plus className="w-5 h-5 rotate-45 text-[#64748B]" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-4 ">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-[3px] flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-[linear-gradient(90deg,_#01012A_0%,_#2E2C66_100%)] " : "bg-[#E2E8F0]"
              }`} />
            ))}
          </div>
        </div>

        {/* Modal Content */}
        <div className="px-[24px] py-[20px] flex-1 overflow-y-auto custom-scrollbar">
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-4 bg-white border-t border-[#F1F5F9] flex items-center justify-between">
          <button 
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1}
            className="flex items-center gap-2 px-6 py-2 bg-white rounded-lg text-[14px] font-bold text-[#121212] hover:bg-[#F1F5F9] transition-all disabled:opacity-0 disabled:pointer-events-none"
          >
            <Icons.ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          {step < 4 ? (
            <button 
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-10 py-2.5 bg-[#02022C] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#1A1A3F] transition-all"
            >
              Next <Icons.ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="flex items-center gap-2 px-10 py-2.5 bg-[#02022C] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#1A1A3F] transition-all"
            >
              Generate Campaign <Icons.Send className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="flex flex-col gap-[24px] animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-1">
        <h3 className="text-[18px] font-bold text-[#121212]">Campaign Details</h3>
        <p className="text-[14px] text-[#6B7280] font-regular">Let's start with the basics of your campaign</p>
      </div>
      
      <div className="flex flex-col gap-[8px]">
        {/* Campaign Name Card */}
        <div className="bg-white p-[16px] rounded-[16 px] border-[0.35px] border-[#0000001A] flex flex-col gap-[12px]">
          <label className="text-[13px] font-bold text-[#121212]">Campaign Name *</label>
          <input 
            type="text" 
            placeholder="Instagram promotion for summer balayage special"
            className="w-full px-5 py-3.5 bg-white border border-[#F1F5F9] rounded-[8px] text-[14px] text-[#121212] outline-none focus:border-[#02022C] placeholder:text-[#94A3B8]"
          />
        </div>
        
        {/* Campaign Objective Card */}
        <div className="bg-white p-[16px] rounded-[16px] border-[0.35px] border-[#0000001A] flex flex-col gap-[12px]">
          <label className="text-[14px] font-bold text-[#000000]">Campaign Objective *</label>
          <div className="flex flex-wrap gap-[10px]">
            {["Brand Awareness", "Lead Generation", "Engagement", "Sales Conversion"].map((obj) => (
              <button key={obj} className={`px-[8px] py-[16px] h-[36px] w-[155px] flex items-center justify-center rounded-[8px] border text-[13px] font-medium transition-all ${
                obj === "Brand Awareness" 
                  ? "bg-white border-[#02022C] text-[#02022C]" 
                  : "bg-white text-[#94A3B8] border-[#F1F5F9] hover:border-[#E2E8F0]"
              }`}>
                {obj}
              </button>
            ))}
          </div>
        </div>

        {/* Target Audience Card */}
        <div className="bg-white p-[16px] rounded-[16px] border-[0.35px] border-[#0000001A] flex flex-col gap-3">
          <label className="text-[14px] font-bold text-[#000000]">Target Audience *</label>
          <textarea 
            placeholder="Describe your target audience (e.g., Women aged 25-45 interested in premium hair care)"
            className="w-full p-[16px] bg-white border border-[#F1F5F9] rounded-[8px] text-[15px] text-[#121212] outline-none focus:border-[#02022C] h-[160px] resize-none placeholder:text-[#94A3B8]"
          />
        </div>
      </div>
    </div>
  );
}

function Step2() {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [selectedColorScheme, setSelectedColorScheme] = useState<string | null>(null);

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const toggleTone = (tone: string) => {
    setSelectedTones(prev => 
      prev.includes(tone) ? prev.filter(t => t !== tone) : [...prev, tone]
    );
  };

  const toggleColorScheme = (scheme: string) => {
    setSelectedColorScheme(prev => prev === scheme ? null : scheme);
  };

  const colorSchemes = [
    { label: "Warm Tones", colors: ["#F97066", "#FBAD37", "#F79009"] },
    { label: "Cool Tones", colors: ["#53B1FD", "#7F56D9", "#2E90FA"] },
    { label: "Neutral", colors: ["#344054", "#667085", "#D0D5DD"] },
    { label: "Pastel", colors: ["#FEE4E2", "#D1E9FF", "#D1FADF"] },
    { label: "Earth Tones", colors: ["#7A5E43", "#A67C52", "#D4A373"] },
    { label: "Monochrome", colors: ["#000000", "#4B4B4B", "#9E9E9E"] },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-1">
        <h3 className="text-[18px] font-bold text-[#121212]">Campaign Details</h3>
        <p className="text-[14px] text-[#6B7280] font-regular">Define the look and feel of your campaign</p>
      </div>

      <div className="flex flex-col gap-[8px]">
        {/* Visual Style */}
        <div className="flex flex-col gap-2 bg-[#FFFFFF] p-[16px] rounded-[16px]">
          <label className="text-[14px] font-bold text-[#000000]">Visual Style *</label>
          <div className="flex flex-wrap gap-2">
            {["Modern & Clean", "Elegant & Luxury", "Vibrant & Bold", "Minimalist", "Natural & Organic", "Dramatic"].map((s) => {
              const isSelected = selectedStyles.includes(s);
              return (
                <button 
                  key={s} 
                  onClick={() => toggleStyle(s)}
                  className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all ${
                    isSelected ? "text-[#02022C]" : "bg-white border text-[#475569] border-[#E2E8F0] hover:border-[#02022C]"
                  }`}
                  style={isSelected ? {
                    border: '1px solid transparent',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #01012A 0%, #2E2C66 100%) border-box'
                  } : {}}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone & Voice */}
        <div className="flex flex-col gap-2 bg-[#FFFFFF] p-[16px] rounded-[16px]">
          <label className="text-[14px] font-bold text-[#000000]">Tone & Voice *</label>
          <div className="flex flex-wrap gap-2">
            {["Professional", "Friendly", "Inspiring", "Playful", "Sophisticated", "Educational"].map((t) => {
              const isSelected = selectedTones.includes(t);
              return (
                <button 
                  key={t} 
                  onClick={() => toggleTone(t)}
                  className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all ${
                    isSelected ? "text-[#02022C]" : "bg-white border text-[#475569] border-[#E2E8F0] hover:border-[#02022C]"
                  }`}
                  style={isSelected ? {
                    border: '1px solid transparent',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #01012A 0%, #2E2C66 100%) border-box'
                  } : {}}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Scheme */}
        <div className="flex flex-col gap-2 bg-[#FFFFFF] p-[16px] rounded-[16px]">
          <label className="text-[14px] font-bold text-[#000000]">Color Scheme *</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {colorSchemes.map((scheme) => {
              const isSelected = selectedColorScheme === scheme.label;
              return (
                <button 
                  key={scheme.label} 
                  onClick={() => toggleColorScheme(scheme.label)}
                  className={`flex flex-col items-center justify-center px-[16px] py-[8px] rounded-[12px] transition-all bg-white border ${
                    isSelected ? "border-transparent" : "border-[#E2E8F0] hover:border-[#02022C]"
                  }`}
                  style={isSelected ? {
                    border: '1px solid transparent',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #01012A 0%, #2E2C66 100%) border-box'
                  } : {}}
                >
                  <div className="flex gap-1.5 mb-2">
                    {scheme.colors.map((color, i) => (
                      <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  <span className={`text-[13px] font-medium ${isSelected ? "text-[#02022C]" : "text-[#64748B]"}`}>
                    {scheme.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step3() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Instagram"]);
  const [selectedDuration, setSelectedDuration] = useState<string>("15 sec");
  const [selectedFormat, setSelectedFormat] = useState<string>("Square (1:1)");

  const platforms = [
    { label: "Instagram", icon: Icons.Instagram },
    { label: "Facebook", icon: Icons.Facebook },
    { label: "Tiktok", icon: Icons.Video }, // Using Video icon as fallback for TikTok
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

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  return (
    <div className="flex flex-col gap-[24px] animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-1">
        <h3 className="text-[18px] font-bold text-[#121212]">Platform & Format</h3>
        <p className="text-[14px] font-regular text-[#6B7280]">Where will your campaign be published?</p>
      </div>
      
      <div className="flex flex-col gap-[8px]">
        {/* Social Media Platform */}
        <div className="flex flex-col gap-4 bg-[#FFFFFF] p-[16px] rounded-[16px] border-[0.35px] border-[#0000001A]">
          <label className="text-[14px] font-bold text-[#000000]">Social Media Platform *</label>
          <div className="flex flex-wrap gap-[12px]">
            {platforms.map((p) => {
              const isSelected = selectedPlatforms.includes(p.label);
              return (
                <button 
                  key={p.label} 
                  onClick={() => togglePlatform(p.label)}
                   className={`px-[16px] py-[8px] rounded-xl text-[16px] font-regular items-center justify-center transition-all flex flex-row gap-[10px] ${
                    isSelected ? "text-[#02022C]" : "bg-white border text-[#475569] border-[#E2E8F0] hover:border-[#02022C] "
                  }`}
                  style={isSelected ? {
                    border: '1px solid transparent',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #01012A 0%, #2E2C66 100%) border-box'
                  } : {}}
                >
                  <p.icon className={`w-4 h-4 ${isSelected ? "text-[#02022C]" : "text-[#94A3B8]"}`} />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Video Duration */}
        <div className="flex flex-col gap-4 bg-[#FFFFFF] p-[16px] rounded-[16px] border-[0.35px] border-[#0000001A]">
          <label className="text-[14px] font-bold text-[#000000]">Video Duration *</label>
          <div className="flex flex-wrap gap-[12px]">
            {durations.map((d) => {
              const isSelected = selectedDuration === d;
              return (
                <button 
                  key={d} 
                  onClick={() => setSelectedDuration(d)}
                  className={`px-[16px] py-[8px] rounded-xl text-[16px] font-regular items-center justify-center transition-all flex flex-row gap-[10px] ${
                    isSelected ? "text-[#02022C]" : "bg-white border text-[#475569] border-[#E2E8F0] hover:border-[#02022C] "
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
        <div className="flex flex-col gap-4 bg-[#FFFFFF] p-[16px] rounded-[16px] border-[0.35px] border-[#0000001A]">
          <label className="text-[14px] font-bold text-[#000000]">Video Format *</label>
          <div className="grid grid-cols-2 gap-3">
            {formats.map((f) => {
              const isSelected = selectedFormat === f.label;
              return (
                <button 
                  key={f.label} 
                  onClick={() => setSelectedFormat(f.label)}
                  className={`px-[16px] py-[8px] rounded-xl text-[16px] font-regular items-start transition-all flex flex-col gap-[5px] ${
                    isSelected ? "text-[#02022C]" : "bg-white border text-[#475569] border-[#E2E8F0] hover:border-[#02022C] "
                  }`}
                  style={isSelected ? {
                    border: '1px solid transparent',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #01012A 0%, #2E2C66 100%) border-box'
                  } : {}}
                >
                  <span className={`text-[13px] font-bold mb-1 ${isSelected ? "text-[#02022C]" : "text-[#121212]"}`}>{f.label}</span>
                  <span className="text-[11px] font-medium text-[#94A3B8] leading-tight">{f.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step4() {
  const summaryData = [
    { label: "Campaign Name", value: "Instagram promotion for summer balayage special", fullWidth: true },
    { label: "Objective", value: "Lead Generation" },
    { label: "Visual Style", value: "Elegant & Luxury" },
    { label: "Target Audience", value: "25-35 year old women interested in hair styling", fullWidth: true },
    { label: "Tone", value: "Friendly" },
    { label: "Color Scheme", value: "Warm Tones" },
    { label: "Platform", value: "TikTok", fullWidth: true },
    { label: "Duration", value: "30 sec" },
    { label: "Format", value: "Vertical (9:16)" },
  ];

  return (
    <div className="flex flex-col gap-[24px] animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-1">
        <h3 className="text-[18px] font-bold text-[#121212]">Review Your Campaign</h3>
        <p className="text-[14px] font-regular text-[#6B7280]">Check all the details before generating</p>
      </div>
      
      <div className="bg-white p-[20px] rounded-[16px] border-[0.35px] border-[#0000001A] flex flex-col gap-[12px]">
        <div className="grid grid-cols-2 gap-x-[16px] gap-y-[8px]">
          {summaryData.map((item, idx) => (
            <div key={idx} className={`flex flex-col gap-[12px] ${item.fullWidth ? "col-span-2" : "col-span-1"}`}>
              <label className="text-[14px] font-bold text-[#121212]">{item.label} *</label>
              <div className="px-[16px] py-[12px] bg-[#F8F8F8] rounded-[8px] text-[16px] text-[#121212] font-medium min-h-[44px] flex items-center">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
