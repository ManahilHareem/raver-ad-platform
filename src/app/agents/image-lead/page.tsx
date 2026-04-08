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
import { SessionBrowser } from "@/components/agents/image-lead/SessionBrowser";
import { MediaVault } from "@/components/agents/image-lead/MediaVault";
import { RaverLoadingState } from "@/components/ui/RaverLoadingState";
import ConfirmationModal from "@/components/ui/ConfirmationModal";


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
  const [isSyncing, setIsSyncing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("System Standby");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


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
    setIsSyncing(true);
    try {
      const response = await apiFetch(`${API_BASE}/ai/image-lead/sessions`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const sessionsData = data.data;
          setSessions(sessionsData);
          
          // If no session is selected, aggregate all scenes from all sessions
          if (!sessionId) {
            const allScenes: ImageAsset[] = [];
            const seenUrls = new Set<string>();

            sessionsData.forEach((s: any) => {
              const sid = s.sessionId || s.id;
              
              // 1. Add Main Image
              if (s.mainImageUrl && !seenUrls.has(s.mainImageUrl)) {
                allScenes.push({
                  filename: `hero_${sid}`,
                  url: s.mainImageUrl,
                  label: "Hero Image",
                  sessionId: sid
                } as any);
                seenUrls.add(s.mainImageUrl);
              }

              // 2. Add Scenes
              const sessionScenes = s.scenes || s.metadata?.scene_images || s.metadata?.scenes || [];
              sessionScenes.forEach((scene: any) => {
                const url = scene.url || scene.image_url;
                if (url && !seenUrls.has(url)) {
                  allScenes.push({
                    filename: scene.label || scene.scene_id || sid,
                    url: url,
                    label: scene.label ? `Scene ${scene.label}` : "Scene Asset",
                    sessionId: sid
                  } as any);
                  seenUrls.add(url);
                }
              });
            });
            setVault(allScenes);
          }
          return sessionsData;
        }
      }
    } catch (err) {
      console.warn("Failed to fetch sessions:", err);
    } finally {
      setIsSyncing(false);
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
    if (!sessionId) return [];
    
    // Fallback logic
    const currentSession = sessions.find(s => (s.sessionId || s.id) === sessionId);
    if (!currentSession) return [];

    const fallbackScenes: ImageAsset[] = [];
    const seenUrls = new Set<string>();
    const sid = currentSession.sessionId || currentSession.id;

    if (currentSession.mainImageUrl && !seenUrls.has(currentSession.mainImageUrl)) {
      fallbackScenes.push({
        filename: `hero_${sid}`,
        url: currentSession.mainImageUrl,
        label: "Hero Image"
      } as any);
      seenUrls.add(currentSession.mainImageUrl);
    }

    const sessionScenes = currentSession?.scenes || currentSession?.metadata?.scene_images || currentSession?.metadata?.scenes || [];
    sessionScenes.forEach((scene: any) => {
      const url = scene.url || scene.image_url;
      if (url && !seenUrls.has(url)) {
        fallbackScenes.push({
          filename: scene.label || scene.scene_id || sid,
          url: url,
          label: scene.label ? `Scene ${scene.label}` : "Scene Asset"
        } as any);
        seenUrls.add(url);
      }
    });

    try {
      const response = await apiFetch(`${API_BASE}/ai/image-lead/vault/${sessionId}`, {
        headers: { "accept": "*/*" }
      });
      
      if (response.status === 404) {
        setVault(fallbackScenes);
        return fallbackScenes;
      }

      if (response.ok) {
        const data = await response.json();
        let vaultImages = data?.data?.images || [];
        
        if (!Array.isArray(vaultImages) || vaultImages.length === 0) {
           vaultImages = fallbackScenes;
        }
        setVault(vaultImages);
        return vaultImages;
      }
    } catch (err) {
      console.warn("Vault sync failed:", err);
      setVault(fallbackScenes);
      return fallbackScenes;
    }
    
    setVault(fallbackScenes);
    return fallbackScenes;
  };

  // Implement automatic polling if vault is empty
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const checkVault = async () => {
      const currentVault = await fetchVault();
      if (currentVault.length > 0) {
        await fetchSessions(); // Sync session data with vault contents
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
        await fetchSessions(); // Ensure session list has the latest metadata after enhancement
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
      const currentSession = sessions.find(s => (s.sessionId || s.id) === sessionId);
      const sessionScenes = currentSession?.scenes || currentSession?.metadata?.scene_images || currentSession?.metadata?.scenes || [];
      const hasLocalScenes = (sessionScenes && sessionScenes.length > 0) || currentSession?.mainImageUrl;
      
      if (!hasLocalScenes) {
        fetchVault();
      } else {
         const collectedAssets: ImageAsset[] = [];
         const seenUrls = new Set<string>();
         const sid = currentSession.sessionId || currentSession.id;

         if (currentSession.mainImageUrl && !seenUrls.has(currentSession.mainImageUrl)) {
          collectedAssets.push({
            filename: `hero_${sid}`,
            url: currentSession.mainImageUrl,
            label: "Hero Image",
            sessionId: sid
          } as any);
          seenUrls.add(currentSession.mainImageUrl);
         }

         sessionScenes.forEach((scene: any) => {
           const url = scene.url || scene.image_url;
           if (url && !seenUrls.has(url)) {
            collectedAssets.push({
               filename: scene.label || scene.scene_id || sid,
               url: url,
               label: scene.label ? `Scene ${scene.label}` : "Scene Asset",
               sessionId: sid
             } as any);
             seenUrls.add(url);
           }
         });
         setVault(collectedAssets);
      }
    } else if (sessions.length > 0) {
      // Re-aggregate all scenes if session is cleared
      const allScenes: ImageAsset[] = [];
      const seenUrls = new Set<string>();

      sessions.forEach((s: any) => {
        const sid = s.sessionId || s.id;
        if (s.mainImageUrl && !seenUrls.has(s.mainImageUrl)) {
          allScenes.push({
            filename: `hero_${sid}`,
            url: s.mainImageUrl,
            label: "Hero Image",
            sessionId: sid
          } as any);
          seenUrls.add(s.mainImageUrl);
        }

        const sessionScenes = s.scenes || s.metadata?.scene_images || s.metadata?.scenes || [];
        sessionScenes.forEach((scene: any) => {
          const url = scene.url || scene.image_url;
          if (url && !seenUrls.has(url)) {
            allScenes.push({
              filename: scene.label || scene.scene_id || sid,
              url: url,
              label: scene.label ? `Scene ${scene.label}` : "Scene Asset",
              sessionId: sid
            } as any);
            seenUrls.add(url);
          }
        });
      });
      setVault(allScenes);
    }
  }, [sessionId, sessions]);

  const handleDeleteSession = (sid: string) => {
    setDeleteTargetId(sid);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    
    setIsDeleting(true);
    try {
      const res = await apiFetch(`${API_BASE}/ai/image-lead/session/${deleteTargetId}`, { 
        method: 'DELETE' 
      });
      if (res.ok) {
        if (deleteTargetId === sessionId) {
          setSessionId("");
        }
        await fetchSessions();
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      console.error("Deletion failed:", err);
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  if (isSyncing && sessions.length === 0) {
    return (
      <RaverLoadingState 
        title="Synchronizing Matrix" 
        description="Fetching your creative history and preparing the neural asset vault..." 
      />
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 sm:gap-8 p-4 sm:p-8 mx-auto bg-white rounded-3xl">
        {/* Header */}
        <div className="flex flex-col gap-6  p-5 sm:p-8 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/agents" 
                className="p-2 rounded-[10px] hover:bg-slate-100 transition-all active:scale-90 group"
              >
                <Icons.ArrowLeft className="w-6 h-6 text-[#0A0A0A] group-hover:-translate-x-0.5 transition-transform" />
              </Link>
              <div className="flex flex-col">
                 <h1 className="text-[30px] font-bold text-[#121212] tracking-tight lowercase">raver ai image lead</h1>
               </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              
              {sessionId && <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-[#64748B] uppercase tracking-widest">Active dossier</span>
                    <span className="text-[10px] font-black text-[#0A0A0A] truncate max-w-[150px] lowercase">{sessionId}</span>
                 </div>
                 <div className="w-px h-6 bg-slate-200" />
                 <button 
                  onClick={() => handleDeleteSession(sessionId)}
                  className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-black uppercase text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm active:scale-95"
                 >
                   Archive
                 </button>
                 <button 
                  onClick={() => { setSessionId(""); fetchSessions(); }}
                  className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-black uppercase text-[#0A0A0A] hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-95"
                 >
                   Clear
                 </button>
              </div>}
            </div>
          </div>
        </div>


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
                className="h-14 px-10 bg-linear-to-br from-[#0A0A0A] via-[#0A0A0A] to-[#334155] text-white rounded-[24px] font-black text-sm flex items-center gap-3 transition-all disabled:opacity-70 disabled:cursor-not-allowed border border-white/5 hover:scale-[1.02] active:scale-95 group"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <Icons.Loader className="w-5 h-5 animate-spin" />
                    <span className="uppercase tracking-widest text-[11px]">Neural Audit...</span>
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

          <MediaVault 
            vault={vault}
            onAssetClick={(url) => {
              setSelectedImage(url);
              setIsPreviewOpen(true);
            }}
            onDelete={handleDeleteSession}
            hasSessions={sessions.length > 0}
          />
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

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Archive Synthesis"
        message="Are you sure you want to permanently archive this visual synthesis session? This action cannot be undone."
        confirmText="Archive"
        isLoading={isDeleting}
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