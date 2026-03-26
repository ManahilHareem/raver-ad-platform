"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import DashboardLayout from "@/components/DashboardLayout";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load session from local storage if needed
  useEffect(() => {
    const savedSession = localStorage.getItem("chat_session_id");
    if (savedSession) {
      setSessionId(savedSession);
    }
  }, []);

  const handleNewChat = () => {
    setMessages([]);
    setSessionId("");
    localStorage.removeItem("chat_session_id");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*",
        },
        body: JSON.stringify({
          session_id: sessionId || "",
          message: userMessage.content,
          website_url: websiteUrl || "string", // Match the curl example
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      
      // Update session ID if returned by API
      if (data.session_id && data.session_id !== sessionId) {
        setSessionId(data.session_id);
        localStorage.setItem("chat_session_id", data.session_id);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.response || data.message || "I'm here to help!",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "Sorry, I encountered an error. Please try again or check your backend connection.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#02022C] rounded-xl flex items-center justify-center">
              <Icons.CreativeStudio className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[16px] font-bold text-[#121212]">AI Assistant</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[12px] text-slate-500 font-medium">Always Online</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleNewChat}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-[#02022C] rounded-lg text-[13px] font-bold hover:bg-slate-100 transition-all border border-slate-200"
          >
            <Icons.Plus className="w-4 h-4" /> New Chat
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar bg-[#FDFDFF]">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-30 select-none">
              <Icons.MessageCircle className="w-20 h-20 mb-4 text-[#02022C]" />
              <h3 className="text-xl font-bold text-[#121212]">How can I help you today?</h3>
              <p className="text-sm max-w-xs mt-2 font-medium">I can assist with campaign ideas, AI agents, or any questions about your brand.</p>
            </div>
          ) : (
            messages.map((m) => (
              <div 
                key={m.id} 
                className={cn(
                  "flex items-start gap-3 max-w-[85%]",
                  m.role === "user" ? "flex-row-reverse ml-auto" : "mr-auto"
                )}
              >
                {/* Avatar */}
                <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden shadow-sm border border-slate-100">
                  {m.role === "user" ? (
                    <Image 
                      src="/assets/7441684aa4149b2fd6d813ffefd24cdc9a178dba.jpg" 
                      alt="User" 
                      fill 
                      className="object-cover"
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
                    "px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm",
                    m.role === "user" 
                      ? "bg-[linear-gradient(90deg,#01012A_0%,#2E2C66_100%)] text-white rounded-tr-none shadow-[inset_0px_-5px_5px_0px_#4F569B]" 
                      : "bg-white text-[#121212] border border-slate-100 rounded-tl-none"
                  )}>
                    {m.content}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1.5 font-medium px-1 uppercase tracking-wider">
                    {m.role === "user" ? "You" : "AI Assistant"} • {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="mr-auto max-w-[80%] flex items-start gap-3">
              <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden shadow-sm border border-slate-100">
                <Image 
                  src="/assets/ai-assistant-avatar.png" 
                  alt="AI Assistant" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Setting / Website URL Bar */}
        <div className="px-6 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center gap-3">
          <Icons.ExternalLink className="w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Input Website URL (optional)..."
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[12px] text-slate-600 placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form 
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl p-2 focus-within:ring-2 focus-within:ring-[#02022C]/5 transition-all"
          >
            <input 
              type="text"
              placeholder="Ask me anything..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-transparent px-3 py-2 text-[14px] text-[#121212] outline-none placeholder:text-slate-400 font-medium"
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-10 h-10 bg-[#02022C] text-white rounded-lg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 shadow-md shadow-[#02022C]/10"
            >
              <Icons.Send className="w-5 h-5 ml-0.5" />
            </button>
          </form>
        </div>

      </div>
    </DashboardLayout>
  );
}
