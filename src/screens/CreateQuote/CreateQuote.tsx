import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Avatar } from "../../components/ui/avatar";
import { LogOut, User, Settings, HelpCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";
import { StepSidebar } from "./components/StepSidebar";
import { ClientInfoStep } from "./steps/ClientInfoStep";
import { ProjectInfoStep } from "./steps/ProjectInfoStep";
import { SummaryStep } from "./steps/SummaryStep";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export type QuoteStep = 1 | 2 | 3;

interface CreateQuoteProps {
  existingQuote?: any;
  isEditMode?: boolean;
}

interface QuoteFormData {
  fullName: string;
  contactEmail: string;
  clientPhoneNumber: string;
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
  rushFee: boolean;
  highTrafficFee: boolean;
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
    clientPhoneNumber: "",
    projectStartDate: { month: "", day: "", year: "" },
    projectEndDate: { month: "", day: "", year: "" },
    numberOfDeliverables: 1,
    deliverables: [
      { hours: 0, minutes: 0, seconds: 0 },
    ],
    filmingDays: 1,
    filmingDetails: [
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
      rushFee: false,
      highTrafficFee: false,
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

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as QuoteStep);
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
      <header className={`${isEditMode ? 'bg-[#f59e0b]' : 'bg-[#003D82]'} h-[70px] flex items-center justify-between px-8`}>
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
            className="[font-family:'Lexend',Helvetica] font-semibold text-white text-lg hover:text-[#8FC4D4] transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/create-quote")}
            className="[font-family:'Lexend',Helvetica] font-semibold text-white text-lg hover:text-[#8FC4D4] transition-colors"
          >
            Create Quote
          </button>
          <button
            onClick={() => navigate("/all-quotes")}
            className="[font-family:'Lexend',Helvetica] font-semibold text-white text-lg hover:text-[#8FC4D4] transition-colors"
          >
            All Quotes
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer focus:outline-none">
                <Avatar className="w-12 h-12 bg-[#003D82] hover:bg-[#002A5C] transition-colors">
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <User className="w-6 h-6" />
                  </div>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="[font-family:'Lexend',Helvetica]">
                {profile?.full_name || "My Account"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/settings")}
                className="[font-family:'Lexend',Helvetica] cursor-pointer"
              >
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open("mailto:support@example.com", "_blank")}
                className="[font-family:'Lexend',Helvetica] cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="[font-family:'Lexend',Helvetica] cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              onBack={handleBack}
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
