"use client";

import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { getToken } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { cn, enrichMessageWithCampaign } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface AIResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUserMessage: string;
  initialAIResponse: string;
  sessionId: string;
  initialHistory?: { role: string; content: string }[] | null;
  selectedCampaign?: any | null;
  onCampaignStart?: (campaign: any) => void;
}

import { useUser } from "@/context/UserContext";

export default function AIResponseModal({ 
  isOpen, 
  onClose, 
  initialUserMessage,
  initialAIResponse,
  sessionId,
  initialHistory,
  selectedCampaign,
  onCampaignStart
}: AIResponseModalProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const { user } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize messages when modal opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      if (initialHistory && initialHistory.length > 0) {
        // Load from existing history
        const historicalMessages: Message[] = initialHistory.map((m: { role: string; content: string }, i: number) => {
          let content = m.content;
          // Robustly parse JSON-wrapped responses if they exist in history
          if (content.trim().startsWith("{") && content.trim().endsWith("}")) {
            try {
              const parsed = JSON.parse(content);
              content = parsed.response || parsed.message || parsed.ai_message || content;
            } catch (e) { /* fallback to raw content */ }
          }
          
          return {
            id: `hist-${i}-${Date.now()}`,
            role: (m.role === "assistant" || m.role === "ai") ? "ai" : "user",
            content: content,
            timestamp: new Date()
          };
        });
        setMessages(historicalMessages);
      } else if (initialUserMessage && initialAIResponse) {
        // Fallback to initial exchange
        setMessages([
          {
            id: "initial-user",
            role: "user",
            content: initialUserMessage,
            timestamp: new Date()
          },
          {
            id: "initial-ai",
            role: "ai",
            content: initialAIResponse,
            timestamp: new Date()
          }
        ]);
      }
    } else if (!isOpen) {
      setMessages([]);
      setInputText("");
      setIsGenerating(false);
    }
  }, [isOpen, initialUserMessage, initialAIResponse, initialHistory]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating || !sessionId) return;

    const userMsgContent = inputText.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMsgContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsGenerating(true);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      // Enrich follow-up message with campaign context if available
      const apiMessage = enrichMessageWithCampaign(userMsg.content, selectedCampaign);
      
      const response = await apiFetch(`${API_BASE}/ai/director/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { "Authorization": `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: apiMessage,
          professional_name: "Hareem",
          tag: "director"
        }),
      });

      if (!response.ok) throw new Error("AI Director Communication Failed");
      const data = await response.json();
      
      // Robustly extract from potentially array-wrapped or nested data
      const responseData = Array.isArray(data?.data) ? data.data[0] : (data?.data || data);
      const aiResponseContent = responseData?.response || responseData?.message || responseData?.ai_message || "I'm still processing your request. How else can I help?";
      
      const campaignStatus = responseData?.campaign_status;
      if (campaignStatus === "queued" || campaignStatus === "in_production") {
        const brief = responseData?.brief_draft || {};
        const title = brief.business_name ? `${brief.business_name} Campaign` : userMsgContent.length > 30 ? userMsgContent.substring(0, 30) + "..." : userMsgContent;
        if (onCampaignStart) {
          onCampaignStart({
            id: responseData?.campaign_id,
            sessionId: sessionId,
            title: title,
            status: campaignStatus,
            image: "/assets/hashtag-campaign.jpg"
          });
        }
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: aiResponseContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);

      // Sync to localStorage history to match ChatPage
      const existingSessionsStr = localStorage.getItem("chat_sessions");
      if (existingSessionsStr) {
        try {
          const sessions = JSON.parse(existingSessionsStr);
          const updatedSessions = sessions.map((s: any) => {
            if (s.id === sessionId) {
              return { 
                ...s, 
                messages: [...s.messages, 
                  { ...userMsg, timestamp: userMsg.timestamp.toISOString() },
                  { ...aiMsg, timestamp: aiMsg.timestamp.toISOString() }
                ] 
              };
            }
            return s;
          });
          localStorage.setItem("chat_sessions", JSON.stringify(updatedSessions));
        } catch (e) {
          console.error("Failed to sync modal chat to history", e);
        }
      }

    } catch (err) {
      console.error("Modal Chat Error:", err);
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: "ai",
        content: "Sorry, I lost my connection for a moment. Please try sending your message again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[650px] h-[85vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#02022C] rounded-xl flex items-center justify-center shadow-lg shadow-[#02022C]/10">
              <Icons.MagicWand className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[17px] font-bold text-[#121212]">AI Director Chat</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider">Active Consultation</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => router.push(`/chat?session_id=${sessionId}`)}
              className="px-4 py-2 bg-slate-50 text-[#475569] rounded-xl text-[13px] font-bold hover:bg-[#F1F5F9] transition-all flex items-center gap-2 border border-[#F1F5F9]"
            >
              Full History <Icons.ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-[#F1F5F9] rounded-full transition-colors group"
            >
              <Icons.Plus className="w-5 h-5 rotate-45 text-[#94A3B8] group-hover:text-[#121212]" />
            </button>
          </div>
        </div>

        {/* Chat History Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar bg-[#FDFDFF]"
        >
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={cn(
                "flex items-start gap-4 max-w-[85%]",
                m.role === "user" ? "flex-row-reverse ml-auto" : "mr-auto"
              )}
            >
              <div className={cn(
                "relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-100 shadow-sm flex items-center justify-center",
                m.role === "ai" ? "bg-[#02022C]" : "bg-[#F1F5F9]"
              )}>
                {m.role === "user" ? (
                  <Image 
                    src={user?.avatarUrl || "/assets/7441684aa4149b2fd6d813ffefd24cdc9a178dba.jpg"} 
                    alt="User" 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <Image alt="AI" src="/assets/ai-assistant-avatar.png" width={32} height={32} className="object-cover" />
                )}
              </div>
              <div className={cn(
                "flex flex-col",
                m.role === "user" ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm transition-all",
                  m.role === "user" 
                    ? "bg-[linear-gradient(90deg,#01012A_0%,#2E2C66_100%)] text-white rounded-tr-none shadow-[inset_0px_-5px_5px_0px_#4F569B]" 
                    : "bg-white text-[#121212] border border-slate-100 rounded-tl-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.04)]"
                )}>
                  {(() => {
                    let content = m.content;
                    if (m.role === "ai") {
                      if (content.includes("[USER MESSAGE]:")) {
                        content = content.split("[USER MESSAGE]:").pop() || content;
                      }
                      const trimmed = content.trim();
                      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
                        try {
                          const parsed = JSON.parse(trimmed);
                          content = parsed.response || parsed.message || parsed.ai_message || content;
                        } catch (e) { /* fallback to original content if parse fails */ }
                      }
                    }
                    return <MarkdownRenderer content={content.trim()} isUser={m.role === "user"} />;
                  })()}
                </div>
                <span className="text-[9px] text-slate-400 mt-1.5 font-bold uppercase tracking-widest px-1">
                  {m.role === "user" ? "YOU" : "AI DIRECTOR"} • {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isGenerating && (
            <div className="mr-auto max-w-[80%] flex items-start gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
               <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-100 shadow-sm bg-[#02022C] flex items-center justify-center">
                 <Icons.Loader className="w-4 h-4 text-white animate-spin" />
               </div>
               <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
               </div>
            </div>
          )}
        </div>

        {/* Message Input Bottom */}
        <div className="p-6 bg-white border-t border-[#F1F5F9]">
          <form 
            onSubmit={handleSendMessage}
            className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 shadow-inner transition-all focus-within:ring-2 focus-within:ring-[#02022C]/5 focus-within:border-[#02022C]/10"
          >
            <input 
              type="text"
              placeholder="Ask your AI Director a follow-up question..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isGenerating}
              className="flex-1 bg-transparent px-3 py-2 text-[14px] text-[#121212] outline-none placeholder:text-slate-400 font-medium"
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isGenerating}
              className="h-[44px] px-6 bg-[#02022C] text-white rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 shadow-md shadow-[#02022C]/10 font-bold"
            >
              Ask <Icons.Send className="w-4 h-4 ml-1 text-white" />
            </button>
          </form>
          <p className="text-[11px] text-center text-[#94A3B8] mt-3 font-medium">
            Responses are saved to your chat history automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
