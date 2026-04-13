"use client";

import React from "react";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";

const campaigns = [
  {
    name: "Summer Balayage",
    image: "/assets/Template images /e014f16d6ac266d999b6cfaa999eceec057a361d.jpg",
    views: "2,400",
    engagement: "8.2%",
    conversions: "24",
    revenue: "$1,240",
    trend: "up"
  },
  {
    name: "Holiday Promo",
    image: "/assets/Template images /35282b8da06ec3e8e994540eff7f2fdbc623a01f.jpg",
    views: "1,800",
    engagement: "8.8%",
    conversions: "18",
    revenue: "$980",
    trend: "up"
  },
  {
    name: "Spring Trends",
    image: "/assets/Template images /71e298c05e8d785491ebb24678f8c88e1b7194cd.jpg",
    views: "3,100",
    engagement: "7.5%",
    conversions: "31",
    revenue: "$1,300",
    trend: "up"
  },
  {
    name: "Nail Collection",
    image: "/assets/Template images /40156466b18f4c31e97beb972b4b9008524c7b98.jpg",
    views: "1,600",
    engagement: "9.3%",
    conversions: "16",
    revenue: "$450",
    trend: "up"
  },
  {
    name: "Bridal Package",
    image: "/assets/Template images /76aa3198e62eb617bb9f0d5cafa17ab8b1b1f2e2.jpg",
    views: "2,200",
    engagement: "8.2%",
    conversions: "22",
    revenue: "$4,300",
    trend: "up"
  },
  {
    name: "Glossy Mockups",
    image: "/assets/Template images /4b7bdcb179e32b9af114fd0170adf50c53a4b060.jpg",
    views: "2,100",
    engagement: "7.1%",
    conversions: "19",
    revenue: "$1,100",
    trend: "up"
  },
  {
    name: "Desert Shoot",
    image: "/assets/Template images /1f26e30e7625c0d9542da3aa237eb1766fd402e0.jpg",
    views: "1,950",
    engagement: "6.8%",
    conversions: "14",
    revenue: "$850",
    trend: "down"
  }
];

interface Campaign {
  id?: string;
  name: string;
  image?: string;
  status?: string;
  budget?: number;
  platforms?: string[];
  createdAt?: string;

  // Fallback backwards compatibility keys for dummy data
  views?: string | number;
  engagement?: string;
  conversions?: string | number;
  revenue?: string | number;
}

export default function CampaignPerformanceTable({ data }: { data?: Campaign[] }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;
  
  // Transform API data or fallback to default dummy data but conform to AI metrics
  const campaignsList = data && data.length > 0 ? data.map(c => ({
    name: c.name,
    image: c.image || "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2669&auto=format&fit=crop",
    status: c.status ? c.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Draft',
    platform: (c.platforms && c.platforms.length > 0) ? c.platforms[0].charAt(0).toUpperCase() + c.platforms[0].slice(1) : 'Omnichannel',
    budget: c.budget && c.budget > 0 ? `$${c.budget.toLocaleString()}` : 'Flexible',
    createdDate: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) : 'Recent'
  })) : campaigns.map(c => ({
    name: c.name,
    image: c.image,
    status: 'In Production',
    platform: 'Omnichannel',
    budget: '$1,200',
    createdDate: 'Recently'
  }));

  const totalPages = Math.ceil(campaignsList.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCampaigns = campaignsList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full overflow-hidden rounded-t-[12px] border-x border-t border-[#F1F5F9]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F8F8F8] border-b border-[#F1F5F9]">
              <th className="text-left py-4 px-6 text-[12px] font-bold text-[#4F4F4F] uppercase tracking-wider">Campaign Name</th>
              <th className="text-left py-4 px-6 text-[12px] font-bold text-[#4F4F4F] uppercase tracking-wider">Status</th>
              <th className="text-left py-4 px-6 text-[12px] font-bold text-[#4F4F4F] uppercase tracking-wider">Target Network</th>
              <th className="text-right py-4 px-6 text-[12px] font-bold text-[#4F4F4F] uppercase tracking-wider">Production Budget</th>
              <th className="text-right py-4 px-6 text-[12px] font-bold text-[#4F4F4F] uppercase tracking-wider">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] bg-white">
            {paginatedCampaigns.map((campaign, i) => (
              <tr key={i} className="hover:bg-[#F8FAFC] transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="relative w-[32px] h-[32px] rounded-[8px] overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={campaign.image}
                        alt={campaign.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[14px] font-medium text-[#121212]">{campaign.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-left">
                  <span className="inline-flex items-center justify-center px-[8px] py-[4px] rounded-[4px] bg-[#EEFDF3] text-[12px] font-bold text-[#22C55E]">
                    {campaign.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-left text-[14px] font-bold text-[#121212]">{campaign.platform}</td>
                <td className="py-4 px-6 text-right text-[14px] font-bold text-[#121212]">{campaign.budget}</td>
                <td className="py-4 px-6 text-right text-[14px] font-bold text-[#64748B]">{campaign.createdDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end bg-[#F8F8F8] p-[12px] rounded-b-[12px] border-x border-b border-[#F1F5F9]">
        <div className="flex items-center p-1 bg-white border border-[#F1F5F9] rounded-[8px] shadow-sm">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Icons.ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-[#F1F5F9]" />
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Icons.ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
