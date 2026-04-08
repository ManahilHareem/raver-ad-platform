import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes?: number): string {
  if (!bytes) return "Unknown Size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function enrichMessageWithCampaign(message: string, campaign?: any | null): string {
  const hasBrief = campaign?.briefDraft && Object.keys(campaign.briefDraft).length > 0;
  if (!hasBrief) return message;
  
  const context = `
### SYSTEM INSTRUCTION: USE THE FOLLOWING CAMPAIGN CONTEXT FOR YOUR RESPONSE ###
[CAMPAIGN DATA]
Title: ${campaign.title}
Objective: ${campaign.objective || "N/A"}
Target Audience: ${campaign.audience || "N/A"}
Format: ${campaign.format || "N/A"}
Duration: ${campaign.duration || "N/A"}
Style: ${campaign.visualStyles?.join(", ") || "N/A"}
Tones: ${campaign.tones?.join(", ") || "N/A"}
---
### END CONTEXT ###

[USER MESSAGE]: ${message}
`;
  return context.trim();
}
export function normalizeAssetUrl(url: string | null | undefined): string {
  if (!url) return "";
  
  // If it's already a full URL, return it
  if (url.startsWith("http")) return url;
  
  // If it starts with /api/, handle potential duplication with base URL
  if (url.startsWith("/api/")) {
    const base ="https://apiplatform.raver.ai/api";
    const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
    
    // If base already ends with /api, and url starts with /api/, remove the duplicate /api from url
    if (normalizedBase.endsWith('/api')) {
      return `${normalizedBase}${url.substring(4)}`;
    }
    
    return `${normalizedBase}${url}`;
  }
  
  return url;
}
