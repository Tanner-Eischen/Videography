import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../contexts/AuthContext";

interface SummaryStepProps {
  formData: any;
  onCreateNewQuote: () => void;
}

type QuotePackage = "Standard" | "Best Deal" | "Lifejacket";

export const SummaryStep: React.FC<SummaryStepProps> = ({
  formData,
  onCreateNewQuote,
}) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<QuotePackage>("Standard");
  const [isSaving, setIsSaving] = useState(false);
  const [quoteSaved, setQuoteSaved] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (!quoteSaved && profile?.id) {
      saveQuote();
    }
  }, [profile?.id]);

  const saveQuote = async () => {
    if (isSaving || quoteSaved || !profile?.id) return;

    setIsSaving(true);
    try {
      const startDate = formData.projectStartDate.year && formData.projectStartDate.month && formData.projectStartDate.day
        ? `${formData.projectStartDate.year}-${formData.projectStartDate.month.padStart(2, '0')}-${formData.projectStartDate.day.padStart(2, '0')}`
        : null;

      const endDate = formData.projectEndDate.year && formData.projectEndDate.month && formData.projectEndDate.day
        ? `${formData.projectEndDate.year}-${formData.projectEndDate.month.padStart(2, '0')}-${formData.projectEndDate.day.padStart(2, '0')}`
        : null;

      const { data, error } = await supabase
        .from('quotes')
        .insert({
          client_id: profile.id,
          client_name: formData.fullName,
          client_email: formData.contactEmail,
          client_phone: formData.clientPhoneNumber,
          project_start_date: startDate,
          project_end_date: endDate,
          status: 'draft',
          form_data: formData
        })
        .select()
        .single();

      if (error) throw error;

      setQuoteSaved(true);
    } catch (error) {
      console.error('Error saving quote:', error);
      alert('Failed to save quote. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmail = () => {
    alert("Email functionality will be implemented");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCreateNewQuoteClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmCreateNewQuote = () => {
    setShowConfirmModal(false);
    onCreateNewQuote();
    navigate('/dashboard');
  };

  return (
    <>
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 px-4 md:px-16 py-6 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-[32px]">
            Quote Summary
          </h2>
        </div>

        <div className="bg-[#d4e8ea] rounded-xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setSelectedPackage("Standard")}
              className={`flex-1 h-14 rounded-lg [font-family:'Lexend',Helvetica] font-bold text-lg transition-all ${
                selectedPackage === "Standard"
                  ? "bg-[#023c97] text-white"
                  : "bg-[#a0b4b8] text-white hover:bg-[#90a4a8]"
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => setSelectedPackage("Best Deal")}
              className={`flex-1 h-14 rounded-lg [font-family:'Lexend',Helvetica] font-bold text-lg transition-all ${
                selectedPackage === "Best Deal"
                  ? "bg-[#023c97] text-white"
                  : "bg-[#a0b4b8] text-white hover:bg-[#90a4a8]"
              }`}
            >
              Best Deal
            </button>
            <button
              onClick={() => setSelectedPackage("Lifejacket")}
              className={`flex-1 h-14 rounded-lg [font-family:'Lexend',Helvetica] font-bold text-lg transition-all ${
                selectedPackage === "Lifejacket"
                  ? "bg-[#023c97] text-white"
                  : "bg-[#a0b4b8] text-white hover:bg-[#90a4a8]"
              }`}
            >
              Lifejacket
            </button>
          </div>

          <div className="bg-white rounded-xl p-8 min-h-[400px] flex flex-col">
            <div className="mb-8">
              <div className="inline-block bg-[#023c97] text-white px-6 py-2 rounded [font-family:'Lexend',Helvetica] font-bold text-lg mb-8">
                {selectedPackage} Quote
              </div>
            </div>

            <div className="flex items-center justify-center flex-1">
              <div className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-[80px]">
                $$$
              </div>
            </div>

            <div className="mt-8 space-y-4 text-gray-600 [font-family:'Lexend',Helvetica]">
              <div className="flex justify-between">
                <span>Client Name:</span>
                <span className="font-semibold">{formData.fullName || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span>Contact Email:</span>
                <span className="font-semibold">{formData.contactEmail || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span>Number of Deliverables:</span>
                <span className="font-semibold">{formData.numberOfDeliverables}</span>
              </div>
              <div className="flex justify-between">
                <span>Filming Days:</span>
                <span className="font-semibold">{formData.filmingDays}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span className="font-semibold">{formData.discount}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 px-4 md:px-16 py-6 md:py-8 border-t border-gray-200">
        <Button
          onClick={handleEmail}
          className="h-[50px] px-8 rounded-lg bg-[#007c89] hover:bg-[#006670] [font-family:'Lexend',Helvetica] font-bold text-white text-xl"
        >
          Email
        </Button>
        <Button
          onClick={handlePrint}
          className="h-[50px] px-8 rounded-lg bg-[#007c89] hover:bg-[#006670] [font-family:'Lexend',Helvetica] font-bold text-white text-xl"
        >
          Print
        </Button>
        <Button
          onClick={handleCreateNewQuoteClick}
          className="h-[50px] px-8 rounded-lg bg-[#023c97] hover:bg-[#022d70] [font-family:'Lexend',Helvetica] font-bold text-white text-xl"
        >
          Create New Quote
        </Button>
      </div>
    </div>

    <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="[font-family:'Lexend',Helvetica] font-bold text-xl">
            Create New Quote?
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="[font-family:'Lexend',Helvetica] text-gray-700">
            Are you sure you want to create a new quote? This will take you back to the dashboard.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => setShowConfirmModal(false)}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 [font-family:'Lexend',Helvetica] font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmCreateNewQuote}
            className="bg-[#023c97] hover:bg-[#022d70] text-white [font-family:'Lexend',Helvetica] font-semibold"
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};
