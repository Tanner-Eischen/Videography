import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
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
          production_company: formData.productionCompanyName,
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

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 px-4 md:px-16 py-6 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-[32px]">
            Quote Summary
          </h2>
          {quoteSaved && (
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg [font-family:'Lexend',Helvetica] font-semibold">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Quote Saved
            </div>
          )}
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
          onClick={onCreateNewQuote}
          className="h-[50px] px-8 rounded-lg bg-[#023c97] hover:bg-[#022d70] [font-family:'Lexend',Helvetica] font-bold text-white text-xl"
        >
          Create New Quote
        </Button>
      </div>
    </div>
  );
};
