import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface CampaignPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignData: {
    title?: string;
    session_id?: string;
    message?: string;
    status?: string;
    campaign_id?: string;
    video_url?: string | null;
    voiceover_url?: string | null;
    music_url?: string | null;
    script?: string | null;
    history?: { role: string; content: string }[] | null;
    prompt?: string | null;
  } | null;
  showHistory?: boolean;
}

export default function CampaignPreviewModal({ isOpen, onClose, campaignData, showHistory = false }: CampaignPreviewModalProps) {
  const { user } = useUser();
  const [localHistory, setLocalHistory] = useState<{ role: string; content: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [localStatus, setLocalStatus] = useState<string | undefined>(campaignData?.status);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize and Sync History
  useEffect(() => {
    if (isOpen && campaignData?.history) {
      setLocalHistory(campaignData.history);
      setLocalStatus(campaignData.status);
    }
  }, [isOpen, campaignData]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [localHistory, isGenerating]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating || !campaignData?.session_id) return;

    const userMsg = { role: "user", content: inputText.trim() };
    setLocalHistory(prev => [...prev, userMsg]);
    setInputText("");
    setIsGenerating(true);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await apiFetch(`${API_BASE}/ai/director/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { "Authorization": `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({
          session_id: campaignData.session_id,
          message: userMsg.content,
          tag: "director"
        }),
      });

      if (!response.ok) throw new Error("AI Director Communication Failed");
      const data = await response.json();
      
      const aiResponseContent = data?.data?.response || data?.response || data?.message || "I've updated the campaign details.";
      const aiMsg = { role: "assistant", content: aiResponseContent };
      
      setLocalHistory(prev => [...prev, aiMsg]);
      
      // Check for Launch trigger
      if (data?.data?.campaign_status === "queued" || data?.data?.campaign_status === "in_production") {
        setLocalStatus(data.data.campaign_status);
      }

    } catch (err) {
      console.error("Preview Chat Error:", err);
      setLocalHistory(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error updating the campaign. Please try again." 
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen || !campaignData) return null;
  const isLaunched = ["in_production", "queued", "In Production", "Ready", "completed", "delivered", "ready"].includes(localStatus || "");
  const isDraft = localStatus === "ready_for_human_review";
  const canChat = !isLaunched;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between bg-white z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#02022C] rounded-xl flex items-center justify-center shadow-lg shadow-[#02022C]/10">
              <Icons.Eye className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[17px] font-bold text-[#121212]">{campaignData.title || "Campaign Preview"}</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-[#64748B] font-bold uppercase tracking-widest">SID: {campaignData.session_id}</span>
                </div>
                {localStatus && (
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      !isLaunched ? "bg-amber-500 animate-pulse" : "bg-green-500"
                    )} />
                    <span className="text-[9px] text-[#2E3A59] font-black uppercase tracking-widest">
                      {!isLaunched ? (isDraft ? "In Review" : "Consultation") : localStatus === 'ready' ? "Ready" : "Processing"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-[#F1F5F9] rounded-full transition-colors group"
          >
            <Icons.Plus className="w-5 h-5 rotate-45 text-[#94A3B8] group-hover:text-[#121212]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
          {/* User Vision / Prompt section */}

          {/* Initial Strategy / Storyboard section */}
          {(campaignData.prompt || campaignData.message) && (
            <div className="space-y-4">
              <h3 className="text-[12px] font-black text-[#02022C] uppercase tracking-[0.2em] opacity-40">Initial Campaign Concept</h3>
              <div className="bg-[#F8FAFC] text-[#4F4F4F] italic border border-[#F1F5F9] rounded-[32px] p-8 shadow-sm">
                 <MarkdownRenderer content={`"${campaignData.prompt || campaignData.message}"`} isUser={false} />
              </div>
            </div>
          )}
          {/* Visual Preview */}
          <div className="space-y-4">
            <h3 className="text-[12px] font-black text-[#02022C] uppercase tracking-[0.2em]">Visual & Video</h3>
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 border border-[#F1F5F9] shadow-inner group">
              {campaignData.video_url ? (
                <video 
                   src={campaignData.video_url} 
                  controls 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-4">
                  <Icons.Image className="w-16 h-16" />
                  <p className="text-xs font-bold uppercase tracking-widest">Video is still processing</p>
                </div>
              )}
            </div>
          </div>

          {/* Audio Tracks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-[12px] font-black text-[#02022C] uppercase tracking-[0.2em]">Voiceover</h3>
              <div className="p-4 bg-white border border-[#F1F5F9] rounded-2xl shadow-sm flex flex-col gap-3">
                {campaignData.voiceover_url ? (
                  <audio src={campaignData.voiceover_url} controls className="w-full h-8" />
                ) : (
                  <div className="text-[11px] text-[#94A3B8] font-medium">No voiceover track available</div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[12px] font-black text-[#02022C] uppercase tracking-[0.2em]">Background Music</h3>
              <div className="p-4 bg-white border border-[#F1F5F9] rounded-2xl shadow-sm flex flex-col gap-3">
                {campaignData.music_url ? (
                  <audio src={campaignData.music_url} controls className="w-full h-8" />
                ) : (
                  <div className="text-[11px] text-[#94A3B8] font-medium">No music track available</div>
                )}
              </div>
            </div>
          </div>

          {/* Script Content */}
          <div className="space-y-4">
            <h3 className="text-[12px] font-black text-[#02022C] uppercase tracking-[0.2em]">Campaign Script</h3>
            <div className="p-6 bg-[#02022C]/2 border border-[#F1F5F9] rounded-[24px] relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Icons.MagicWand className="w-12 h-12 text-[#02022C]" />
                </div>
                <p className="text-[15px] text-[#334155] leading-[1.6] font-medium relative z-10">
                    {campaignData.script || "Script loading..."}
                </p>
            </div>
          </div>
          {/* Interactive Chat & Session History */}
          {showHistory && (
            <div className="space-y-4 pt-4 border-t border-[#F1F5F9]">
              <p className="text-[11px] font-black text-[#02022C] uppercase tracking-[0.2em] opacity-40">
                {showHistory ? "Session Audit Log" : (canChat ? "Live Collaboration" : "Session Outcome")}
              </p>
              <div className="bg-[#FDFDFF] border border-[#F1F5F9] rounded-[32px] overflow-hidden flex flex-col shadow-sm">
                <div className="p-6 space-y-8 flex flex-col max-h-[450px] overflow-y-auto custom-scrollbar">
                  {(() => {
                    const processedHistory = localHistory
                      .map((msg) => {
                        let content = msg.content;
                        if (content.includes("[USER MESSAGE]:")) {
                          content = content.split("[USER MESSAGE]:").pop() || content;
                        }
                        if (content.trim().startsWith("{") && content.trim().endsWith("}")) {
                          try {
                            const parsed = JSON.parse(content);
                            if (parsed.response) content = parsed.response;
                            else if (parsed.message) content = parsed.message;
                            else return null;
                          } catch (e) { /* keep source if parse fails */ }
                        }
                        const isStatus = msg.content.includes("LAUNCH_CAMPAIGN:") || content.includes("LAUNCH_CAMPAIGN:");
                        content = content.trim();
                        
                        if (!content && !isStatus) return null;
                        return { ...msg, content: isStatus ? "LAUNCH_CAMPAIGN_PLACEHOLDER" : content };
                      })
                      .filter((msg): msg is { role: string; content: string } => msg !== null);

                    const finalHistory: { role: string; content: string }[] = [];
                    processedHistory.forEach((msg) => {
                      const prev = finalHistory[finalHistory.length - 1];
                      if (prev && prev.role === msg.role && prev.content === msg.content) return;
                      if (msg.content === "LAUNCH_CAMPAIGN_PLACEHOLDER" && prev && prev.role === "assistant") return;
                      finalHistory.push(msg);
                    });

                    return finalHistory.map((msg, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "flex items-start gap-4 max-w-[90%] animate-in fade-in slide-in-from-bottom-2 duration-400",
                          msg.role === "user" ? "flex-row-reverse ml-auto" : "mr-auto"
                        )}
                      >
                        <div className="relative w-8 h-8 shrink-0 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                          {msg.role === "user" ? (
                            <Image src={user?.avatarUrl || "/assets/7441684aa4149b2fd6d813ffefd24cdc9a178dba.jpg"} alt="User" fill className="object-cover" />
                          ) : (
                            <Image src="/assets/ai-assistant-avatar.png" alt="AI" fill className="object-cover" />
                          )}
                        </div>

                        <div className={cn("flex flex-col", msg.role === "user" ? "items-end text-right" : "items-start text-left")}>
                          <div className={cn(
                            "px-5 py-3.5 rounded-[24px] text-[13.5px] leading-relaxed shadow-sm transition-all",
                            msg.role === "user" 
                              ? "bg-linear-to-r from-[#01012A] to-[#2E2C66] text-white rounded-tr-none shadow-[inset_0px_-5px_5px_0px_rgba(79,86,155,0.1)]" 
                              : "bg-white text-[#121212] border border-slate-100 rounded-tl-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.04)]"
                          )}>
                            {msg.content === "LAUNCH_CAMPAIGN_PLACEHOLDER" ? (
                              <span className="flex items-center gap-2 font-black italic text-green-600">🚀 Success! Campaign Launched.</span> 
                            ) : (
                              <MarkdownRenderer content={msg.content} isUser={msg.role === "user"} />
                            )}
                          </div>
                          <span className="text-[8px] text-slate-400 mt-1.5 font-black uppercase tracking-widest px-1 opacity-60">
                            {msg.role === "user" ? "Client Account" : "AI Director"}
                          </span>
                        </div>
                      </div>
                    ));
                  })()}
                  {isGenerating && (
                    <div className="mr-auto flex items-center gap-1.5 bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm animate-in slide-in-from-left-2 duration-300">
                      <div className="w-1.5 h-1.5 bg-[#02022C]/20 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-[#02022C]/20 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-[#02022C]/20 rounded-full animate-bounce" />
                    </div>
                  )}
                  <div ref={chatEndRef} className="h-4" />
                </div>

                {/* Chat Input Area - Only show if not in Audit view and not launched */}
                {(canChat && !showHistory) && (
                  <div className="p-6 bg-slate-50 border-t border-[#F1F5F9]">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-white border border-slate-200 rounded-[20px] p-2 shadow-sm focus-within:ring-2 focus-within:ring-[#02022C]/5 focus-within:border-[#02022C]/10 transition-all">
                      <input 
                        type="text" 
                        placeholder="Refine values or tell AI Director to 'Launch'..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        disabled={isGenerating}
                        className="flex-1 bg-transparent px-4 py-2 text-[14px] text-[#121212] outline-none placeholder:text-slate-400 font-medium"
                      />
                      <button 
                        type="submit"
                        disabled={!inputText.trim() || isGenerating}
                        className="h-11 px-6 bg-[#02022C] text-white rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 font-black text-[12px] uppercase tracking-wider"
                      >
                        Send <Icons.Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#F1F5F9] bg-[#FDFDFF] flex items-center justify-between sticky bottom-0">
          <div className="flex flex-col gap-1">
            
          </div>
          <button 
            onClick={onClose}
            className="h-11 px-8 bg-[#02022C] text-white rounded-xl font-bold text-sm hover:shadow-xl hover:-translate-y-px transition-all"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
