import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface EditQuoteModalProps {
  quote: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type QuotePackage = "Standard" | "Best Deal" | "Lifejacket";

export const EditQuoteModal: React.FC<EditQuoteModalProps> = ({
  quote,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<QuotePackage>("Standard");

  const handleEditQuote = () => {
    onOpenChange(false);
    navigate(`/create-quote?edit=${quote.id}`);
  };

  const handleEmail = () => {
    alert("Email functionality will be implemented");
  };

  const handlePrint = () => {
    window.print();
  };

  const formData = quote?.form_data || {};
  const displayPrice = quote?.revenue || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] md:w-[900px] max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute -top-2 -right-2 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="px-2 md:px-8 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="[font-family:'Lexend',Helvetica] font-bold text-[#003D82] text-2xl md:text-[32px]">
                  Quote Summary
                </h2>
                <p className="text-sm text-gray-600 [font-family:'Lexend',Helvetica] mt-1">
                  Quote ID: {quote?.id.slice(0, 8)}...
                </p>
              </div>
              <Button
                onClick={handleEditQuote}
                className="h-[50px] px-6 md:px-8 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] [font-family:'Lexend',Helvetica] font-bold text-white text-lg md:text-xl w-full md:w-auto"
              >
                Edit Quote
              </Button>
            </div>

            <div className="bg-[#E8EFF3] rounded-xl p-4 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-8">
                <button
                  onClick={() => setSelectedPackage("Standard")}
                  className={`flex-1 w-full h-12 md:h-14 rounded-lg [font-family:'Lexend',Helvetica] font-bold text-base md:text-lg transition-all ${
                    selectedPackage === "Standard"
                      ? "bg-[#003D82] text-white"
                      : "bg-[#a0b4b8] text-white hover:bg-[#90a4a8]"
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setSelectedPackage("Best Deal")}
                  className={`flex-1 w-full h-12 md:h-14 rounded-lg [font-family:'Lexend',Helvetica] font-bold text-base md:text-lg transition-all ${
                    selectedPackage === "Best Deal"
                      ? "bg-[#003D82] text-white"
                      : "bg-[#a0b4b8] text-white hover:bg-[#90a4a8]"
                  }`}
                >
                  Best Deal
                </button>
                <button
                  onClick={() => setSelectedPackage("Lifejacket")}
                  className={`flex-1 w-full h-12 md:h-14 rounded-lg [font-family:'Lexend',Helvetica] font-bold text-base md:text-lg transition-all ${
                    selectedPackage === "Lifejacket"
                      ? "bg-[#003D82] text-white"
                      : "bg-[#a0b4b8] text-white hover:bg-[#90a4a8]"
                  }`}
                >
                  Lifejacket
                </button>
              </div>

              <div className="bg-white rounded-xl p-4 md:p-8 min-h-[400px] flex flex-col">
                <div className="mb-8">
                  <div className="inline-block bg-[#003D82] text-white px-4 md:px-6 py-2 rounded [font-family:'Lexend',Helvetica] font-bold text-base md:text-lg mb-8">
                    {selectedPackage} Quote
                  </div>
                </div>

                <div className="flex items-center justify-center flex-1">
                  <div className="[font-family:'Lexend',Helvetica] font-bold text-[#003D82] text-4xl md:text-[80px]">
                    ${displayPrice.toLocaleString()}
                  </div>
                </div>

                <div className="mt-8 space-y-3 md:space-y-4 text-gray-600 [font-family:'Lexend',Helvetica] text-sm md:text-base">
                  <div className="flex justify-between gap-4">
                    <span>Client Name:</span>
                    <span className="font-semibold text-right">{formData.fullName || quote?.client_name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Contact Email:</span>
                    <span className="font-semibold text-right break-all">{formData.contactEmail || quote?.client_email || "N/A"}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Phone Number:</span>
                    <span className="font-semibold text-right">{formData.clientPhoneNumber || quote?.client_phone || "N/A"}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Number of Deliverables:</span>
                    <span className="font-semibold">{formData.numberOfDeliverables || 0}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Filming Days:</span>
                    <span className="font-semibold">{formData.filmingDays || 0}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Crew per Setup:</span>
                    <span className="font-semibold">{formData.crewPerSetup || 0}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Weight (Production/Profit):</span>
                    <span className="font-semibold">{formData.weight || 0}%</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Discount:</span>
                    <span className="font-semibold">{formData.discount || 0}%</span>
                  </div>
                  <div className="flex justify-between gap-4 pt-4 border-t-2 border-gray-200">
                    <span className="font-bold text-[#003D82]">Status:</span>
                    <span className={`font-bold capitalize ${
                      quote?.status === 'accepted' ? 'text-green-600' :
                      quote?.status === 'pending' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>{quote?.status || 'draft'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 px-2 md:px-8 py-6 md:py-8 border-t border-gray-200">
            <Button
              onClick={handleEmail}
              className="h-[50px] px-6 md:px-8 rounded-lg bg-[#007c89] hover:bg-[#006670] [font-family:'Lexend',Helvetica] font-bold text-white text-lg md:text-xl w-full md:w-auto"
            >
              Email
            </Button>
            <Button
              onClick={handlePrint}
              className="h-[50px] px-6 md:px-8 rounded-lg bg-[#007c89] hover:bg-[#006670] [font-family:'Lexend',Helvetica] font-bold text-white text-lg md:text-xl w-full md:w-auto"
            >
              Print
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              className="h-[50px] px-6 md:px-8 rounded-lg bg-[#003D82] hover:bg-[#002A5C] [font-family:'Lexend',Helvetica] font-bold text-white text-lg md:text-xl w-full md:w-auto"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
