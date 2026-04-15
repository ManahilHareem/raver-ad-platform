import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { VoiceSelector, VOICE_OPTIONS } from "@/components/agents/audio-lead/VoiceSelector";
import { normalizeAssetUrl } from "@/lib/utils";
import { toast } from "react-toastify";

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
    voice_id?: string | null;          // Added: voice_id from campaign
    campaign_status?: string | null;
    hitl?: any;
  } | null;
  showHistory?: boolean;
  onRefresh?: () => void;
  onSelectVoice?: (voice: string) => void;
  onSwitchCampaign?: () => void;
}


export default function CampaignPreviewModal({
  isOpen,
  onClose,
  campaignData,
  showHistory = false,
  onRefresh,
  onSelectVoice,
  onSwitchCampaign,
}: CampaignPreviewModalProps) {
  const { user } = useUser();
  const [localHistory, setLocalHistory] = useState<{ role: string; content: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [localStatus, setLocalStatus] = useState<string | undefined>(campaignData?.status);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  // Editing states
  const [isEditingScript, setIsEditingScript] = useState(false);
  const [editedScript, setEditedScript] = useState(campaignData?.script || "");
  const [selectedVoice, setSelectedVoice] = useState<string>(campaignData?.voice_id?.toLowerCase() || "adam");
  const [musicPrompt, setMusicPrompt] = useState("");
  const [isApplyingChanges, setIsApplyingChanges] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isProcessingStep, setIsProcessingStep] = useState(false);
  const [stepNotes, setStepNotes] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [localHitl, setLocalHitl] = useState<any>(campaignData?.hitl);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get the name of the selected voice for display
  const selectedVoiceName =
    VOICE_OPTIONS.find((v) => v.id.toLowerCase() === selectedVoice?.toLowerCase())?.name || selectedVoice || "Neural Selection";

  // Initialize and sync history & script
  useEffect(() => {
    if (isOpen && campaignData) {
      if (campaignData.history) {
        setLocalHistory(campaignData.history);
      }
      setLocalStatus(campaignData.status);
      setEditedScript(campaignData.script || "");

      // Initialize selected voice from campaign data, if available
      if (campaignData.voice_id) {
        setSelectedVoice(campaignData.voice_id.toLowerCase());
      }

      setLocalHitl(campaignData.hitl);

      // Proactively fetch latest DB state for hitl/approval info
      if (campaignData.session_id) {
        fetchDbUpdate();
      }
    }
  }, [isOpen, campaignData]);

  const fetchDbUpdate = async () => {
    if (!campaignData?.session_id) return;
    setIsRefreshing(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await apiFetch(`${API_BASE}/ai/director/session/${campaignData.session_id}/db-update`);
      if (res.ok) {
        const resData = await res.json();
        const data = resData.data;
        if (data) {
          setLocalHitl(data);
          // Sync newer state if available in DB
          if (data.status) setLocalStatus(data.status);
          if (data.history) setLocalHistory(data.history);
          if (data.script) setEditedScript(data.script);
        }
      }
    } catch (e) {
      console.warn("Manual db-update fetch failed:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-select asset if only one is available
  useEffect(() => {
    const candidates = localHitl?.candidates || localHitl?.image_urls || [];
    if (candidates.length === 1 && !selectedAssetId) {
      const firstId = candidates[0]?.id || "0";
      setSelectedAssetId(firstId);
    }
  }, [localHitl, selectedAssetId]);

  const handleApplyChanges = async () => {
    if (!campaignData?.session_id && !campaignData?.campaign_id) return;

    setIsApplyingChanges(true);
    const toastId = toast.info("🚀 Sending regeneration request to AI Director...", {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    });

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // Build the change request message
      let changeMessage = "I need you to regenerate this campaign with the following changes:\n\n";

      if (editedScript && editedScript !== campaignData.script) {
        changeMessage += `Change the script to: "${editedScript}"\n\n`;
      }

      if (selectedVoice) {
        changeMessage += `Use voice: ${selectedVoice}\n\n`;
      }

      if (musicPrompt) {
        changeMessage += `Change the background music to: ${musicPrompt}\n\n`;
      }

      changeMessage += "Please apply these changes and regenerate the video now.";

      toast.update(toastId, {
        render: "⏳ AI Director is processing your changes...",
        type: "info",
      });

      // Send message to Director AI to handle regeneration
      const response = await apiFetch(`${API_BASE}/ai/director/regenerate-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { "Authorization": `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({
          session_id: campaignData.campaign_id,
          campaign_id: campaignData.campaign_id,
          message: changeMessage + `voice of the script ${selectedVoice} and background music style ${musicPrompt}`,
          tag: "director"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to apply changes");
      }

      toast.update(toastId, {
        render: "✅ Regeneration started! Pipeline is now running.",
        type: "success",
        autoClose: 3000,
      });

      setLocalStatus("in_production");
      setIsEditingScript(false);

      // Give the user time to see the success toast, then close and reload
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (onRefresh) onRefresh();
      onClose();
      window.location.reload();
    } catch (error: any) {
      console.error("Apply changes error:", error);
      toast.update(toastId, {
        render: `❌ ${error.message || "Failed to apply changes. Please try again."}`,
        type: "error",
        autoClose: 5000,
      });
    } finally {
      setIsApplyingChanges(false);
    }
  };

  const handleCopyUrl = (url: string, label: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    toast.success(`${label} link copied to clipboard`);
  };

  const handleApprove = async () => {
    if (!campaignData?.session_id) {
      toast.error("No session ID found to approve.");
      return;
    }

    setIsApproving(true);
    const toastId = toast.loading("Finalizing campaign authorization...");

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const token = getToken();

      const response = await fetch(`${API_BASE}/ai/director/session/${campaignData.session_id}/approve`, {
        method: 'PATCH',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to approve campaign: ${response.statusText}`);
      }

      toast.update(toastId, {
        render: "✓ Campaign successfully approved and finalized!",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });

      setLocalStatus("approved");
      if (onRefresh) onRefresh();
    } catch (error: any) {
      console.error("Approval error:", error);
      toast.update(toastId, {
        render: `Error: ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleStepAction = async (action: "approve" | "improve" | "reject") => {
    const sId = campaignData?.session_id || campaignData?.campaign_id;
    if (!sId) {
      toast.error("No session identifier found.");
      return;
    }

    const currentStatus = localStatus?.toLowerCase() || "";
    const stepName = currentStatus.startsWith("awaiting_approval_")
      ? currentStatus.replace("awaiting_approval_", "")
      : "render"; // Fallback to render if status is ambiguous

    setIsProcessingStep(true);
    const toastId = toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)}ing ${stepName.replace("_", " ")}...`);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const token = getToken();

      // Ensure we have correct step name for the API if it's rendered slightly differently in status
      // Mapping common statuses back to API expected step names if needed

      const bodyData: any = {
        step_name: stepName,
        action: action,
        notes: stepNotes || (action === "approve" ? "Looks good" : "Requires changes")
      };

      if (selectedAssetId) {
        bodyData.selected_asset_id = selectedAssetId;
      }

      const response = await fetch(`${API_BASE}/ai/director/session/${sId}/approve-step`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} step: ${response.statusText}`);
      }

      toast.update(toastId, {
        render: `Successfully ${action}d ${stepName.replace("_", " ")}!`,
        type: "success",
        isLoading: false,
        autoClose: 3000
      });

      setStepNotes("");
      setSelectedAssetId(null);

      if (onRefresh) onRefresh();
      // Status will be updated by polling in parent
    } catch (error: any) {
      console.error(`Step ${action} error:`, error);
      toast.update(toastId, {
        render: `Error: ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
    } finally {
      setIsProcessingStep(false);
    }
  };

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
    setLocalHistory((prev) => [...prev, userMsg]);
    setInputText("");
    setIsGenerating(true);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await apiFetch(`${API_BASE}/ai/director/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({
          session_id: campaignData.session_id,
          message: userMsg.content,
          tag: "director",
        }),
      });

      if (!response.ok) throw new Error("AI Director Communication Failed");
      const data = await response.json();

      const aiResponseContent = data?.data?.response || data?.response || data?.message || "I've updated the campaign details.";
      const aiMsg = { role: "assistant", content: aiResponseContent };

      setLocalHistory((prev) => [...prev, aiMsg]);

      // Check for Launch trigger
      if (data?.data?.campaign_status === "queued" || data?.data?.campaign_status === "in_production") {
        setLocalStatus(data.data.campaign_status);
      }
    } catch (err) {
      console.error("Preview Chat Error:", err);
      setLocalHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error updating the campaign. Please try again.",
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen || !campaignData) return null;
  const isLaunched = ["in_production", "queued", "In Production", "Ready", "completed", "delivered", "ready", "approved"].includes(
    localStatus || ""
  );
  const isApproved = (localStatus?.toLowerCase() === "approved" || localStatus?.toLowerCase() === "delivered");
  const isDraft = localStatus === "ready_for_human_review";
  const isAwaitingApproval = localStatus?.toLowerCase().startsWith("awaiting_approval_");
  const canChat = (!isLaunched || isDraft) && !isApproved; // Allow chat during review to request revisions

  return (
    <div className="fixed inset-y-0 right-0 left-0 lg:left-[280px] z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

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
                  <span className="text-[9px] text-[#64748B] font-bold uppercase tracking-widest">
                    SID: {campaignData.session_id}
                  </span>
                  <span className="text-[9px] text-[#64748B] font-bold uppercase tracking-widest">
                    CID: {campaignData.campaign_id}
                  </span>
                </div>
                {localStatus && (
                  <div className="flex items-center gap-1.5">
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        !isLaunched ? "bg-amber-500 animate-pulse" : (isApproved ? "bg-emerald-500" : "bg-green-500")
                      )}
                    />
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      isApproved ? "text-emerald-600" : "text-[#2E3A59]"
                    )}>
                      {isApproved ? "Approved" : (!isLaunched ? (isDraft ? "In Review" : "Consultation") : localStatus === "ready" ? "Ready" : "Processing")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F1F5F9] rounded-full transition-colors group"
            >
              <Icons.Plus className="w-5 h-5 rotate-45 text-[#94A3B8] group-hover:text-[#121212]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
          {/* User Vision / Prompt section */}
          {(campaignData.prompt || campaignData.message) && (
            <div className="space-y-4">
              <h3 className="text-[12px] font-black text-[#02022C] uppercase tracking-[0.2em] opacity-40">
                Initial Campaign Concept
              </h3>
              <div className="bg-[#F8FAFC] text-[#4F4F4F] italic border border-[#F1F5F9] rounded-[32px] p-8 shadow-sm">
                <MarkdownRenderer content={`"${campaignData.message || campaignData.prompt}"`} isUser={false} />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[12px] font-black text-[#02022C] uppercase tracking-[0.2em]">Visual & Video</h3>
              {campaignData.video_url && (
                <button
                  onClick={() => handleCopyUrl(campaignData.video_url!, "Video")}
                  className="text-[11px] font-bold text-[#64748B] hover:text-[#02022C] transition-colors flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100"
                  title="Copy Video URL"
                >
                  <Icons.Copy className="w-3.5 h-3.5" />
                  Copy Link
                </button>
              )}
            </div>
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 border border-[#F1F5F9] shadow-inner group">
              {campaignData.video_url ? (
                <div className="relative w-full h-full">
                  {videoError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 text-white gap-3 p-8 text-center italic">
                      <Icons.AlertTriangle className="w-10 h-10 text-amber-500 animate-pulse" />
                      <div className="flex flex-col gap-1 items-center">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] not-italic">Production Stream Interrupted</p>
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest max-w-xs">The generation pipeline produced a result, but the visual stream is currently inaccessible.</p>
                      </div>
                      <button
                        onClick={() => { setVideoError(false); }}
                        className="mt-2 px-6 py-2 bg-white text-[#02022C] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                      >
                        Attempt Reconnection
                      </button>
                    </div>
                  ) : (
                    <video
                      src={campaignData.video_url}
                      controls
                      muted={isMuted}
                      className="w-full h-full object-cover"
                      onError={() => setVideoError(true)}
                    />
                  )}

                  {!videoError && (
                    <>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="absolute bottom-6 right-6 z-30 w-12 h-12 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all shadow-2xl"
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? <Icons.Mute className="w-5 h-5" /> : <Icons.Volume className="w-5 h-5" />}
                      </button>
                      {isMuted && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 animate-pulse text-white text-[10px] font-black uppercase tracking-widest">
                            Sound Muted - Click to Listen
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
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
                  <>
                    <div className="flex items-center gap-2">
                      <audio src={campaignData.voiceover_url} controls className="flex-1 h-8" />
                      <button
                        onClick={() => handleCopyUrl(campaignData.voiceover_url!, "Voiceover")}
                        className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:text-[#02022C] border border-slate-100 flex items-center justify-center transition-all"
                        title="Copy Voiceover URL"
                      >
                        <Icons.Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Icons.Mic className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">
                        Profile: {selectedVoice ? selectedVoiceName : "Neural Casting"}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-[11px] text-[#94A3B8] font-medium italic">Synchronizing neural voice track...</div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[12px] font-black text-[#02022C] uppercase tracking-[0.2em]">Background Music</h3>
              <div className="p-4 bg-white border border-[#F1F5F9] rounded-2xl shadow-sm flex flex-col gap-3">
                {campaignData.music_url ? (
                  <div className="flex items-center gap-2">
                    <audio src={campaignData.music_url} controls className="flex-1 h-8" />
                    <button
                      onClick={() => handleCopyUrl(campaignData.music_url!, "Music")}
                      className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:text-[#02022C] border border-slate-100 flex items-center justify-center transition-all"
                      title="Copy Music URL"
                    >
                      <Icons.Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-[#94A3B8] font-medium">No music track available</div>
                )}
              </div>
            </div>
          </div>

          {/* Script Content - Editable */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[12px] font-black text-[#02022C] uppercase tracking-[0.2em]">Campaign Script</h3>
              {!isApproved && <button
                onClick={() => setIsEditingScript(!isEditingScript)}
                className="text-[11px] font-bold text-[#02022C] hover:text-[#4F569B] transition-colors flex items-center gap-1"
              >
                <Icons.PenLine className="w-3.5 h-3.5" />
                {isEditingScript ? "Cancel" : "Edit Script"}
              </button>}
            </div>
            <div className="p-6 bg-[#02022C]/2 border border-[#F1F5F9] rounded-[24px] relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icons.MagicWand className="w-12 h-12 text-[#02022C]" />
              </div>
              {isEditingScript ? (
                <textarea
                  value={editedScript}
                  onChange={(e) => setEditedScript(e.target.value)}
                  className="w-full min-h-[120px] text-[15px] text-[#334155] leading-[1.6] font-medium relative z-10 bg-white border border-[#E2E8F0] rounded-xl p-4 outline-none focus:border-[#02022C] resize-y"
                  placeholder="Enter your script here..."
                />
              ) : (
                <p className="text-[15px] text-[#334155] leading-[1.6] font-medium relative z-10">
                  {editedScript || campaignData.script || "Script loading..."}
                </p>
              )}
            </div>
          </div>

          {/* Voice & Music Controls */}
          {/* Voice & Music Controls */}
          {!isApproved && <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Voice Selection */}
              <div className="space-y-4">
                <h3 className="text-[12px] font-black text-[#02022C] uppercase tracking-[0.2em]">Neural Voice Casting</h3>
                <VoiceSelector
                  selectedVoice={selectedVoice}
                  onSelect={(id) => setSelectedVoice(id)}
                />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 ml-1 leading-relaxed">
                  Active Selection: <span className="text-[#02022C]">{selectedVoiceName}</span>
                </p>
              </div>

              {/* Background Music Prompt */}
              <div className="space-y-4">
                <h3 className="text-[12px] font-black text-[#02022C] uppercase tracking-[0.2em]">Background Music Style</h3>
                <input
                  type="text"
                  value={musicPrompt}
                  onChange={(e) => setMusicPrompt(e.target.value)}
                  placeholder="e.g., Upbeat electronic music, energetic"
                  className="w-full p-4 bg-white border border-[#E2E8F0] rounded-2xl text-[13px] font-medium text-[#334155] placeholder:text-[#94A3B8] outline-none focus:border-[#02022C] transition-colors"
                />
              </div>
            </div>

            {/* Apply Changes Button — always shown since voice must be selected */}
            {(isEditingScript || selectedVoice || musicPrompt) && (
              <div className="flex justify-end">
                <button
                  onClick={handleApplyChanges}
                  disabled={isApplyingChanges}
                  className="px-8 py-4 bg-linear-to-r from-[#01012A] to-[#2E2C66] text-white rounded-xl font-bold text-[13px] uppercase tracking-wider hover:shadow-xl hover:-translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isApplyingChanges ? (
                    <>
                      <Icons.Loader className="w-4 h-4 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <Icons.CheckCircle className="w-4 h-4" />
                      Apply Changes & Regenerate
                    </>
                  )}
                </button>
              </div>
            )}
          </>
          }

          {/* HITL Approval Section */}
          {isAwaitingApproval && (
            <div className="p-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[32px] space-y-6 shadow-sm border-t-4 border-t-[#02022C] animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#02022C] rounded-xl flex items-center justify-center">
                    <Icons.MagicWand className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-[14px] font-black text-[#121212] uppercase tracking-widest">AI Action Required</h3>
                    <p className="text-[11px] text-[#64748B] font-bold uppercase tracking-widest">
                      Review {localStatus?.replace("awaiting_approval_", "").replace("_", " ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Asset Candidates - Only show if current step is image generation */}
              {(localStatus?.includes("image")) && (localHitl?.candidates || localHitl?.image_urls) && (
                <div className="space-y-4">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">
                    {localStatus?.includes("image") ? "Select the best generation candidate:" : "Generated Assets:"}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {(localHitl?.candidates || localHitl?.image_urls || []).map((candidate: any, idx: number) => {
                      const assetUrl = normalizeAssetUrl(candidate.url || candidate.image_url || (typeof candidate === "string" ? candidate : null));
                      const assetId = candidate.id || idx.toString();
                      if (!assetUrl) return null;

                      return (
                        <div
                          key={assetId}
                          onClick={() => setSelectedAssetId(assetId)}
                          className={cn(
                            "relative aspect-video rounded-2xl overflow-hidden border-2 cursor-pointer transition-all group/cand shadow-sm",
                            selectedAssetId === assetId
                              ? "border-[#02022C] ring-4 ring-[#02022C]/10 shadow-lg scale-[1.02]"
                              : "border-white opacity-60 hover:opacity-90 grayscale hover:grayscale-0"
                          )}
                        >
                          <img src={assetUrl} alt={`Option ${idx + 1}`} className="w-full h-full object-cover" />
                          <div className={cn(
                            "absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all",
                            selectedAssetId === assetId ? "bg-[#02022C] text-white shadow-md" : "bg-white/40 backdrop-blur-md"
                          )}>
                            {selectedAssetId === assetId ? <Icons.CheckCircle className="w-4 h-4" /> : <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />}
                          </div>
                          <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-md rounded-md text-[9px] font-black text-white uppercase tracking-widest opacity-0 group-hover/cand:opacity-100 transition-opacity">
                            Option {idx + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Voice Generation Preview - Only show if current step is voice generation */}
              {(localStatus?.includes("voice")) && localHitl?.voiceover_url && (
                <div className="space-y-4 p-6 bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#02022C]/5 rounded-lg flex items-center justify-center">
                      <Icons.Mic className="w-4 h-4 text-[#02022C]" />
                    </div>
                    <p className="text-[11px] font-black text-[#02022C] uppercase tracking-widest">Review Voice Generation</p>
                  </div>
                  <audio src={normalizeAssetUrl(localHitl.voiceover_url)} controls className="w-full h-10" />
                </div>
              )}

              {/* Music Generation Preview - Only show if current step is music generation */}
              {(localStatus?.includes("music")) && localHitl?.music_url && (
                <div className="space-y-4 p-6 bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#02022C]/5 rounded-lg flex items-center justify-center">
                      <Icons.Music className="w-4 h-4 text-[#02022C]" />
                    </div>
                    <p className="text-[11px] font-black text-[#02022C] uppercase tracking-widest">Review Background Music</p>
                  </div>
                  <audio src={normalizeAssetUrl(localHitl.music_url)} controls className="w-full h-10" />
                </div>
              )}

              {/* Script/Text Preview - Only show if current step is text generation */}
              {localStatus?.includes("text") && localHitl?.script && (
                <div className="space-y-4 p-6 bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#02022C]/5 rounded-lg flex items-center justify-center">
                      <Icons.PenLine className="w-4 h-4 text-[#02022C]" />
                    </div>
                    <p className="text-[11px] font-black text-[#02022C] uppercase tracking-widest">Review Generated Script</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl text-[13px] font-medium text-slate-700 leading-relaxed border border-slate-100">
                    {typeof localHitl.script === 'string' ? localHitl.script : localHitl.script?.script || "No script content available."}
                  </div>
                </div>
              )}

              {/* Video Preview - Only show if current step is rendering */}
              {localStatus?.includes("render") && (localHitl?.video_url || localHitl?.video_urls) && (
                <div className="space-y-4 p-6 bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#02022C]/5 rounded-lg flex items-center justify-center">
                      <Icons.Play className="w-4 h-4 text-[#02022C]" />
                    </div>
                    <p className="text-[11px] font-black text-[#02022C] uppercase tracking-widest">Review Rendered Video</p>
                  </div>
                  <div className="rounded-2xl overflow-hidden bg-black border border-slate-100 shadow-xl">
                    <video
                      src={normalizeAssetUrl(localHitl?.video_url || (Array.isArray(localHitl?.video_urls) ? localHitl.video_urls[0] : null))}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Feedback Input */}
              <div className="space-y-3">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Feedback / Instructions (Optional):</p>
                <textarea
                  value={stepNotes}
                  onChange={(e) => setStepNotes(e.target.value)}
                  placeholder="e.g., Make it more vibrant, change the lighting, looks perfect..."
                  className="w-full min-h-[100px] p-5 bg-white border border-[#E2E8F0] rounded-[24px] text-[14px] font-medium text-[#121212] outline-none focus:border-[#02022C] transition-all placeholder:text-slate-300 resize-none shadow-inner"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleStepAction("approve")}
                  disabled={isProcessingStep || (localStatus?.includes("image") && !selectedAssetId)}
                  className="flex-1 h-14 bg-[#02022C] text-white rounded-2xl flex items-center justify-center gap-2 font-black text-[12px] uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-lg shadow-[#02022C]/20"
                >
                  <Icons.CheckCircle className="w-4 h-4" /> Approve Step
                </button>
                <button
                  onClick={() => handleStepAction("improve")}
                  disabled={isProcessingStep}
                  className="flex-1 h-14 bg-white border border-[#E2E8F0] text-[#02022C] rounded-2xl flex items-center justify-center gap-2 font-black text-[12px] uppercase tracking-widest transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-50 shadow-xs"
                >
                  <Icons.MagicWand className="w-4 h-4" /> Improve
                </button>
                <button
                  onClick={() => handleStepAction("reject")}
                  disabled={isProcessingStep}
                  className="w-14 h-14 bg-red-50 border border-red-100 text-red-500 rounded-2xl flex items-center justify-center transition-all hover:bg-red-500 hover:text-white active:scale-95 disabled:opacity-50"
                  title="Reject and Stop"
                >
                  <Icons.Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
            </div>
          )}

          {/* Interactive Chat & Session History */}
          {showHistory && (
            <div className="space-y-4 pt-4 border-t border-[#F1F5F9]">
              <p className="text-[11px] font-black text-[#02022C] uppercase tracking-[0.2em] opacity-40">
                {showHistory ? "Session Audit Log" : canChat ? "Live Collaboration" : "Session Outcome"}
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
                          } catch (e) {
                            /* keep source if parse fails */
                          }
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
                            <Image
                              src={user?.avatarUrl || "/assets/7441684aa4149b2fd6d813ffefd24cdc9a178dba.jpg"}
                              alt="User"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Image src="/assets/ai-assistant-avatar.png" alt="AI" fill className="object-cover" />
                          )}
                        </div>

                        <div className={cn("flex flex-col", msg.role === "user" ? "items-end text-right" : "items-start text-left")}>
                          <div
                            className={cn(
                              "px-5 py-3.5 rounded-[24px] text-[13.5px] leading-relaxed shadow-sm transition-all",
                              msg.role === "user"
                                ? "bg-linear-to-r from-[#01012A] to-[#2E2C66] text-white rounded-tr-none shadow-[inset_0px_-5px_5px_0px_rgba(79,86,155,0.1)]"
                                : "bg-white text-[#121212] border border-slate-100 rounded-tl-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.04)]"
                            )}
                          >
                            {msg.content === "LAUNCH_CAMPAIGN_PLACEHOLDER" ? (
                              <span className="flex items-center gap-2 font-black italic text-green-600">
                                🚀 Success! Campaign Launched.
                              </span>
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
                {canChat && !showHistory && (
                  <div className="p-6 bg-slate-50 border-t border-[#F1F5F9]">
                    <form
                      onSubmit={handleSendMessage}
                      className="flex items-center gap-3 bg-white border border-slate-200 rounded-[20px] p-2 shadow-sm focus-within:ring-2 focus-within:ring-[#02022C]/5 focus-within:border-[#02022C]/10 transition-all"
                    >
                      <input
                        type="text"
                        placeholder={
                          isDraft
                            ? "Request changes (e.g., 'make the voice more energetic', 'change the music')..."
                            : "Refine values or tell AI Director to 'Launch'..."
                        }
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
          <div className="flex flex-col gap-1"></div>
          <div className="flex items-center gap-3">
            {!isApproved && !isAwaitingApproval && (
              <button
                onClick={handleApprove}
                disabled={isApproving}
                className="h-11 px-8 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-px transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isApproving ? (
                  <Icons.Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Icons.CheckCircle className="w-4 h-4" />
                )}
                Approve
              </button>
            )}
            <button
              onClick={onClose}
              className="h-11 px-8 bg-[#02022C] text-white rounded-xl font-bold text-sm hover:shadow-xl hover:-translate-y-px transition-all"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>

  );
}