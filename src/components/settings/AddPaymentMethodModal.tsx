import React, { useState, useEffect } from "react";
import { Icons } from "@/components/ui/icons";

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  card?: any;
}

import { apiFetch } from "@/lib/api";

export default function AddPaymentMethodModal({ isOpen, onClose, onSuccess, card }: AddPaymentMethodModalProps) {
  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!card;

  useEffect(() => {
    if (card) {
      setFormData({
        cardholderName: card.cardholderName || card.cardHolderName || "",
        cardNumber: card.cardNumber || `•••• •••• •••• ${card.last4}`,
        expiryDate: card.expiryDate || "",
        cvv: "***" // CVV is usually not returned or editable as plaintext
      });
    } else {
      setFormData({
        cardholderName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: ""
      });
    }
  }, [card, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = card 
        ? `${process.env.NEXT_PUBLIC_API_URL}/billing/payment-methods/${card.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/billing/payment-methods`;
      
      const response = await apiFetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess?.();
        onClose();
      } else {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to save payment method");
      }
    } catch (err: any) {
      if (err instanceof Error && err.message === 'Unauthorized') return;
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[500px] rounded-[24px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-[#F1F5F9]">
        <div className="p-[24px] flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-[20px] font-bold text-[#121212]">
                {isEditing ? "Edit Payment Method" : "Add Payment Method"}
              </h2>
              <p className="text-[14px] font-medium text-[#4F4F4F]">
                {isEditing ? "Update your card details" : "Enter your card details"}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Icons.Plus className="w-5 h-5 rotate-45 text-[#64748B]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#121212]">Card Number</label>
              <input 
                type="text" 
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                placeholder="1234 5678 91 34 5602"
                className="w-full h-[52px] px-4 bg-[#F8F8F8] border border-[#F1F5F9] rounded-[12px] text-[15px] outline-none focus:border-[#02022C] transition-colors"
                required
                disabled={isEditing} // Often card numbers aren't editable for security, but following user request
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#121212]">Expire Date</label>
                <input 
                  type="text" 
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  placeholder="MM/YY"
                  className="w-full h-[52px] px-4 bg-[#F8F8F8] border border-[#F1F5F9] rounded-[12px] text-[15px] outline-none focus:border-[#02022C] transition-colors"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#121212]">CVV</label>
                <input 
                  type="password" 
                  value={formData.cvv}
                  onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                  placeholder="123"
                  className="w-full h-[52px] px-4 bg-[#F8F8F8] border border-[#F1F5F9] rounded-[12px] text-[15px] outline-none focus:border-[#02022C] transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-bold text-[#121212]">Cardholder Name</label>
              <input 
                type="text" 
                value={formData.cardholderName}
                onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                placeholder="Hareem Ahsen"
                className="w-full h-[52px] px-4 bg-[#F8F8F8] border border-[#F1F5F9] rounded-[12px] text-[15px] outline-none focus:border-[#02022C] transition-colors"
                required
              />
            </div>

            <div className="bg-[#EEFDF3] p-4 rounded-[12px] border-l-4 border-[#22C55E] flex items-center gap-3 mt-2">
               <Icons.Shield className="w-5 h-5 text-[#22C55E]" />
               <span className="text-[12px] font-medium text-[#166534]">Your payment information is encrypted and secure</span>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 h-[52px] rounded-[14px] text-[16px] font-bold text-[#64748B] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="flex-2 h-[52px] bg-[#02022C] text-white rounded-[14px] text-[16px] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[inset_0px_-5px_5px_0px_#4F569B]"
              >
                {isLoading ? "Saving..." : <><Icons.whiteMagicWand className="w-5 h-5 text-white" /> {isEditing ? "Update Card" : "Save Card"}</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
