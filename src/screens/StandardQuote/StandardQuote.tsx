import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { QuoteHeaderSection } from '../MacbookAir/sections/QuoteHeaderSection/QuoteHeaderSection';
import { NavigationSection } from '../MacbookAir/sections/NavigationSection/NavigationSection';
import { QuoteContainerSection } from '../MacbookAir/sections/QuoteContainerSection/QuoteContainerSection';
import { QuoteFormSection } from '../MacbookAir/sections/QuoteFormSection/QuoteFormSection';
import { ClientInfoSection } from '../MacbookAir/sections/ClientInfoSection/ClientInfoSection';
import { DateSelectionSection } from '../MacbookAir/sections/DateSelectionSection/DateSelectionSection';

export const StandardQuote = (): JSX.Element => {
  const [formData, setFormData] = useState({
    crewPerSetup: '',
    weightProductionToProfit: '',
    discount: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const actionButtons = [
    {
      text: 'Cancel',
      className: 'bg-[#5a5a5a] hover:bg-[#4a4a4a]',
    },
    {
      text: 'Save Progress',
      className: 'bg-[#007c89] hover:bg-[#006670]',
    },
    {
      text: 'Next',
      className: 'bg-[#023c97] hover:bg-[#022d70]',
    },
  ];

  return (
    <div className="bg-[#ffffff] w-full min-w-[1280px] min-h-[949px] flex flex-col">
      <QuoteHeaderSection />

      <div className="flex flex-1">
        <div className="w-[31.41%] bg-[#75c4cc] flex flex-col">
          <div className="pt-[64px] pl-[68px] pr-4">
            <h1 className="w-[251px] [font-family:'Lexend',Helvetica] font-bold text-black text-[40px] tracking-[0] leading-[normal]">
              Create a New Quote
            </h1>
          </div>

          <div className="flex-1 mt-8">
            <NavigationSection />
          </div>
        </div>

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

          <div className="px-8 mt-8">
            <div className="w-[741px]">
              <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal] mb-4 block">
                Production Company Name
              </Label>
              <Input className="h-[61px] rounded-xl border border-solid border-[#5a5a5a]" />
            </div>
          </div>

          <div className="px-8 mt-8">
            <h2 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-[25px] tracking-[0] leading-[normal] mb-6">
              Project Information
            </h2>

            <div className="space-y-6 max-w-[741px]">
              <div>
                <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal] mb-2 block">
                  Crew per Setup (DP + Other) (1-7)
                </Label>
                <Input
                  className="h-[61px] rounded-xl border border-solid border-[#5a5a5a]"
                  value={formData.crewPerSetup}
                  onChange={(e) => handleInputChange('crewPerSetup', e.target.value)}
                />
              </div>

              <div>
                <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal] mb-2 block">
                  Weight (Production to Profit) (40-80%)
                </Label>
                <Input
                  className="h-[61px] rounded-xl border border-solid border-[#5a5a5a]"
                  value={formData.weightProductionToProfit}
                  onChange={(e) => handleInputChange('weightProductionToProfit', e.target.value)}
                />
              </div>

              <div>
                <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal] mb-2 block">
                  Discount (0-20%)
                </Label>
                <Input
                  className="h-[61px] rounded-xl border border-solid border-[#5a5a5a]"
                  value={formData.discount}
                  onChange={(e) => handleInputChange('discount', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 px-8 py-8 mt-auto">
            {actionButtons.map((button, index) => (
              <Button
                key={index}
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
