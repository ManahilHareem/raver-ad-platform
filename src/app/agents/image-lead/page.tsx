"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import Image from "next/image";

import ImageLeadModal from "@/components/agents/ImageLeadModal";
import ImageViewerModal from "@/components/agents/ImageViewerModal";

interface ImageAsset {
  filename: string;
  url: string;
  label: string;
}

interface Scene {
  id: string;
  visual_prompt: string;
}

function ImageLeadContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"generate" | "enhance">("generate");
  const [sessionId, setSessionId] = useState<string>(() => 
    searchParams.get("session_id") || ""
  );
  const [vault, setVault] = useState<ImageAsset[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("System Standby");

  // Generate form state
  const [businessName, setBusinessName] = useState("");
  const [productName, setProductName] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [brandTone, setBrandTone] = useState("");
  const [mood, setMood] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [scenes, setScenes] = useState<Scene[]>(
    Array.from({ length: 7 }, (_, i) => ({ id: (i + 1).toString(), visual_prompt: "" }))
  );
  const [aspectRatio, setAspectRatio] = useState("16:9");

  // Enhance form state
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [enhancements, setEnhancements] = useState({
    brightness: 1.15,
    saturation: 1.10,
    sharpness: 1.30,
    contrast: 1.00
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"generate" | "enhance">("generate");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://apiplatform.raver.ai/api";

  const fetchSessions = async () => {
    try {
      const response = await apiFetch(`${API_BASE}/ai/image-lead/sessions`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const sessionsData = data.data;
          setSessions(sessionsData);
          
          // If no session is selected, aggregate all scenes from all sessions
          if (!sessionId) {
            const allScenes = sessionsData.flatMap((s: any) => 
              (s.metadata?.scenes || []).map((scene: any) => ({
                filename: scene.label || s.sessionId,
                url: scene.url,
                label: scene.label || "Scene Asset",
                sessionId: s.sessionId
              }))
            );
            setVault(allScenes);
          }
          return sessionsData;
        }
      }
    } catch (err) {
      console.warn("Failed to fetch sessions:", err);
    }
    return [];
  };

  // Track session in localStorage for session history
  useEffect(() => {
    fetchSessions(); // Refresh sessions list on mount
    
    if (sessionId) {
      const saved = localStorage.getItem("raver_image_lead_sessions");
      let sessionsList = saved ? JSON.parse(saved) : [];
      if (!sessionsList.includes(sessionId)) {
        sessionsList = [sessionId, ...sessionsList];
        localStorage.setItem("raver_image_lead_sessions", JSON.stringify(sessionsList));
      }
    }
  }, [sessionId]);

  const fetchVault = async () => {
    if (!sessionId) return;
    try {
      const response = await apiFetch(`${API_BASE}/ai/image-lead/vault/${sessionId}`, {
        headers: { "accept": "*/*" }
      });
      
      if (response.status === 404) {
        setVault([]);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        const vaultImages = data?.data?.images || [];
        setVault(Array.isArray(vaultImages) ? vaultImages : []);
        return vaultImages;
      }
    } catch (err) {
      console.warn("Vault sync failed:", err);
      setVault([]);
    }
    return [];
  };

  // Implement automatic polling if vault is empty
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const checkVault = async () => {
      const currentVault = await fetchVault();
      if (currentVault.length > 0) {
        clearInterval(interval);
      }
    };

    // Only start polling if we are in a valid session and vault is empty
    if (sessionId && vault.length === 0) {
       interval = setInterval(checkVault, 5000); 
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionId, vault.length === 0]);

  const handleUpdateScene = (id: string, prompt: string) => {
    setScenes(scenes.map(s => s.id === id ? { ...s, visual_prompt: prompt } : s));
  };

  const updateSessionHistory = (id: string, metadata: any) => {
    const saved = localStorage.getItem("raver_image_lead_metadata");
    let history = saved ? JSON.parse(saved) : {};
    history[id] = {
      ...metadata,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem("raver_image_lead_metadata", JSON.stringify(history));

    // Also update the ID list for the sessions page
    const savedSessions = localStorage.getItem("raver_image_lead_sessions");
    let sessionIds = savedSessions ? JSON.parse(savedSessions) : [];
    if (!sessionIds.includes(id)) {
      sessionIds = [id, ...sessionIds];
      localStorage.setItem("raver_image_lead_sessions", JSON.stringify(sessionIds));
    }
  };

  const handleGenerate = async () => {
    if (!productName.trim() || !businessName.trim()) {
      alert("Please enter both Brand Name and Product Name!");
      return;
    }
    
    // Generate a unique session for each new campaign run
    const timestamp = new Date().getTime();
    const newSessionId = `raver_campaign_${timestamp}`;
    
    const startVaultMonitoring = async (sid: string) => {
        setSessionId(sid);
        setIsModalOpen(false);
        
        // Initial quick check
        try {
            const vResponse = await apiFetch(`${API_BASE}/ai/image-lead/vault/${sid}`);
            if (vResponse.ok) {
                const vData = await vResponse.json();
                setVault(Array.isArray(vData?.data?.images) ? vData.data.images : []);
            }
        } catch (err) {
            console.warn("Initial vault check failed:", err);
        }

        // 5-second delayed check
        setTimeout(async () => {
            try {
                const delayedRes = await apiFetch(`${API_BASE}/ai/image-lead/vault/${sid}`);
                if (delayedRes.ok) {
                    const delayedData = await delayedRes.json();
                    if (delayedData?.success && Array.isArray(delayedData?.data?.images)) {
                        setVault(delayedData.data.images);
                    }
                }
            } catch (err) {
                console.warn("Delayed vault check failed:", err);
            }
        }, 5000);
    };

    setIsLoading(true);
    try {
      const activeScenes = scenes.filter(s => s.visual_prompt.trim() !== "").map(s => ({
        id: s.id,
        visual_prompt: s.visual_prompt
      }));
      
      const payload = {
        brief: { 
          "business_name": businessName,
          "product_description": productName,
          "target_audience": targetAudience,
          "brand_tone": brandTone,
          "mood": mood,
          "platform": platform,
          "base_image_url": selectedImage
        },
        scenes: activeScenes,
        aspect_ratio: aspectRatio,
        session_id: newSessionId
      };

      // Save prompt details in history immediately
      updateSessionHistory(newSessionId, payload);

      const response = await apiFetch(`${API_BASE}/ai/image-lead/generate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await startVaultMonitoring(newSessionId);
        fetchSessions(); // Refresh sessions list
      } else {
        // Even if not OK (like a 504 Gateway Timeout), still monitor since backend might be processing
        console.warn("Generation API returned non-ok response, attempting vault monitor anyway.");
        await startVaultMonitoring(newSessionId);
        fetchSessions(); // Refresh sessions list even on timeout
      }
    } catch (err) {
      console.error("Generation error (potential timeout):", err);
      // Resilience: even on fetch error/timeout, start checking the vault with the intended session ID
      await startVaultMonitoring(newSessionId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnhance = async () => {
    if (!selectedImage) return;
    setIsEnhancing(true);
    try {
      const response = await apiFetch(`${API_BASE}/ai/image-lead/enhance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          image_url: selectedImage,
          session_id: sessionId,
          ...enhancements
        })
      });

      if (response.ok) {
        setIsModalOpen(false);
        await fetchVault();
        alert("Image enhanced successfully!");
      } else {
        alert("Failed to enhance image.");
      }
    } catch (err) {
      console.error("Enhancement error:", err);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Fetch vault when session changes
  useEffect(() => {
    if (sessionId) {
      fetchVault();
    } else if (sessions.length > 0) {
      // Re-aggregate all scenes if session is cleared
      const allScenes = sessions.flatMap((s: any) => 
        (s.metadata?.scenes || []).map((scene: any) => ({
          filename: scene.label || s.sessionId,
          url: scene.url,
          label: scene.label || "Scene Asset",
          sessionId: s.sessionId
        }))
      );
      setVault(allScenes);
    }
  }, [sessionId, sessions]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 sm:gap-8 p-4 sm:p-8 mx-auto bg-white rounded-3xl">
        {/* Header */}
        <div className="flex flex-col gap-6  p-5 sm:p-8 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/agents">
                <Icons.ArrowLeft className="w-4 h-4 text-[#0A0A0A]" />
              </Link>
              <Icons.MagicWand className="w-4 h-4 text-[#0A0A0A]" />
              <div className="flex flex-col">
                 <h1 className="text-4xl font-black text-[#0A0A0A] tracking-tight lowercase">raver ai image lead</h1>
                 <div className="flex items-center gap-3">
                   <div className="relative">
                     <div className="absolute inset-0 bg-green-500 blur-sm rounded-full animate-pulse opacity-50" />
                     <div className="relative w-2 h-2 bg-green-500 rounded-full" />
                   </div>
                   <span className="text-[11px] font-black text-[#64748B] uppercase tracking-[0.3em]">Neural Engine Operational</span>
                 </div>
               </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              
              {sessionId && <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                 <span className="text-[10px] font-bold text-[#64748B] uppercase">Active Session:</span>
                 <span className="text-[10px] font-bold text-[#0A0A0A] truncate max-w-[150px]">{sessionId}</span>
              </div>}
            </div>
          </div>
        </div>

        {/* Session Selector */}
        {sessions.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {sessions
                .filter((s) => (sessionId ? s.sessionId === sessionId : true))
                .map((s) => (
                <button
                  key={s.sessionId}
                  onClick={() => {
                    setSessionId(s.sessionId);
                    if (s.metadata?.scenes) {
                      const sceneImages = s.metadata.scenes.map((scene: any) => ({
                        filename: scene.label || s.sessionId,
                        url: scene.url,
                        label: scene.label || "Scene Asset"
                      }));
                      setVault(sceneImages);
                    }
                  }}
                  onDoubleClick={() => {
                    setSessionId("");
                  }}
                  className={cn(
                    "group flex flex-col gap-2 p-4 rounded-2xl border transition-all min-w-[180px] text-left relative overflow-hidden",
                    sessionId === s.sessionId 
                      ? "bg-[#0A0A0A] text-white border-[#0A0A0A] translate-y-[-2px]" 
                      : "bg-white text-slate-600 border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <Icons.Clock className={cn("w-3.5 h-3.5", sessionId === s.sessionId ? "opacity-100" : "opacity-30")} />
                    {s.createdAt && (
                      <span className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">
                        {new Date(s.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <span className="text-[12px] font-black truncate tracking-tighter uppercase">
                    {s.tag || s.sessionId.replace("raver_campaign_", "")}
                  </span>
                  {sessionId === s.sessionId && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  )}
                </button>
              ))}

              {/* View All Sessions Button */}
              {sessionId && (
                <button 
                  onClick={() => setSessionId("")}
                  className="text-xs font-bold text-slate-500 hover:text-[#0A0A0A] underline ml-2 whitespace-nowrap transition-colors"
                >
                  View All Sessions
                </button>
              )}
            </div>
          </div>
        )}

        {/* Media Vault Section */}
        <div className="bg-white rounded-[32px] p-5 sm:p-8 border border-[#F1F5F9] shadow-sm flex flex-col gap-8 scroll-mt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50 pb-6">
            <div className="flex items-center gap-2">
              <Icons.AssetLibrary className="w-5 h-5 sm:w-6 sm:h-6 text-[#0A0A0A]" />
              <h3 className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#0A0A0A]">Session Media Vault</h3>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { setModalTab("generate"); setIsModalOpen(true); }}
                disabled={isLoading}
                className="h-14 px-10 bg-gradient-to-br from-[#0A0A0A] via-[#0A0A0A] to-[#334155] text-white rounded-[24px] font-black text-sm flex items-center gap-3 transition-all disabled:opacity-70 disabled:cursor-not-allowed border border-white/5 hover:scale-[1.02] active:scale-95 group"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <Icons.Loader className="w-5 h-5 animate-spin" />
                    <span className="uppercase tracking-widest text-[11px]">Synchronizing Matrix...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Icons.Plus className="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" />
                    <span className="uppercase tracking-widest text-[11px]">Initiate Generation</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {(!vault.length && !isLoading) ? (
            <div className="flex flex-col items-center justify-center p-10 sm:p-20 bg-[#F8FAFC] border border-dashed rounded-3xl text-center">
              <Icons.Image className="w-10 h-10 text-slate-300 mb-4" />
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                {sessions.length ? "No assets in this session" : "No sessions found. Start a new generation."}
              </h4>
              {!sessions.length && <p className="text-slate-400 text-[10px] sm:text-xs mt-1">Your creative generations will appear here.</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {vault.map((asset) => {
                const rawUrl = asset?.url || "";
                if (!rawUrl || typeof rawUrl !== "string") return null;

                const imageUrl = rawUrl.startsWith("http") 
                  ? rawUrl 
                  : `https://apiplatform.raver.ai${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;

                // Use the selected generation aspect ratio for the container, fallback to 16:9
                const ratioClassMap: Record<string, string> = {
                  "16:9": "aspect-video",
                  "9:16": "aspect-[9/16]",
                  "1:1": "aspect-square"
                };
                const currentRatioClass = ratioClassMap[aspectRatio] || "aspect-video";

                return (
                  <div 
                    key={asset.filename + asset.url} 
                    onMouseEnter={() => {
                      if (imageUrl && imageUrl.startsWith("http")) {
                        const img = new (window as any).Image();
                        img.src = imageUrl;
                      }
                    }}
                    onClick={() => { 
                      if (imageUrl && imageUrl.startsWith("http")) {
                        setSelectedImage(imageUrl); 
                        setIsPreviewOpen(true); 
                      }
                    }}
                    className={cn(
                      "group relative bg-[#0A0A0A] rounded-[24px] overflow-hidden border border-white/5 transition-all duration-300 cursor-pointer select-none",
                      currentRatioClass
                    )}
                  >
                    {imageUrl && imageUrl.startsWith("http") ? (
                      <Image 
                        src={imageUrl}
                        alt={asset.label || "Production Asset"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover group-hover:scale-[1.05] transition-transform duration-[1.5s]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                        <Icons.Loader className="w-6 h-6 animate-spin text-white/20" />
                      </div>
                    )}
                    
                    {/* Discrete Scene Tag - Only on hover */}
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                       <span className="px-3 py-1 bg-black/60 border border-white/10 rounded-lg text-[8px] font-black text-white/60 uppercase tracking-[0.2em]">
                         {asset.label || "Scene Asset"}
                       </span>
                    </div>

                    {/* High-Contrast Search Icon - Optimized for Scroll */}
                    <div className="absolute inset-0 bg-[#0A0A0A]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                       <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20 scale-90 group-hover:scale-100 transition-transform duration-200">
                          <Icons.Search className="w-5 h-5 text-white" />
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ImageLeadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeTab={modalTab}
        setActiveTab={setModalTab}
        businessName={businessName}
        setBusinessName={setBusinessName}
        productName={productName}
        setProductName={setProductName}
        targetAudience={targetAudience}
        setTargetAudience={setTargetAudience}
        brandTone={brandTone}
        setBrandTone={setBrandTone}
        mood={mood}
        setMood={setMood}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        platform={platform}
        setPlatform={setPlatform}
        scenes={scenes}
        handleUpdateScene={handleUpdateScene}
        onGenerate={handleGenerate}
        isLoading={isLoading}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        enhancements={enhancements}
        setEnhancements={setEnhancements}
        onEnhance={handleEnhance}
        isEnhancing={isEnhancing}
        statusMessage={statusMessage}
      />

      <ImageViewerModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageUrl={selectedImage}
        onEnhance={() => { setIsPreviewOpen(false); setModalTab("enhance"); setIsModalOpen(true); }}
      />
    </DashboardLayout>
  );
}

export default function ImageLeadPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
             <Icons.Loader className="w-8 h-8 animate-spin text-[#02022C]" />
             <p className="text-sm font-bold text-[#64748B]">Loading Image Lead...</p>
          </div>
        </div>
      </DashboardLayout>
    }>
      <ImageLeadContent />
    </Suspense>
  );
}