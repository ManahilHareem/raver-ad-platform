"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import DashboardLayout from "@/components/DashboardLayout";
import { Icons } from "@/components/ui/icons";
import { getToken } from '@/lib/auth';
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  urls: string[];
  tag?: string;
  createdAt: Date;
}

import { useUser } from "@/context/UserContext";

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const { user } = useUser();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, isLoading]);

  // Load sessions from local storage
  useEffect(() => {
    const savedSessions = localStorage.getItem("chat_sessions");
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        // Convert string timestamps back to Date objects
        const hydrated = parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          messages: s.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }));
        setSessions(hydrated);
        if (hydrated.length > 0) {
          setActiveSessionId(hydrated[0].id);
        }
      } catch (e) {
        console.error("Failed to hydrate sessions:", e);
      }
    }
  }, []);

  // Sync to local storage on change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("chat_sessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newSess: ChatSession = {
      id: newId,
      title: "New Chat",
      messages: [],
      urls: [],
      createdAt: new Date()
    };
    setSessions(prev => [newSess, ...prev]);
    setActiveSessionId(newId);
    setInputText("");
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim() || !activeSessionId) return;
    
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return { ...s, urls: [...s.urls, newUrl.trim()] };
      }
      return s;
    }));
    setNewUrl("");
  };

  const handleExternalAddUrl = () => {
    if (!newUrl.trim() || !activeSessionId) return;
    
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return { ...s, urls: [...s.urls, newUrl.trim()] };
      }
      return s;
    }));
    setNewUrl("");
    setShowUrlInput(false);
  };

  const handleDeleteSession = async (e: React.MouseEvent, sid: string) => {
    e.stopPropagation(); // Prevent switching to the session before deleting it
    
    // Optimistic UI update
    const previousSessions = [...sessions];
    setSessions(prev => prev.filter(s => s.id !== sid));
    if (activeSessionId === sid) {
      setActiveSessionId("");
    }

    try {
      const response = await fetch(`http://localhost:8000/api/chat/history/${sid}`, {
        method: "DELETE",
        headers: {
          "accept": "*/*",
          ...(getToken() ? { "Authorization": `Bearer ${getToken()}` } : {}),
        },
      });

      if (!response.ok) throw new Error("Failed to delete session on server");
    } catch (error) {
      console.error("Delete Session Error:", error);
      // Revert on error
      setSessions(previousSessions);
      if (activeSessionId === "") {
        setActiveSessionId(sid);
      }
    }
  };

  const handleRemoveUrl = (url: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return { ...s, urls: s.urls.filter(u => u !== url) };
      }
      return s;
    }));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading || !activeSessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputText,
      timestamp: new Date(),
    };

    // Update session with user message and potentially a title
    let updatedSessions = sessions.map(s => {
      if (s.id === activeSessionId) {
        const newMessages = [...s.messages, userMessage];
        let newTitle = s.title;
        if (s.messages.length === 0) {
          newTitle = inputText.length > 30 ? inputText.substring(0, 30) + "..." : inputText;
        }
        return { ...s, messages: newMessages, title: newTitle };
      }
      return s;
    });

    setSessions(updatedSessions);
    setInputText("");
    setIsLoading(true);

    try {
      const currentSession = updatedSessions.find(s => s.id === activeSessionId);
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*",
          ...(getToken() ? { "Authorization": `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({
          session_id: activeSessionId,
          message: userMessage.content,
          website_url: currentSession?.urls.join(", ") || "string",
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
            const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: (data?.data?.response || data?.response || data?.message || "I'm here to help!"),
          timestamp: new Date(),
        };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, aiMessage] };
        }
        return s;
      }));
    } catch (error) {
      console.error("Chat Error:", error);
      let errorText = "Sorry, I encountered an error. Please try again later.";
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        errorText = "Could not connect to the AI backend at http://localhost:8000. Please ensure your backend server is running.";
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: errorText,
        timestamp: new Date(),
      };
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, errorMessage] };
        }
        return s;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-[calc(100vh-140px)]">
        
        {/* Internal Chat Sidebar */}
        <div className="w-[300px] border-r border-slate-100 flex flex-col bg-slate-50/30">
          <div className="p-4 flex flex-col gap-4">
            <button 
              onClick={handleNewChat}
              className="w-full h-[44px] flex items-center justify-center gap-2 bg-[#02022C] text-white rounded-xl text-[14px] font-bold hover:bg-[#1A1A3F] transition-all shadow-md shadow-[#02022C]/10"
            >
              <Icons.Plus className="w-4 h-4" /> New Chat
            </button>
            <div className="h-px bg-slate-200/60" />
          </div>

          <div className="flex-1 overflow-y-auto px-3 custom-scrollbar flex flex-col gap-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">Previous Chats</span>
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group text-left",
                  activeSessionId === s.id 
                    ? "bg-white border border-slate-100 shadow-sm" 
                    : "hover:bg-white/50"
                )}
              >
                <Icons.MessageCircle className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  activeSessionId === s.id ? "text-[#02022C]" : "text-slate-400 group-hover:text-slate-600"
                )} />
                <span className={cn(
                  "text-[13px] font-medium truncate",
                  activeSessionId === s.id ? "text-[#121212]" : "text-slate-500"
                )}>
                  {s.title}
                </span>

                <button 
                  onClick={(e) => handleDeleteSession(e, s.id)}
                  className="ml-auto p-1.5 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
                >
                   <Icons.Trash className="w-3.5 h-3.5" />
                </button>
              </button>
            ))}
            {sessions.length === 0 && (
              <p className="text-[12px] text-slate-400 px-3 py-4 text-center italic">No history yet</p>
            )}
          </div>

          {/* Session Settings / URL Management */}

        </div>

        {/* Main Chat Content */}
        {!activeSession ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-[#FDFDFF] relative overflow-hidden">
             {/* Decorative background logo */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] select-none pointer-events-none">
                <Icons.Logo className="w-96 h-96" />
             </div>
             
             <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-white rounded-[24px] shadow-xl border border-slate-100 flex items-center justify-center">
                   <Icons.CreativeStudio className="w-10 h-10 text-[#02022C]" />
                </div>
                <div className="flex flex-col gap-2">
                   <h1 className="text-3xl font-bold text-[#121212]">Welcome to AI Chat</h1>
                   <p className="text-slate-500 max-w-sm font-medium">Create a new chat or select from your history to get started with your AI assistant.</p>
                </div>
                <button 
                   onClick={handleNewChat}
                   className="h-[48px] px-8 bg-[#02022C] text-white rounded-2xl text-[15px] font-bold hover:bg-[#1A1A3F] transition-all flex items-center gap-3 shadow-xl shadow-[#02022C]/20"
                >
                   <Icons.Plus className="w-5 h-5" /> Start First Conversation
                </button>
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col relative overflow-hidden bg-[#FDFDFF]">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-20 shadow-sm shadow-slate-900/2">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden shadow-sm border border-slate-100">
                  <Image 
                    src="/assets/ai-assistant-avatar.png" 
                    alt="AI Assistant" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[15px] font-bold text-[#121212] truncate max-w-[400px]">{activeSession.title}</h2>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">AI Assistant Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message History Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar bg-slate-50/20">
              {activeSession.messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-30 select-none">
                  <Icons.MessageCircle className="w-20 h-20 mb-4 text-[#02022C]" />
                  <h3 className="text-xl font-bold text-[#121212]">How can I help you today?</h3>
                  <p className="text-sm max-w-xs mt-2 font-medium">I'm ready to assist with your branding, campaigns, or technical questions.</p>
                </div>
              ) : (
                activeSession.messages.map((m) => (
                  <div 
                    key={m.id} 
                    className={cn(
                      "flex items-start gap-4 max-w-[85%]",
                      m.role === "user" ? "flex-row-reverse ml-auto" : "mr-auto"
                    )}
                  >
                    {/* Avatar Bubble */}
                    <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                      {m.role === "user" ? (
                        <Image 
                          src={user?.avatarUrl || "/assets/7441684aa4149b2fd6d813ffefd24cdc9a178dba.jpg"} 
                          alt="User" 
                          fill 
                          className="object-cover transition-opacity duration-300"
                        />
                      ) : (
                        <Image 
                          src="/assets/ai-assistant-avatar.png" 
                          alt="AI Assistant" 
                          fill 
                          className="object-cover"
                        />
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
                          : "bg-white text-[#121212] border border-slate-200 rounded-tl-none"
                      )}>
                        {m.content}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1.5 font-bold uppercase tracking-widest px-1">
                        {m.role === "user" ? "YOU" : "AI"} • {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="mr-auto max-w-[80%] flex items-start gap-4">
                  <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-[#02022C] flex items-center justify-center">
                    <Image 
                      src="/assets/ai-assistant-avatar.png" 
                      alt="AI Assistant" 
                      fill 
                      className="object-cover animate-pulse"
                    />
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Container */}
            <div className="p-6 bg-white border-t border-slate-100 relative">
              {/* Inline URL Input (Toggleable) */}
              {showUrlInput && (
                <div className="absolute bottom-full left-6 right-6 mb-3 bg-white border border-slate-200 rounded-xl shadow-xl p-3 flex gap-3 animate-in slide-in-from-bottom-2 duration-200">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Icons.ExternalLink className="w-5 h-5" />
                  </div>
                  <input 
                    type="text"
                    placeholder="Enter website URL to analyze..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#121212] font-medium"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleExternalAddUrl();
                      }
                      if (e.key === "Escape") setShowUrlInput(false);
                    }}
                  />
                  <button 
                    onClick={handleExternalAddUrl}
                    className="bg-[#02022C] text-white px-4 py-1.5 rounded-lg text-[13px] font-bold"
                  >
                    Add
                  </button>
                  <button 
                    onClick={() => setShowUrlInput(false)}
                    className="p-2 text-slate-400 hover:text-[#121212]"
                  >
                    <Icons.Plus className="w-5 h-5 rotate-45" />
                  </button>
                </div>
              )}

              <form 
                onSubmit={handleSendMessage}
                className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-[20px] p-2.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#02022C]/5 focus-within:border-[#02022C]/10"
              >
                <div className="flex items-center">
                  <button 
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      showUrlInput ? "bg-[#02022C] text-white" : "text-slate-400 hover:bg-slate-200/50 hover:text-[#02022C]"
                    )}
                  >
                    <Icons.Plus className="w-5 h-5" />
                  </button>
                  <div className="w-px h-6 bg-slate-200 mx-2" />
                  <div className="p-2 text-slate-400">
                     <Icons.MessageCircle className="w-5 h-5" />
                  </div>
                </div>
            <input 
                type="text"
                placeholder={activeSession?.tag === "director" ? "This consultation is in review mode..." : "Reply to AI Director..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading || !activeSessionId || activeSession?.tag === "director"}
                className="flex-1 bg-transparent px-3 py-2 text-[14px] text-[#121212] outline-none placeholder:text-slate-400 font-medium disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={!inputText.trim() || isLoading || activeSession?.tag === "director"}
                className="h-[44px] px-6 bg-[#02022C] text-white rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 shadow-md shadow-[#02022C]/10 font-bold"
              >
                Send <Icons.Send className="w-4 h-4 ml-1 text-white" />
              </button>
            </form>
            {activeSession?.tag === "director" && (
              <p className="text-[11px] text-center text-[#94A3B8] mt-3 font-medium animate-in fade-in slide-in-from-top-1 duration-300">
                This is a directed consultation. Please continue this conversation in the <span className="text-[#02022C] font-bold">Studio</span> for campaign-specific adjustments.
              </p>
            )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
