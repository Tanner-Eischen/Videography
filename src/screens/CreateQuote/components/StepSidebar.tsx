import React from "react";
import { Check } from "lucide-react";
import { QuoteStep } from "../CreateQuote";

interface StepSidebarProps {
  currentStep: QuoteStep;
  onStepChange: (step: QuoteStep) => void;
  completedSubSteps?: Record<number, string[]>;
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
  completedSubSteps = {},
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

  const isSubStepCompleted = (stepNumber: QuoteStep, subStepLabel: string) => {
    return completedSubSteps[stepNumber]?.includes(subStepLabel) || false;
  };

  return (
    <div className="w-[280px] bg-[#c8d8eb] flex flex-col pt-16 px-8">
      <h1 className="[font-family:'Lexend',Helvetica] font-bold text-black text-[32px] tracking-[0] leading-[1.2] mb-12">
        Create a New Quote
      </h1>

      <div className="space-y-0">
        {steps.map((step, index) => (
          <div key={step.number} className="relative">
            <div
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                isStepActive(step.number)
                  ? "bg-white shadow-sm"
                  : isStepCompleted(step.number)
                  ? "bg-white/60"
                  : "bg-transparent hover:bg-white/30"
              }`}
              onClick={() => {
                onStepChange(step.number);
              }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isStepCompleted(step.number)
                    ? "bg-[#0050c8] text-white"
                    : isStepActive(step.number)
                    ? "bg-[#0050c8] text-white"
                    : "bg-[#5c8bb0] text-white"
                }`}
              >
                {isStepCompleted(step.number) ? (
                  <Check className="w-5 h-5 stroke-[3]" />
                ) : (
                  <span className="[font-family:'Lexend',Helvetica] font-bold text-lg">
                    {step.number}
                  </span>
                )}
              </div>
              <span
                className={`[font-family:'Lexend',Helvetica] font-bold text-lg ${
                  isStepActive(step.number) || isStepCompleted(step.number)
                    ? "text-[#0050c8]"
                    : "text-[#5c8bb0]"
                }`}
              >
                {step.title}
              </span>
            </div>

            {step.subSteps && isStepActive(step.number) && (
              <div className="ml-5 mt-2 mb-1 space-y-2 relative">
                <div className="absolute left-[15px] top-0 bottom-0 w-[3px] bg-[#0050c8]"></div>
                {step.subSteps.map((subStep, subIndex) => (
                  <div key={subIndex} className="flex items-center gap-3 relative">
                    <div className="w-[14px] h-[14px] rounded-full bg-[#0050c8] flex-shrink-0 z-10 flex items-center justify-center ml-[8px]">
                      {isSubStepCompleted(step.number, subStep.label) && (
                        <Check className="w-[9px] h-[9px] text-white stroke-[3]" />
                      )}
                    </div>
                    <span className="[font-family:'Lexend',Helvetica] text-[#0050c8] text-[15px] leading-tight">
                      {subStep.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {index < steps.length - 1 && (
              <div
                className={`ml-5 w-[3px] h-6 ${
                  isStepCompleted(step.number) ? "bg-[#0050c8]" : "bg-[#a8c8d8]"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
