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

      <div className="space-y-3 relative">
        <div className="absolute left-[5px] top-[20px] bottom-0 w-[5px] bg-[#0050c8] rounded-full"></div>

        {steps.map((step, index) => (
          <div key={step.number} className="relative">
            <div
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all cursor-pointer relative ml-[16px] ${
                isStepActive(step.number)
                  ? "bg-white shadow-md"
                  : "bg-white/30"
              }`}
              onClick={() => {
                onStepChange(step.number);
              }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 absolute -left-[21px] ${
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
                className={`[font-family:'Lexend',Helvetica] font-bold text-lg ml-6 ${
                  isStepActive(step.number) || isStepCompleted(step.number)
                    ? "text-[#0050c8]"
                    : "text-[#5c8bb0]"
                }`}
              >
                {step.title}
              </span>
            </div>

            {step.subSteps && isStepActive(step.number) && (
              <div className="relative ml-[36px] mt-3 mb-2 space-y-3">
                {step.subSteps.map((subStep, subIndex) => (
                  <div key={subIndex} className="flex items-center gap-3 relative">
                    <div className="w-[14px] h-[14px] rounded-full bg-[#0050c8] flex-shrink-0 flex items-center justify-center absolute -left-[26px]">
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
          </div>
        ))}
      </div>
    </div>
  );
};
