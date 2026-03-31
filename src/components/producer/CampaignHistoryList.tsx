"use client";

import React, { useState } from "react";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface CampaignHistoryListProps {
  history: any[];
}

export function CampaignHistoryList({ history }: CampaignHistoryListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!history.length) return null;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between border-b border-slate-100 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
             <Icons.Files className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex flex-col">
             <h2 className="text-xl font-black text-[#01012A] tracking-tighter lowercase leading-none">Dossier Matrix</h2>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Historical Production Audits</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
           <span className="text-[10px] font-black text-slate-400">{history.length}</span>
           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Records</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {history.map((campaign) => (
          <div 
            key={campaign.id}
            className="group bg-white rounded-[32px] border border-slate-100 p-8 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col gap-6 relative overflow-hidden"
          >
            {/* Subtle card highlight */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant Identity</span>
                 <h4 className="text-xl font-black text-[#01012A] tracking-tighter lowercase">{campaign.name || "unnamed_brief"}</h4>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                campaign.status === "delivered" || campaign.status === "completed" 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                  : "bg-slate-50 text-[#01012A] border-slate-100"
              )}>
                {campaign.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
               <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 flex flex-col gap-1">
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Timeline</span>
                  <span className="text-[11px] font-bold text-[#0A0A0A] italic">
                    {new Date(campaign.created_at).toLocaleDateString()}
                  </span>
               </div>
               <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 flex flex-col gap-1">
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">ID Matrix</span>
                  <span className="text-[10px] font-black text-[#01012A] truncate">{campaign.id.split('-')[0]}</span>
               </div>
            </div>

            <div className="flex flex-col gap-4 relative z-10">
               <button 
                 onClick={() => setExpandedId(expandedId === campaign.id ? null : campaign.id)}
                 className="w-full h-12 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between px-6 transition-all group/btn"
               >
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">View Dossier Brief</span>
                  <Icons.ArrowDown className={cn(
                    "w-4 h-4 text-slate-400 transition-transform duration-500",
                    expandedId === campaign.id && "rotate-180"
                  )} />
               </button>

               {expandedId === campaign.id && (
                 <div className="p-6 bg-[#0A0A0A] rounded-2xl">
                    <pre className="text-[10px] font-mono text-emerald-400/90 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                      {JSON.stringify(campaign.brief, null, 2)}
                    </pre>
                 </div>
               )}
            </div>

            <button className="h-14 bg-white border-2 border-slate-100 hover:border-[#01012A] hover:bg-linear-to-r hover:from-[#01012A] hover:to-[#2E2C66] hover:text-white rounded-[20px] transition-all duration-500 flex items-center justify-center gap-3 relative z-10 group/launch">
               <Icons.Rocket className="w-5 h-5 text-slate-300 group-hover/launch:text-white transition-colors" />
               <span className="text-xs font-black uppercase tracking-widest">Reproduction Request</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
