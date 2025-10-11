import React, { useState } from "react";
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
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<QuotePackage>("Standard");
  const [isSaving, setIsSaving] = useState(false);
  const [quoteId, setQuoteId] = useState<string | null>(null);

  const saveQuote = async (status: 'draft' | 'emailed' | 'downloaded' = 'draft') => {
    if (!user) {
      alert("You must be logged in to save a quote");
      return null;
    }

    setIsSaving(true);
    try {
      const startDate = formData.projectStartDate.year && formData.projectStartDate.month && formData.projectStartDate.day
        ? `${formData.projectStartDate.year}-${formData.projectStartDate.month.padStart(2, '0')}-${formData.projectStartDate.day.padStart(2, '0')}`
        : null;

      const endDate = formData.projectEndDate.year && formData.projectEndDate.month && formData.projectEndDate.day
        ? `${formData.projectEndDate.year}-${formData.projectEndDate.month.padStart(2, '0')}-${formData.projectEndDate.day.padStart(2, '0')}`
        : null;

      const totalFilmingHours = formData.filmingDetails?.reduce((total: number, day: any) => {
        return total + (day.hours || 0) + (day.minutes || 0) / 60;
      }, 0) || 0;

      const quoteData = {
        client_id: user.id,
        client_name: formData.fullName || '',
        client_email: formData.contactEmail || '',
        production_company: formData.productionCompanyName || null,
        project_start_date: startDate,
        project_end_date: endDate,
        tier: selectedPackage.toLowerCase(),
        status: status,
        filming_hours: totalFilmingHours,
        revenue: 0,
        form_data: formData,
      };

      const { data, error } = await supabase
        .from('quotes')
        .insert([quoteData])
        .select()
        .single();

      if (error) throw error;

      setQuoteId(data.id);
      return data.id;
    } catch (error) {
      console.error('Error saving quote:', error);
      alert('Failed to save quote. Please try again.');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmail = async () => {
    if (!quoteId) {
      const newQuoteId = await saveQuote('emailed');
      if (newQuoteId) {
        alert("Quote saved! Email functionality will be implemented");
      }
    } else {
      await supabase
        .from('quotes')
        .update({ status: 'emailed' })
        .eq('id', quoteId);
      alert("Email functionality will be implemented");
    }
  };

  const handlePrint = async () => {
    if (!quoteId) {
      await saveQuote('downloaded');
    } else {
      await supabase
        .from('quotes')
        .update({ status: 'downloaded' })
        .eq('id', quoteId);
    }
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 px-4 md:px-16 py-6 md:py-12">
        <h2 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-[32px] mb-8">
          Quote Summary
        </h2>

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
          disabled={isSaving}
          className="h-[50px] px-8 rounded-lg bg-[#007c89] hover:bg-[#006670] [font-family:'Lexend',Helvetica] font-bold text-white text-xl disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Email'}
        </Button>
        <Button
          onClick={handlePrint}
          disabled={isSaving}
          className="h-[50px] px-8 rounded-lg bg-[#007c89] hover:bg-[#006670] [font-family:'Lexend',Helvetica] font-bold text-white text-xl disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Print'}
        </Button>
        <Button
          onClick={async () => {
            if (!quoteId) {
              const newQuoteId = await saveQuote('done');
              if (newQuoteId) {
                navigate('/all-quotes');
              }
            } else {
              navigate('/all-quotes');
            }
          }}
          disabled={isSaving}
          className="h-[50px] px-8 rounded-lg bg-[#023c97] hover:bg-[#022d70] [font-family:'Lexend',Helvetica] font-bold text-white text-xl disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save & View All Quotes'}
        </Button>
      </div>
    </div>
  );
};
