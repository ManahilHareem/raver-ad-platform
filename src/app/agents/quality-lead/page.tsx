"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { apiFetch } from "@/lib/api";
import { QualityCandidates } from "@/components/agents/quality-lead/QualityCandidates";
import { QualityAuditModal } from "@/components/agents/quality-lead/QualityAuditModal";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

export default function QualityLeadPage() {
  const [candidates, setCandidates] = useState<any>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://apiplatform.raver.ai/api";

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch(`${API_BASE}/ai/quality/candidates`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCandidates(data.data);
        }
      } else {
        toast.error("Failed to synchronize quality archives.");
      }
    } catch (err) {
      console.warn("Candidates fetch failed:", err);
      toast.error("Orchestration pipeline failure. Retrying...");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleAudit = (candidate: any) => {
    setSelectedCandidate(candidate);
    setIsAuditModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 p-6 sm:p-10 bg-white rounded-[40px] min-h-screen">
        {/* Quality Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/agents" 
              className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all active:scale-90 group shadow-sm"
            >
              <Icons.ArrowLeft className="w-5 h-5 text-[#01012A] group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div className="flex flex-col">
               <h1 className="text-[34px] font-black text-[#01012A] tracking-tighter lowercase leading-none">RAVER QUALITY LEAD</h1>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#01012A]/30 mt-3">Neural Integrity & Brand Alignment Governance</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-4">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global Audit Rate</span>
              <span className="text-[16px] font-black text-[#01012A]">94.2%</span>
            </div>
            <button 
              onClick={fetchCandidates}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-[#01012A] hover:bg-slate-100 transition-all active:rotate-180"
            >
              <Icons.RefreshCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: "Candidates Pending", value: "24", icon: Icons.Activity, color: "text-blue-500" },
             { label: "Auto-Rejections", value: "112", icon: Icons.ShieldCheck, color: "text-emerald-500" },
             { label: "Brand Violations", value: "3", icon: Icons.AlertTriangle, color: "text-amber-500" },
             { label: "Synthesis Accuracy", value: "98.8%", icon: Icons.Layers, color: "text-purple-500" }
           ].map((stat, i) => (
             <div key={i} className="bg-slate-50 border border-[#F1F5F9] rounded-[28px] p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                </div>
                <div className="text-2xl font-black text-[#01012A]">{stat.value}</div>
             </div>
           ))}
        </div>

        <div className="h-px bg-slate-100 w-full my-4" />

        {/* Main Interface */}
        <div className="flex-1 space-y-8">
           <div className="flex items-center gap-3 px-2">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
             <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#01012A]">Active Synthesis Candidate Feed</h3>
           </div>

           <QualityCandidates 
             candidates={candidates} 
             isLoading={isLoading} 
             onAudit={handleAudit} 
           />
        </div>
      </div>

      <QualityAuditModal 
        isOpen={isAuditModalOpen}
        onClose={() => {
          setIsAuditModalOpen(false);
          setSelectedCandidate(null);
        }}
        onRefresh={fetchCandidates}
        candidate={selectedCandidate}
      />
    </DashboardLayout>
  );
}
