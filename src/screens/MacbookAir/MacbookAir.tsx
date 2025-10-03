import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { ClientInfoSection } from "./sections/ClientInfoSection/ClientInfoSection";
import { DateSelectionSection } from "./sections/DateSelectionSection/DateSelectionSection";
import { NavigationSection } from "./sections/NavigationSection/NavigationSection";
import { QuoteContainerSection } from "./sections/QuoteContainerSection/QuoteContainerSection";
import { QuoteFormSection } from "./sections/QuoteFormSection/QuoteFormSection";
import { QuoteHeaderSection } from "./sections/QuoteHeaderSection/QuoteHeaderSection";

export const MacbookAir = (): JSX.Element => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'basic' | 'standard' | 'premium'>('basic');

  const handleNext = () => {
    if (currentStep === 'basic') {
      setCurrentStep('standard');
      navigate('/quote/standard');
    } else if (currentStep === 'standard') {
      setCurrentStep('premium');
      navigate('/quote/premium');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleSaveProgress = () => {
    alert('Progress saved!');
  };

  const actionButtons = [
    {
      text: "Cancel",
      className: "bg-[#5a5a5a] hover:bg-[#4a4a4a]",
      onClick: handleCancel,
    },
    {
      text: "Save Progress",
      className: "bg-[#007c89] hover:bg-[#006670]",
      onClick: handleSaveProgress,
    },
    {
      text: "Next",
      className: "bg-[#023c97] hover:bg-[#022d70]",
      onClick: handleNext,
    },
  ];

  return (
    <div className="bg-[#ffffff] w-full min-w-[1280px] min-h-[949px] flex flex-col">
      <QuoteHeaderSection />

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-[31.41%] bg-[#75c4cc] flex flex-col">
          <div className="pt-[64px] pl-[68px] pr-4">
            <h1 className="w-[251px] [font-family:'Lexend',Helvetica] font-bold text-black text-[40px] tracking-[0] leading-[normal]">
              Create a New Quote
            </h1>
          </div>

          <div className="flex-1 mt-8">
            <NavigationSection currentStep={currentStep} onStepChange={setCurrentStep} />
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="px-8 py-6">
            <QuoteContainerSection />
          </div>

          <div className="px-8">
            <h2 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-[25px] tracking-[0] leading-[normal] mb-6">
              Client Information
            </h2>

            <QuoteFormSection />
          </div>

          {/* Date Selection Section */}
          <div className="px-8 mt-8">
            <div className="flex items-center gap-8 mb-4">
              <div className="flex-1">
                <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal]">
                  Project Start Date
                </Label>
              </div>

              <div className="flex items-center gap-4">
                <img className="w-11 h-11" alt="Subtract" src="/subtract.png" />
              </div>

              <div className="flex-1">
                <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal]">
                  Project End Date
                </Label>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="flex-1">
                <ClientInfoSection />
              </div>
              <div className="flex-1">
                <DateSelectionSection />
              </div>
            </div>
          </div>

          {/* Production Company Name */}
          <div className="px-8 mt-8">
            <div className="w-[741px]">
              <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal] mb-4 block">
                Production Company Name
              </Label>
              <Input className="h-[61px] rounded-xl border border-solid border-[#5a5a5a]" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 px-8 py-8 mt-auto">
            {actionButtons.map((button, index) => (
              <Button
                key={index}
                onClick={button.onClick}
                className={`h-[45px] px-5 py-[7px] rounded-[10px] ${button.className}`}
              >
                <span className="[font-family:'Lexend',Helvetica] font-bold text-white text-[25px] tracking-[0] leading-[normal]">
                  {button.text}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
