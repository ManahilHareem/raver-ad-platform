"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import AssetCard from "@/components/assets/AssetCard";
import AssetModal from "@/components/assets/AssetModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { RaverLoadingState } from "@/components/ui/RaverLoadingState";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";


const categories = ["All Assets", "Images", "Videos", "Graphics", "Audio"];



const statsData = [
  { label: "Total Assets", value: "9" },
  { label: "Storage Used", value: "5 MB" },
  { label: "Storage Available", value: "1 GB" }
];

export default function AssetsPage() {
  const [activeCategory, setActiveCategory] = useState("All Assets");
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [assetList, setAssetList] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [assetToDelete, setAssetToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioRef] = useState(typeof Audio !== "undefined" ? new Audio() : null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (audioRef) {
      audioRef.onended = () => setPlayingId(null);
    }
    return () => {
      audioRef?.pause();
    };
  }, [audioRef]);

  const togglePlay = (e: React.MouseEvent, asset: any) => {
    e.stopPropagation();
    if (!audioRef) return;

    if (playingId === asset.id) {
      audioRef.pause();
      setPlayingId(null);
    } else {
      audioRef.src = asset.url;
      audioRef.play();
      setPlayingId(asset.id);
    }
  };

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const response = await apiFetch(`${API_BASE}/assets`);
      if (response.ok) {
        const result = await response.json();
        setAssetList(result.data || []);
        if (result.metadata?.stats) {
          setStats(result.metadata.stats.filter((s: any) => s.label !== "Quota"));
        }
      }
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // 1. Get pre-signed URL
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const uploadRes = await apiFetch(`${API_BASE}/assets/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          name: file.name,
          contentType: file.type,
          fileSize: file.size
        })
      });

      if (!uploadRes.ok) throw new Error("Failed to get upload URL");
      
      const { uploadUrl, asset } = (await uploadRes.json()).data;

      // 2. Upload to S3
      const s3Res = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file
      });

      if (!s3Res.ok) throw new Error("Failed to upload to S3");

      // 3. Refresh list
      await fetchAssets();
      toast.success("Asset uploaded successfully!");

    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload asset. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAsset = (id: string | number) => {
    const asset = assetList.find(a => a.id === id);
    if (asset) {
      setAssetToDelete(asset);
    }
  };

  const confirmDelete = async () => {
    if (!assetToDelete) return;

    try {
      setIsDeleting(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const response = await apiFetch(`${API_BASE}/assets/${assetToDelete.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setAssetList(prev => prev.filter(a => a.id !== assetToDelete.id));
        setAssetToDelete(null);
        setSelectedAsset(null);
        toast.success("Asset deleted successfully");
      } else {
        throw new Error("Failed to delete asset");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete asset");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAssets = [...assetList].filter(asset => {
    const matchesCategory = activeCategory === "All Assets" || 
      (asset.type || 'image').toLowerCase() === activeCategory.toLowerCase().replace(/s$/, '');
    
    const matchesSearch = (asset.name || asset.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  if (isLoading) return <RaverLoadingState title="Loading Media Vault" description="Synchronizing your generated assets and library inventory..." />;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-[10px] p-[20px] mx-auto w-full">
        < div className="flex flex-col gap-[16px] p-[16px] rounded-[12px] bg-[#FFFFFF] border-[0.35px] border-[#0000001A]">
        {/* Header Section */}
        <div className="flex flex-row items-center justify-between w-full bg-[#FFFFFF]">
          <div className="flex flex-col">
            <h1 className="text-[32px] font-bold text-[#121212]">Assets Library</h1>
            <p className="text-[14px] text-[#64748B]">
              Upload and manage your brand assets, media, and creative files
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleUploadClick}
              disabled={isUploading}
              className="flex items-center gap-2 px-6 py-3 bg-[#02022C] text-white rounded-xl font-bold hover:bg-[#1A1A3F] transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isUploading ? (
                <Icons.Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Icons.Plus className="w-5 h-5" />
              )}
              {isUploading ? "Uploading..." : "Upload Asset"}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*,video/*,audio/*"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-row w-full gap-[12px] overflow-x-auto pb-2 scrollbar-hide">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#F8F8F8] min-w-[200px] flex-1 h-[98px] px-[21px] flex flex-col justify-center rounded-[8px] border border-[#F1F5F9] shadow-sm gap-2 animate-pulse">
                <div className="h-3 w-20 bg-[#E2E8F0] rounded" />
                <div className="h-8 w-24 bg-[#E2E8F0] rounded" />
              </div>
            ))
          ) : (
            <>
              {/* Total Assets Pill */}
              <div className="bg-[#F8F8F8] flex-1 h-[98px] px-[21px] flex flex-col justify-center rounded-[8px] border border-[#F1F5F9] shadow-sm gap-2">
                <span className="text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Total Assets</span>
                <span className="text-[24px] font-bold text-[#02022C]">{assetList.length}</span>
              </div>
              
              {/* Storage Used Pill with Progress Bar */}
              <div className="bg-[#F8F8F8] flex-1 h-[98px] px-[21px] flex flex-col justify-center rounded-[8px] border border-[#F1F5F9] shadow-sm gap-2 overflow-hidden relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Storage Used</span>
                  <span className="text-[10px] font-black text-indigo-500">
                    {((assetList.reduce((acc, curr) => acc + (curr.fileSize || 0), 0) / (1024 * 1024 * 1024)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[24px] font-bold text-[#02022C]">
                    {(assetList.reduce((acc, curr) => acc + (curr.fileSize || 0), 0) / (1024 * 1024)).toFixed(2)}
                  </span>
                  <span className="text-[12px] font-bold text-slate-300">/ 1024 MB</span>
                </div>
                {/* Realtime Bar */}
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-slate-200">
                  <div 
                    className="h-full bg-linear-to-r from-indigo-500 to-[#01012A] transition-all duration-700"
                    style={{ width: `${Math.min((assetList.reduce((acc, curr) => acc + (curr.fileSize || 0), 0) / (1024 * 1024 * 1024)) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Remaining Storage Pill */}
              <div className="bg-[#F8F8F8] flex-1 h-[98px] px-[21px] flex flex-col justify-center rounded-[8px] border border-[#F1F5F9] shadow-sm gap-2">
                <span className="text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Storage Remaining</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-[24px] font-bold text-[#02022C]">
                    {(1024 - (assetList.reduce((acc, curr) => acc + (curr.fileSize || 0), 0) / (1024 * 1024))).toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase">MB</span>
                </div>
              </div>
            </>
          )}
        </div>
</div>
        {/* Content Section */}
        <div className="flex flex-col gap-[24px] bg-[#FFFFFF] p-[24px] rounded-[12px] border-[0.35px] border-[#0000001A] flex-1 min-h-[600px]">
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 h-[48px]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-[16px] py-[12px] rounded-full text-[14px] font-bold transition-all duration-200",
                  activeCategory === cat 
                    ? "bg-[#02022C] text-white shadow-[inset_0px_-5px_5px_0px_#4F569B]" 
                    : "bg-[#F1F5F9] text-[#121212] hover:bg-[linear-gradient(90deg,#01012A_0%,#2E2C66_100%)] hover:text-white hover:shadow-[inset_0px_-5px_5px_0px_#4F569B]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry Grid Implementation */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-3/4 bg-[#F8F8F8] rounded-[16px] animate-pulse flex flex-col justify-end p-6 gap-3">
                  <div className="h-6 w-3/4 bg-[#E2E8F0] rounded" />
                  <div className="flex gap-4">
                    <div className="h-4 w-1/4 bg-[#E2E8F0] rounded" />
                    <div className="h-4 w-1/4 bg-[#E2E8F0] rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
              {filteredAssets.map((asset, index) => (
                <AssetCard
                  key={asset.id}
                  title={asset.name || asset.title || "Untitled"}
                  imagePath={asset.url || asset.imagePath}
                  time={asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : (asset.time || "Recently")}
                  members={asset.members || 1}
                  fileSize={asset.fileSize}
                  type={(asset.type || 'image') as any}
                  aspectRatio="square"
                  hasVolume={asset.hasVolume}
                  isSelected={selectedAsset?.id === asset.id}
                  isPlaying={playingId === asset.id}
                  onPlayToggle={(e) => togglePlay(e, asset)}
                  onClick={() => setSelectedAsset(asset)}
                  className="break-inside-avoid"
                />
              ))}
            </div>
          )}

          {!isLoading && filteredAssets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
              <div className="p-4 bg-gray-100 rounded-full">
                <Icons.TemplatesLibrary className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-[16px] font-medium text-gray-500">No assets found in this category</p>
            </div>
          )}
        </div>
      </div>

      <AssetModal 
        asset={selectedAsset}
        isOpen={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onDelete={handleDeleteAsset}
      />

      <ConfirmationModal
        isOpen={!!assetToDelete}
        onClose={() => setAssetToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Asset"
        message={`Are you sure you want to delete "${assetToDelete?.name || assetToDelete?.title || 'this asset'}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}
