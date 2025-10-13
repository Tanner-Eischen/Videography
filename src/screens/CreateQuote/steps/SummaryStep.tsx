import React, { useState } from "react";
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
  const [saveError, setSaveError] = useState<string | null>(null);


  const saveQuote = async (): Promise<boolean> => {
    if (isSaving) return false;

    if (!profile?.id) {
      setSaveError("You must be signed in to save.");
      return false;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const pad2 = (v: string | number) => String(v ?? "").padStart(2, "0");

      const startDate =
        formData?.projectStartDate?.year &&
        formData?.projectStartDate?.month &&
        formData?.projectStartDate?.day
          ? `${formData.projectStartDate.year}-${pad2(formData.projectStartDate.month)}-${pad2(formData.projectStartDate.day)}`
          : null;

      const endDate =
        formData?.projectEndDate?.year &&
        formData?.projectEndDate?.month &&
        formData?.projectEndDate?.day
          ? `${formData.projectEndDate.year}-${pad2(formData.projectEndDate.month)}-${pad2(formData.projectEndDate.day)}`
          : null;

          // was trying to craete a duplicate prevention function but I couddn't get it to work correctly'
     /*const { data: existingDraft, error: checkError } = await supabase
        .from("quotes")
        .select("id")
        .eq("client_email", formData?.contactEmail ?? "")
        .eq("status", "draft")
        .limit(1)
        .maybeSingle();

      if (checkError) {
        console.warn("Duplicate check failed:", checkError);
      }

      if (existingDraft) {
        setQuoteSaved(true);
        return true; // treat as success since a draft already exists
      }*/

      const { error: insertError } = await supabase
        .from("quotes")
        .insert({
          client_id: profile.id,
          client_name: formData.fullName,
          client_email: formData.contactEmail,
          client_phone: formData.clientPhoneNumber,
          project_start_date: startDate,
          project_end_date: endDate,
          status: "draft",
          form_data: formData,
        });

      if (insertError) throw insertError;

      setQuoteSaved(true);
      return true;
    } catch (err: any) {
      console.error("Error saving quote:", err);
      setSaveError("Failed to save quote. Please try again.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveQuote = async () => {
    await saveQuote();
  };

  const handleEmail = async () => {
    if (!quoteSaved) {
      await saveQuote();
    }
    if (quoteSaved) {
      alert("Email functionality will be implemented");
    }
  };

  const handlePrint = async () => {
    if (!quoteSaved) {
      await saveQuote();
    }
    if (quoteSaved) {
      window.print();
    }
  };

  const handleCreateNewQuoteClick = () => {
    setShowConfirmModal(true);
  };

const handleConfirmCreateNewQuote = async () => {
  console.log("🔔 Confirm clicked");
  const ok = await saveQuote();
  console.log("🔔 saveQuote returned:", ok);
  if (!ok) return;

  setShowConfirmModal(false);
  // Skip form reset and navigate directly
  navigate("/dashboard");
  // keep navigation behavior consistent
};

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 px-4 md:px-16 py-6 md:py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="[font-family:'Lexend',Helvetica] font-bold text-[#003D82] text-[32px]">
              Quote Summary
            </h2>
            {quoteSaved ? (
              <span className="text-green-700 text-sm font-semibold">Saved</span>
            ) : null}
          </div>

          {saveError ? (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-red-700 text-sm">
              {saveError}
            </div>
          ) : null}

          <div className="bg-[#E8EFF3] rounded-xl p-8">
            <div className="flex items-center gap-4 mb-8">
              {(["Standard", "Best Deal", "Lifejacket"] as QuotePackage[]).map((pkg) => (
                <button
                  key={pkg}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`flex-1 h-14 rounded-lg [font-family:'Lexend',Helvetica] font-bold text-lg transition-all ${
                    selectedPackage === pkg
                      ? "bg-[#003D82] text-white"
                      : "bg-[#a0b4b8] text-white hover:bg-[#90a4a8]"
                  }`}
                >
                  {pkg}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl p-8 min-h-[400px] flex flex-col">
              <div className="mb-8">
                <div className="inline-block bg-[#003D82] text-white px-6 py-2 rounded [font-family:'Lexend',Helvetica] font-bold text-lg mb-8">
                  {selectedPackage} Quote
                </div>
              </div>

              <div className="flex items-center justify-center flex-1">
                <div className="[font-family:'Lexend',Helvetica] font-bold text-[#003D82] text-[80px]">
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

        {/* Action bar — no Save Draft button */}
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
            disabled={isSaving}
            className="h-[50px] px-8 rounded-lg bg-[#003D82] hover:bg-[#002A5C] disabled:opacity-60 [font-family:'Lexend',Helvetica] font-bold text-white text-xl"
          >
            {isSaving ? "Creating..." : "Create New Quote"}
          </Button>
        </div>
      </div>

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              <span className="[font-family:'Lexend',Helvetica] font-bold text-xl">
                Create New Quote?
              </span>
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
              disabled={isSaving}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-60 [font-family:'Lexend',Helvetica] font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmCreateNewQuote}
              disabled={isSaving}
              className="bg-[#003D82] hover:bg-[#002A5C] disabled:opacity-60 text-white [font-family:'Lexend',Helvetica] font-semibold"
            >
              {isSaving ? "Saving..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
