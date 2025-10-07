import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Avatar } from "../../components/ui/avatar";
import { LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { StepSidebar } from "./components/StepSidebar";
import { ClientInfoStep } from "./steps/ClientInfoStep";
import { ProjectInfoStep } from "./steps/ProjectInfoStep";
import { SetupStep } from "./steps/SetupStep";
import { SummaryStep } from "./steps/SummaryStep";

export type QuoteStep = 1 | 2 | 3 | 4;

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

export const CreateQuote = (): JSX.Element => {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [currentStep, setCurrentStep] = useState<QuoteStep>(1);
  const [formData, setFormData] = useState<QuoteFormData>({
    fullName: "",
    contactEmail: "",
    productionCompanyName: "",
    projectStartDate: { month: "", day: "", year: "" },
    projectEndDate: { month: "", day: "", year: "" },
    numberOfDeliverables: 3,
    deliverables: [
      { hours: 4, minutes: 25 },
      { hours: 0, minutes: 0 },
      { hours: 0, minutes: 0 },
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
    crewPerSetup: 0,
    weight: 0,
    discount: 0,
  });

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
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as QuoteStep);
    }
  };

  const handleComplete = () => {
    setCurrentStep(4);
  };

  const updateFormData = (data: Partial<QuoteFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="bg-[#ffffff] w-full min-h-screen flex flex-col">
      <header className="bg-[#023c97] h-[70px] flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center">
            <img className="w-8 h-8" alt="Logo" src="/v.png" />
          </div>
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
          <Avatar className="w-12 h-12 bg-[#75c4cc]">
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
              {profile?.full_name?.charAt(0) || "A"}
            </div>
          </Avatar>
        </div>
      </header>

      <div className="flex flex-1">
        <StepSidebar currentStep={currentStep} onStepChange={setCurrentStep} />

        <div className="flex-1 flex flex-col">
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
              onNext={handleNext}
              onCancel={handleCancel}
              onSaveProgress={handleSaveProgress}
            />
          )}
          {currentStep === 3 && (
            <SetupStep
              formData={formData}
              updateFormData={updateFormData}
              onComplete={handleComplete}
              onCancel={handleCancel}
              onSaveProgress={handleSaveProgress}
            />
          )}
          {currentStep === 4 && (
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
