"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProfileInfo from "@/components/settings/ProfileInfo";
import NotificationSettings from "@/components/settings/NotificationSettings";
import BillingSettings from "@/components/settings/BillingSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import BuyCreditsModal from "@/components/settings/BuyCreditsModal";
import AddPaymentMethodModal from "@/components/settings/AddPaymentMethodModal";
import ChangePasswordModal from "@/components/settings/ChangePasswordModal";
import EditProfileModal from "@/components/settings/EditProfileModal";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "profile", label: "Profile Information" },
  { id: "notifications", label: "Notification" },
  { id: "billing", label: "Billings" },
  { id: "security", label: "Security" },
];

import { apiFetch } from "@/lib/api";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isBuyCreditsOpen, setIsBuyCreditsOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [billingRefreshKey, setBillingRefreshKey] = useState(0);
  const [editingCard, setEditingCard] = useState<any>(null);
  
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`);
      if (res.ok) {
        const result = await res.json();
        setUser(result.data);
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') return;
      console.error("Failed to fetch user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleGlobalSave = () => {
    if (activeTab === "profile") {
      setIsEditProfileOpen(true);
    } else {
      // For other tabs, we can show a toast or implement specific save logic if needed
      alert("Settings saved successfully!");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileInfo user={user} onEdit={() => setIsEditProfileOpen(true)} />;
      case "notifications":
        return <NotificationSettings user={user} onUpdate={fetchUser} />;
      case "billing":
        return <BillingSettings 
          onBuyCredits={() => setIsBuyCreditsOpen(true)} 
          onAddPayment={() => {
            setEditingCard(null);
            setIsAddPaymentOpen(true);
          }}
          onEdit={(card) => {
            setEditingCard(card);
            setIsAddPaymentOpen(true);
          }}
          key={`billing-${billingRefreshKey}`}
        />;
      case "security":
        return <SecuritySettings 
          onChangePassword={() => setIsChangePasswordOpen(true)}
        />;
      default:
        return <ProfileInfo user={user} onEdit={() => setIsEditProfileOpen(true)} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-[10px] p-[20px] mx-auto w-full">
        <div className="flex flex-col gap-[16px] p-[24px] rounded-[12px] bg-[#FFFFFF] border-[0.35px] border-[#0000001A] shadow-sm relative pb-24">

          {/* Header */}
          <div className="flex flex-col gap-1 mb-2">
            <h1 className="text-[30px] font-bold text-[#121212]">Settings</h1>
            <p className="text-[16px] font-regular text-[#4F4F4F]">
              Manage your account preferences and security settings
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-[16px] py-[10px] h-[42px] rounded-[8px] text-[14px] font-regular transition-all duration-200",
                  activeTab === tab.id
                    ? "text-white bg-[linear-gradient(90deg,#01012A_0%,#2E2C66_100%)] shadow-[inset_0px_-5px_5px_0px_#4F569B]"
                    : "bg-[#F8F8F8] text-[#121212] hover:bg-[#E2E8F0]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 animate-in fade-in duration-500">
            {renderContent()}
          </div>

        </div>
      </div>

      {/* Global Sticky Footer Actions */}
      <div className="bottom-0 left-0 right-0 p-6 backdrop-blur-md flex items-center justify-end gap-4 rounded-b-[12px]">
        <button className="px-6 py-2.5 rounded-[12px] text-[18px] font-medium text-[#121212] hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button 
          onClick={handleGlobalSave}
          className="px-8 py-2.5 bg-[#02022C] text-[#FFFFFF] rounded-[12px] text-[18px] font-medium hover:opacity-90 transition-all shadow-[inset_0px_-5px_5px_0px_#4F569B]"
        >
          Save Changes
        </button>
      </div>

      <AddPaymentMethodModal
        isOpen={isAddPaymentOpen}
        onClose={() => {
          setIsAddPaymentOpen(false);
          setEditingCard(null);
        }}
        onSuccess={() => setBillingRefreshKey(prev => prev + 1)}
        card={editingCard}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      {/* Specialty Modals */}
      <BuyCreditsModal
        isOpen={isBuyCreditsOpen}
        onClose={() => setIsBuyCreditsOpen(false)}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        user={user}
        onClose={() => setIsEditProfileOpen(false)}
        onSuccess={fetchUser}
      />
    </DashboardLayout>
  );
}
