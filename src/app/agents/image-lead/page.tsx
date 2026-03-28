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
    searchParams.get("session_id") || ``
  );
  const [vault, setVault] = useState<ImageAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("System Standby");

  // Generate form state
  const [businessName, setBusinessName] = useState("");
  const [productName, setProductName] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [mood, setMood] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [scenes, setScenes] = useState<Scene[]>(
    Array.from({ length: 7 }, (_, i) => ({ id: (i + 1).toString(), visual_prompt: "" }))
  );
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  // Enhance form state
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [enhancements, setEnhancements] = useState({
    focus: 1.0,
    brightness: 1.0,
    contrast: 1.0
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"generate" | "enhance">("generate");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://apiplatform.raver.ai/api";

  // Track session in localStorage for session history
  useEffect(() => {
    if (sessionId) {
      const saved = localStorage.getItem("raver_image_lead_sessions");
      let sessions = saved ? JSON.parse(saved) : [];
      if (!sessions.includes(sessionId)) {
        sessions = [sessionId, ...sessions];
        localStorage.setItem("raver_image_lead_sessions", JSON.stringify(sessions));
      }
    }
  }, [sessionId]);

  const fetchVault = async () => {
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
    
    setIsLoading(true);
    try {
      const activeScenes = scenes.filter(s => s.visual_prompt.trim() !== "").map(s => ({
        id: s.id,
        visual_prompt: s.visual_prompt
      }));
      
      const payload = {
        brief: { 
          "business_name": businessName,
          "product_name": productName,
          "target_audience": targetAudience,
          "mood": mood,
          "platform": platform,
          "base_image_url": uploadedImageUrl
        },
        scenes: activeScenes,
        aspect_ratio: aspectRatio,
        session_id: newSessionId
      };

      const response = await apiFetch(`${API_BASE}/ai/image-lead/generate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Save prompt details in history
        updateSessionHistory(newSessionId, payload);
        
        // Update local session state and refresh vault
        setSessionId(newSessionId);
        setIsModalOpen(false);
        
        // Initial quick check
        const vResponse = await apiFetch(`${API_BASE}/ai/image-lead/vault/${newSessionId}`);
        if (vResponse.ok) {
          const vData = await vResponse.json();
          setVault(Array.isArray(vData?.data?.images) ? vData.data.images : []);
        }

        // 5-second delayed check as requested
        setTimeout(async () => {
          try {
            const delayedRes = await apiFetch(`${API_BASE}/ai/image-lead/vault/${newSessionId}`);
            if (delayedRes.ok) {
              const delayedData = await delayedRes.json();
              if (delayedData?.data?.images) {
                setVault(delayedData.data.images);
              }
            }
          } catch (err) {
            console.warn("Delayed vault check failed:", err);
          }
        }, 5000);
      } else {
        alert("Failed to generate images. Please check your inputs.");
      }
    } catch (err) {
      console.error("Generation error:", err);
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

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6 mx-auto bg-white rounded-[8px]">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/agents">
                <Icons.ArrowLeft className="w-4 h-4 text-[#02022C]" />
              </Link>
              <Icons.MagicWand className="w-4 h-4 text-[#02022C]" />
              <div className="flex flex-col">
                <h1 className="text-3xl font-extrabold text-[#02022C] tracking-tight lowercase">raver ai image lead</h1>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">System Live</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
             
             {sessionId && <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                <span className="text-[10px] font-bold text-[#64748B] uppercase">Active Session:</span>
                <span className="text-[10px] font-bold text-[#02022C] truncate max-w-[150px]">{sessionId}</span>
              </div>}
            </div>
          </div>
        </div>

        {/* Media Vault Section */}
        <div className="bg-white rounded-3xl p-8 border border-[#F1F5F9] shadow-sm flex flex-col gap-8 scroll-mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-6">
            <div className="flex items-center gap-2">
              <Icons.AssetLibrary className="w-6 h-6 text-[#02022C]" />
              <h3 className="font-extrabold text-2xl tracking-tight text-[#02022C]">Session Media Vault</h3>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { setModalTab("generate"); setIsModalOpen(true); }}
                disabled={isLoading}
                className="h-11 px-6 bg-[#02022C] text-white rounded-xl font-black text-sm flex items-center gap-2 hover:bg-[#0A0A35] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-[#02022C]/10"
              >
                {isLoading ? (
                  <>
                    <Icons.Loader className="w-4 h-4 animate-spin" />
                    Generating Sequence...
                  </>
                ) : (
                  <>
                    <Icons.Plus className="w-4 h-4" />
                    Create New Sequence
                  </>
                )}
              </button>
              <button onClick={fetchVault} className="p-3 hover:bg-[#F1F5F9] rounded-xl border border-slate-100 transition-all">
                <Icons.Clock className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>
          </div>

          {(!vault.length && !isLoading) ? (
            <div className="flex flex-col items-center justify-center p-20 bg-[#F8FAFC] border border-dashed rounded-3xl">
              <Icons.Image className="w-10 h-10 text-slate-300 mb-4" />
              <h4 className="font-bold text-slate-900">No assets in session</h4>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {vault.map((asset) => {
                const imageUrl = asset.url.startsWith("http") ? asset.url : `https://apiplatform.raver.ai${asset.url}`;
                return (
                  <div key={asset.filename} className="group relative bg-slate-50 rounded-2xl overflow-hidden aspect-video border border-slate-100">
                    <Image src={imageUrl} alt={asset.label} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                      <button 
                        onClick={() => { setSelectedImage(imageUrl); setModalTab("enhance"); setIsModalOpen(true); }}
                        className="w-full h-10 bg-white text-slate-900 rounded-lg font-bold text-xs"
                      >
                        Enhance Asset
                      </button>
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
        mood={mood}
        setMood={setMood}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        platform={platform}
        setPlatform={setPlatform}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
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
