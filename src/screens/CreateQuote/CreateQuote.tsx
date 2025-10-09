import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Avatar } from "../../components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";
import { StepSidebar } from "./components/StepSidebar";
import { ClientInfoStep } from "./steps/ClientInfoStep";
import { ProjectInfoStep } from "./steps/ProjectInfoStep";
import { SummaryStep } from "./steps/SummaryStep";

export type QuoteStep = 1 | 2 | 3;

interface CreateQuoteProps {
  existingQuote?: any;
  isEditMode?: boolean;
}

interface QuoteFormData {
  fullName: string;
  contactEmail: string;
  productionCompanyName: string;
  projectStartDate: {
    month: string;
    day: string;
    year: string;
  };
  projectEndDate: {
    month: string;
    day: string;
    year: string;
  };
  numberOfDeliverables: number;
  deliverables: Array<{
    hours: number;
    minutes: number;
    seconds: number;
  }>;
  filmingDays: number;
  filmingDetails: Array<{
    date: {
      month: string;
      day: string;
      year: string;
    };
    hours: number;
    minutes: number;
    locations: Array<{
      address: string;
      miles: number;
      requiresSetup: boolean;
    }>;
  }>;
  crewPerSetup: number;
  weight: number;
  discount: number;
}

export const CreateQuote = ({ existingQuote, isEditMode = false }: CreateQuoteProps = {}): JSX.Element => {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [currentStep, setCurrentStep] = useState<QuoteStep>(1);

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const { isLoaded: mapsLoaded } = useGoogleMaps({ apiKey: googleMapsApiKey });

  const getInitialFormData = (): QuoteFormData => {
    if (existingQuote?.form_data) {
      return existingQuote.form_data;
    }
    return {
    fullName: "",
    contactEmail: "",
    productionCompanyName: "",
    projectStartDate: { month: "", day: "", year: "" },
    projectEndDate: { month: "", day: "", year: "" },
    numberOfDeliverables: 3,
    deliverables: [
      { hours: 4, minutes: 25, seconds: 0 },
      { hours: 0, minutes: 0, seconds: 0 },
      { hours: 0, minutes: 0, seconds: 0 },
    ],
    filmingDays: 3,
    filmingDetails: [
      {
        date: { month: "", day: "", year: "" },
        hours: 4,
        minutes: 25,
        locations: [{ address: "", miles: 25, requiresSetup: false }],
      },
      {
        date: { month: "", day: "", year: "" },
        hours: 0,
        minutes: 0,
        locations: [{ address: "", miles: 0, requiresSetup: false }],
      },
      {
        date: { month: "", day: "", year: "" },
        hours: 0,
        minutes: 0,
        locations: [{ address: "", miles: 0, requiresSetup: false }],
      },
    ],
      crewPerSetup: 2,
      weight: 60,
      discount: 0,
    };
  };

  const [formData, setFormData] = useState<QuoteFormData>(getInitialFormData());

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleSaveProgress = () => {
    alert("Progress saved!");
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as QuoteStep);
    }
  };

  const handleComplete = () => {
    setCurrentStep(3);
  };

  const updateFormData = (data: Partial<QuoteFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="bg-[#ffffff] w-full min-h-screen flex flex-col">
      <header className={`${isEditMode ? 'bg-[#f59e0b]' : 'bg-[#023c97]'} h-[70px] flex items-center justify-between px-8`}>
        <div className="flex items-center gap-4">
          <h1 className="[font-family:'Lexend',Helvetica] font-bold text-white text-2xl">
            Vid-QUO
          </h1>
          {isEditMode && (
            <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg">
              <span className="[font-family:'Lexend',Helvetica] font-bold text-white text-sm">
                EDIT MODE
              </span>
            </div>
          )}
        </div>

        <nav className="flex items-center gap-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="[font-family:'Lexend',Helvetica] font-semibold text-white text-lg hover:text-[#75c4cc] transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/create-quote")}
            className="[font-family:'Lexend',Helvetica] font-semibold text-white text-lg hover:text-[#75c4cc] transition-colors"
          >
            Create Quote
          </button>
          <button
            onClick={() => navigate("/all-quotes")}
            className="[font-family:'Lexend',Helvetica] font-semibold text-white text-lg hover:text-[#75c4cc] transition-colors"
          >
            All Quotes
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleLogout}
            className="bg-transparent hover:bg-white/10 text-white px-4 py-2 rounded-lg [font-family:'Lexend',Helvetica] font-semibold flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
          </Button>
          <Avatar className="w-12 h-12 bg-[#5c8bb0]">
            <div className="w-full h-full flex items-center justify-center text-white">
              <User className="w-6 h-6" />
            </div>
          </Avatar>
        </div>
      </header>

      <div className="flex flex-1">
        <StepSidebar currentStep={currentStep} onStepChange={setCurrentStep} isEditMode={isEditMode} />

        <div className="flex-1 flex flex-col">
          {isEditMode && existingQuote && (
            <div className="bg-gradient-to-r from-[#f59e0b] to-[#fb923c] px-8 py-4 shadow-md">
              <div className="flex items-center justify-between max-w-[1200px] mx-auto">
                <div>
                  <h2 className="[font-family:'Lexend',Helvetica] font-bold text-white text-xl mb-1">
                    Editing Quote for {existingQuote.client_name}
                  </h2>
                  <p className="[font-family:'Lexend',Helvetica] text-white/90 text-sm">
                    Quote ID: {existingQuote.id.slice(0, 8)}... • Status: <span className="font-bold capitalize">{existingQuote.status}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          {currentStep === 1 && (
            <ClientInfoStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onCancel={handleCancel}
              onSaveProgress={handleSaveProgress}
            />
          )}
          {currentStep === 2 && (
            <ProjectInfoStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleComplete}
              onCancel={handleCancel}
              onSaveProgress={handleSaveProgress}
            />
          )}
          {currentStep === 3 && (
            <SummaryStep
              formData={formData}
              onCreateNewQuote={() => {
                setCurrentStep(1);
                navigate("/create-quote");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
