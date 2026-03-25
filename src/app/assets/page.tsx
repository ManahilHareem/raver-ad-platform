"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import AssetCard from "@/components/assets/AssetCard";
import AssetModal from "@/components/assets/AssetModal";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { apiFetch } from "@/lib/api";


const categories = ["All Assets", "Images", "Videos", "Graphics", "Audio"];

const assets = [
  {
    id: 1,
    title: "Summer-Hair-Color-1.jpg",
    imagePath: "/assets/Template images /e014f16d6ac266d999b6cfaa999eceec057a361d.jpg",
    time: "2 hours ago",
    members: 3,
    type: "image",
    aspectRatio: "portrait"
  },
  {
    id: 2,
    title: "Product-Cosmetics-Display",
    imagePath: "/assets/Template images /35282b8da06ec3e8e994540eff7f2fdbc623a01f.jpg",
    time: "5 hours ago",
    members: 12,
    type: "image",
    aspectRatio: "landscape"
  },
  {
    id: 3,
    title: "Makeup-Tutorial-Vertical",
    imagePath: "/assets/Template images /71e298c05e8d785491ebb24678f8c88e1b7194cd.jpg",
    time: "1 day ago",
    members: 8,
    type: "video",
    aspectRatio: "portrait"
  },
  {
    id: 4,
    title: "New-Campaign-Audio",
    imagePath: "",
    time: "3 days ago",
    members: 2,
    type: "audio",
    aspectRatio: "square"
  },
  {
    id: 5,
    title: "Brand-Texture-Mac",
    imagePath: "/assets/Template images /40156466b18f4c31e97beb972b4b9008524c7b98.jpg",
    time: "4 days ago",
    members: 5,
    type: "image",
    aspectRatio: "square"
  },
  {
    id: 6,
    title: "Fashion-Shoot-Model",
    imagePath: "/assets/Template images /5848f944078b1cf8c3d4dc417dae4c9e60024951.jpg",
    time: "1 week ago",
    members: 15,
    type: "video",
    aspectRatio: "portrait",
    hasVolume: true
  },
  {
    id: 7,
    title: "Glossy-Lips-CloseUp",
    imagePath: "/assets/Template images /76aa3198e62eb617bb9f0d5cafa17ab8b1b1f2e2.jpg",
    time: "2 weeks ago",
    members: 4,
    type: "graphic",
    aspectRatio: "portrait"
  },
  {
    id: 8,
    title: "Studio-Portrait-Dark",
    imagePath: "/assets/Template images /4b7bdcb179e32b9af114fd0170adf50c53a4b060.jpg",
    time: "3 weeks ago",
    members: 7,
    type: "image",
    aspectRatio: "landscape"
  },
  {
    id: 9,
    title: "Creative-Vignette-Shot",
    imagePath: "/assets/Template images /1f26e30e7625c0d9542da3aa237eb1766fd402e0.jpg",
    time: "1 month ago",
    members: 9,
    type: "video",
    aspectRatio: "portrait",
    hasVolume: true
  }
];

const statsData = [
  { label: "Total Assets", value: "9" },
  { label: "Storage Used", value: "5 MB" },
  { label: "Storage Available", value: "2.45 GB" }
];

export default function AssetsPage() {
  const [activeCategory, setActiveCategory] = useState("All Assets");
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [assetList, setAssetList] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const response = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/assets`);
      if (response.ok) {
        const result = await response.json();
        setAssetList(result.data || []);
        if (result.metadata?.stats) {
          setStats(result.metadata.stats);
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
      const uploadRes = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/assets/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type
        })
      });

      if (!uploadRes.ok) throw new Error("Failed to get upload URL");
      
      const { uploadUrl, assetId } = (await uploadRes.json()).data;

      // 2. Upload to S3
      const s3Res = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file
      });

      if (!s3Res.ok) throw new Error("Failed to upload to S3");

      // 3. Refresh list
      await fetchAssets();
      alert("Asset uploaded successfully!");

    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload asset. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAsset = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;

    try {
      const response = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/assets/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setAssetList(prev => prev.filter(a => a.id !== id));
        setSelectedAsset(null);
      } else {
        throw new Error("Failed to delete asset");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete asset");
    }
  };

  const filteredAssets = [...assets, ...assetList].filter(asset => {
    const matchesCategory = activeCategory === "All Assets" || 
      (asset.type || 'image').toLowerCase() === activeCategory.toLowerCase().replace(/s$/, '');
    
    const matchesSearch = (asset.name || asset.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

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
          <div className="flex items-center gap-4 flex-1 max-w-[400px]">
            <div className="relative w-full">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <input 
                type="text" 
                placeholder="Search assets..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[48px] pl-10 pr-4 bg-[#F8F8F8] border border-[#F1F5F9] rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#02022C]/10 transition-all"
              />
            </div>
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
          {stats.length > 0 ? (
            stats.map((stat, i) => (
              <div key={i} className="bg-[#F8F8F8] min-w-[200px] flex-1 h-[98px] px-[21px] flex flex-col justify-center rounded-[8px] border border-[#F1F5F9] shadow-sm gap-2">
                <span className="text-[12px] font-medium text-[#64748B] uppercase tracking-wider">{stat.label}</span>
                <span className="text-[24px] font-bold text-[#02022C]">{stat.value}</span>
              </div>
            ))
          ) : (
            statsData.map((stat, i) => (
              <div key={i} className="bg-[#F8F8F8] min-w-[200px] flex-1 h-[98px] px-[21px] flex flex-col justify-center rounded-[8px] border border-[#F1F5F9] shadow-sm gap-2">
                <span className="text-[12px] font-medium text-[#64748B] uppercase tracking-wider">{stat.label}</span>
                <span className="text-[24px] font-bold text-[#02022C]">{stat.value}</span>
              </div>
            ))
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
            <div className="flex items-center justify-center py-20">
              <Icons.Loader className="w-12 h-12 text-[#02022C] animate-spin" />
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-[16px] space-y-[16px]">
              {filteredAssets.map((asset, index) => (
                <AssetCard
                  key={asset.id}
                  title={asset.name || asset.title || "Untitled"}
                  imagePath={asset.url || asset.imagePath}
                  time={asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : (asset.time || "Recently")}
                  members={asset.members || 1}
                  type={(asset.type || 'image') as any}
                  aspectRatio={(asset.aspectRatio || 'square') as any}
                  hasVolume={asset.hasVolume}
                  isSelected={selectedAsset?.id === asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className="break-inside-avoid"
                />
              ))}
            </div>
          )}

          {filteredAssets.length === 0 && (
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
    </DashboardLayout>
  );
}
