import React from "react";
import { Check } from "lucide-react";
import { QuoteStep } from "../CreateQuote";

interface StepSidebarProps {
  currentStep: QuoteStep;
  onStepChange: (step: QuoteStep) => void;
}

interface SubStep {
  label: string;
}

interface Step {
  number: QuoteStep;
  title: string;
  subSteps?: SubStep[];
}

export const StepSidebar: React.FC<StepSidebarProps> = ({
  currentStep,
  onStepChange,
}) => {
  const steps: Step[] = [
    {
      number: 1,
      title: "Client Info",
      subSteps: [
        { label: "Full Name" },
        { label: "Project Date" },
        { label: "Production Company Name" },
      ],
    },
    {
      number: 2,
      title: "Project Info",
      subSteps: [{ label: "Deliverables" }, { label: "Filming" }],
    },
    {
      number: 3,
      title: "Setup",
      subSteps: [
        { label: "Crew per Setup" },
        { label: "Weight (Production to Profit)" },
        { label: "Discount" },
      ],
    },
    {
      number: 4,
      title: "Summary",
    },
  ];

  const isStepCompleted = (stepNumber: QuoteStep) => {
    return currentStep > stepNumber;
  };

  const isStepActive = (stepNumber: QuoteStep) => {
    return currentStep === stepNumber;
  };

  return (
    <div className="w-[400px] bg-[#d4e8ea] flex flex-col pt-16 px-12">
      <h1 className="[font-family:'Lexend',Helvetica] font-bold text-black text-[40px] tracking-[0] leading-[1.2] mb-12">
        Create a New Quote
      </h1>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={step.number} className="relative">
            <div
              className={`flex items-center gap-4 p-4 rounded-lg transition-all cursor-pointer ${
                isStepActive(step.number)
                  ? "bg-white shadow-md"
                  : isStepCompleted(step.number)
                  ? "bg-white/50"
                  : "bg-transparent"
              }`}
              onClick={() => {
                if (step.number <= currentStep || isStepCompleted(step.number)) {
                  onStepChange(step.number);
                }
              }}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isStepCompleted(step.number)
                    ? "bg-[#023c97] text-white"
                    : isStepActive(step.number)
                    ? "bg-[#023c97] text-white"
                    : "bg-white text-[#023c97]"
                }`}
              >
                {isStepCompleted(step.number) ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span className="[font-family:'Lexend',Helvetica] font-bold text-xl">
                    {step.number}
                  </span>
                )}
              </div>
              <span
                className={`[font-family:'Lexend',Helvetica] font-bold text-xl ${
                  isStepActive(step.number) || isStepCompleted(step.number)
                    ? "text-[#023c97]"
                    : "text-gray-600"
                }`}
              >
                {step.title}
              </span>
            </div>

            {step.subSteps && isStepActive(step.number) && (
              <div className="ml-[52px] mt-4 space-y-3 relative">
                <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-[#023c97]"></div>
                {step.subSteps.map((subStep, subIndex) => (
                  <div key={subIndex} className="flex items-center gap-3 relative">
                    <div className="w-4 h-4 rounded-full bg-[#023c97] flex-shrink-0 z-10 flex items-center justify-center">
                      {subIndex === 0 && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="[font-family:'Lexend',Helvetica] text-[#023c97] text-base">
                      {subStep.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {index < steps.length - 1 && (
              <div
                className={`ml-6 w-[2px] h-8 my-2 ${
                  isStepCompleted(step.number) ? "bg-[#023c97]" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
