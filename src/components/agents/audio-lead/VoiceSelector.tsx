"use client";

import React, { useState } from "react";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export const VOICE_OPTIONS = [
  // Professional Male Narrators
  { id: "adam", name: "Adam - Deep Casual American (Default)", category: "Male - Professional", accent: "American" },
  { id: "arnold", name: "Arnold - Crisp Calm Narrator", category: "Male - Professional", accent: "American" },
  { id: "callum", name: "Callum - Strong Middle-Aged", category: "Male - Professional", accent: "American" },
  { id: "clyde", name: "Clyde - American Narrator", category: "Male - Professional", accent: "American" },
  { id: "daniel", name: "Daniel - Deep Authoritative", category: "Male - Professional", accent: "British" },
  { id: "george", name: "George - Warm Narrator", category: "Male - Professional", accent: "British" },
  { id: "james", name: "James - Professional Calm", category: "Male - Professional", accent: "British" },
  { id: "joseph", name: "Joseph - Professional British", category: "Male - Professional", accent: "British" },
  { id: "liam", name: "Liam - Neutral Professional", category: "Male - Professional", accent: "American" },
  { id: "michael", name: "Michael - Deep American", category: "Male - Professional", accent: "American" },

  // Casual/Young Male
  { id: "antoni", name: "Antoni - Well-Rounded Warm", category: "Male - Casual", accent: "American" },
  { id: "charlie", name: "Charlie - Casual Australian", category: "Male - Casual", accent: "Australian" },
  { id: "drew", name: "Drew - Young Energetic", category: "Male - Casual", accent: "American" },
  { id: "ethan", name: "Ethan - Conversational", category: "Male - Casual", accent: "American" },
  { id: "fin", name: "Fin - Warm Irish", category: "Male - Casual", accent: "Irish" },
  { id: "harry", name: "Harry - British Young", category: "Male - Casual", accent: "British" },
  { id: "jeremy", name: "Jeremy - Animated Irish", category: "Male - Casual", accent: "Irish" },
  { id: "josh", name: "Josh - Young American", category: "Male - Casual", accent: "American" },
  { id: "patrick", name: "Patrick - Conversational", category: "Male - Casual", accent: "American" },
  { id: "sam", name: "Sam - Raspy American", category: "Male - Casual", accent: "American" },
  { id: "thomas", name: "Thomas - Young Energetic", category: "Male - Casual", accent: "American" },

  // Professional Female
  { id: "charlotte", name: "Charlotte - Clear British Narrator", category: "Female - Professional", accent: "British" },
  { id: "domi", name: "Domi - Strong Confident", category: "Female - Professional", accent: "American" },
  { id: "dorothy", name: "Dorothy - Warm Pleasant", category: "Female - Professional", accent: "British" },
  { id: "emily", name: "Emily - Calm Professional", category: "Female - Professional", accent: "American" },
  { id: "rachel", name: "Rachel - Calm Narrator", category: "Female - Professional", accent: "American" },
  { id: "sarah", name: "Sarah - Soft Professional", category: "Female - Professional", accent: "American" },
  { id: "alice", name: "Alice - Confident British", category: "Female - Professional", accent: "British" },
  { id: "matilda", name: "Matilda - Warm American", category: "Female - Professional", accent: "American" },

  // Casual/Young Female
  { id: "elli", name: "Elli - Emotional Young", category: "Female - Casual", accent: "American" },
  { id: "freya", name: "Freya - Young Expressive", category: "Female - Casual", accent: "American" },
  { id: "gigi", name: "Gigi - Upbeat", category: "Female - Casual", accent: "American" },
  { id: "grace", name: "Grace - Soft Southern", category: "Female - Casual", accent: "American Southern" },
  { id: "jessica", name: "Jessica - Young American", category: "Female - Casual", accent: "American" },
  { id: "lily", name: "Lily - British Conversational", category: "Female - Casual", accent: "British" },
  { id: "nicole", name: "Nicole - Whisper Soft", category: "Female - Casual", accent: "American" },
];

interface VoiceSelectorProps {
  selectedVoice: string;
  onSelect: (voiceId: string) => void;
  className?: string;
}

export function VoiceSelector({ selectedVoice, onSelect, className }: VoiceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentVoice = VOICE_OPTIONS.find(v => v.id === selectedVoice) || VOICE_OPTIONS[0];
  const isMale = currentVoice.category.startsWith("Male");

  return (
    <div className={cn("relative flex flex-col gap-2", className)}>
      <label className="text-[10px] font-black uppercase tracking-widest text-[#01012A] ml-1">Selection Voice</label>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 bg-white border border-slate-100 rounded-[20px] px-6 flex items-center justify-between hover:border-slate-300 transition-all active:scale-[0.98] shadow-sm overflow-hidden"
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
             {isMale ? <Icons.Mic className="w-4 h-4 text-blue-500" /> : <Icons.Mic className="w-4 h-4 text-pink-500" />}
          </div>
          <div className="flex flex-col items-start overflow-hidden">
             <span className="text-sm font-black text-[#01012A] truncate tracking-tight">{currentVoice.name}</span>
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate">{currentVoice.accent} • {currentVoice.category}</span>
          </div>
        </div>
        <Icons.ChevronDown className={cn("w-4 h-4 text-slate-300 transition-transform duration-500", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-slate-100 rounded-[24px] shadow-2xl p-2 z-50 flex flex-col gap-1 max-h-[400px] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
            {VOICE_OPTIONS.map((voice) => {
              const itemIsMale = voice.category.startsWith("Male");
              return (
                <button
                  key={voice.id}
                  type="button"
                  onClick={() => { onSelect(voice.id); setIsOpen(false); }}
                  className={cn(
                    "w-full p-4 rounded-[18px] flex items-center gap-4 transition-all text-left group",
                    selectedVoice === voice.id ? "bg-[#01012A] text-white" : "hover:bg-slate-50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border transition-all",
                    selectedVoice === voice.id ? "bg-white/10 border-white/20" : "bg-white border-slate-100"
                  )}>
                    {itemIsMale ? (
                      <Icons.Mic className={cn("w-5 h-5", selectedVoice === voice.id ? "text-white" : "text-blue-500")} />
                    ) : (
                      <Icons.Mic className={cn("w-5 h-5", selectedVoice === voice.id ? "text-white" : "text-pink-500")} />
                    )}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                     <span className={cn("text-xs font-black tracking-tight", selectedVoice === voice.id ? "text-white" : "text-[#01012A]")}>{voice.name}</span>
                     <span className={cn("text-[9px] font-bold uppercase tracking-tighter", selectedVoice === voice.id ? "text-white/60" : "text-slate-400")}>{voice.accent} • {voice.category}</span>
                  </div>
                  {selectedVoice === voice.id && <Icons.Success className="w-4 h-4 text-emerald-400 ml-auto" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

