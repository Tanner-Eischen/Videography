import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../../components/ui/card";

type NavigationSectionProps = {
  currentStep: 'basic' | 'standard' | 'premium';
  onStepChange: (step: 'basic' | 'standard' | 'premium') => void;
};

export const NavigationSection = ({ currentStep, onStepChange }: NavigationSectionProps): JSX.Element => {
  const navigate = useNavigate();
  const getStepNumber = (step: string) => {
    switch (step) {
      case 'basic': return 1;
      case 'standard': return 2;
      case 'premium': return 3;
      default: return 1;
    }
  };

  const currentStepNumber = getStepNumber(currentStep);

  const navigationItems = [
    {
      id: "basic" as const,
      title: "Basic",
      stepNumber: 1,
      route: '/create-quote',
    },
    {
      id: "standard" as const,
      title: "Standard",
      stepNumber: 2,
      route: '/quote/standard',
    },
    {
      id: "premium" as const,
      title: "Premium",
      stepNumber: 3,
      route: '/quote/premium',
    },
  ];

  const handleStepClick = (item: typeof navigationItems[0]) => {
    if (item.stepNumber <= currentStepNumber) {
      onStepChange(item.id);
      navigate(item.route);
    }
  };

  return (
    <nav className="flex flex-col w-[277px]">
      {navigationItems.map((item, index) => {
        const isCompleted = item.stepNumber < currentStepNumber;
        const isActive = item.id === currentStep;
        const isClickable = item.stepNumber <= currentStepNumber;
        const bgColor = isActive ? 'bg-[#ffffff]' : 'bg-[#ffffff4c]';
        const shadow = isActive ? 'shadow-[0px_4px_4px_#00000040]' : '';
        const fontWeight = isActive ? 'font-bold' : 'font-normal';

        return (
          <div key={item.id} className="flex flex-col">
            <Card
              className={`w-[277px] h-20 ${bgColor} rounded-[10px] ${shadow} border-0 ${isClickable ? 'cursor-pointer hover:bg-white transition-colors' : 'cursor-not-allowed opacity-60'}`}
              onClick={() => handleStepClick(item)}
            >
              <CardContent className="p-0 relative h-full">
                <div
                  className={`absolute top-[25px] left-20 [font-family:'Lexend',Helvetica] ${fontWeight} text-[#023c97] text-[25px] tracking-[0] leading-[normal]`}
                >
                  {item.title}
                </div>

                {isCompleted ? (
                  <img
                    className="absolute top-[18px] left-[19px] w-11 h-11"
                    alt="Group"
                    src="/group-26.png"
                  />
                ) : (
                  <div className="absolute top-[18px] left-[19px] w-[46px] h-11">
                    <div className="absolute top-0 left-0 w-11 h-11 bg-[#2cacba] rounded-[22px]" />
                    <div className="absolute top-1.5 left-[15px] [font-family:'Lexend',Helvetica] font-normal text-[#023c97] text-[25px] tracking-[0] leading-[normal]">
                      {item.stepNumber}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {index < navigationItems.length - 1 && (
              <div className="ml-9 w-[9px] h-[100px] bg-[#2cacba]" />
            )}
          </div>
        );
      })}
    </nav>
  );
};
