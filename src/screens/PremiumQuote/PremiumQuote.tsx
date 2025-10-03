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
import { Minus, Plus } from 'lucide-react';

export const PremiumQuote = (): JSX.Element => {
  const [formData, setFormData] = useState({
    numDeliverables: 3,
    avgLengthPerDeliverable: '4 Hr 30mins',
    filmingDays: 3,
    hoursPerDay: '4 Hr 30mins',
    numLocations: 5,
    milesFromServiceRep: 0,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const incrementValue = (field: string, max: number) => {
    const currentValue = formData[field as keyof typeof formData];
    if (typeof currentValue === 'number' && currentValue < max) {
      setFormData(prev => ({ ...prev, [field]: currentValue + 1 }));
    }
  };

  const decrementValue = (field: string, min: number) => {
    const currentValue = formData[field as keyof typeof formData];
    if (typeof currentValue === 'number' && currentValue > min) {
      setFormData(prev => ({ ...prev, [field]: currentValue - 1 }));
    }
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

            <div className="grid grid-cols-2 gap-6 max-w-[900px]">
              <div>
                <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal] mb-2 block">
                  Number of Deliverables (1-7)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    className="h-[61px] rounded-xl border border-solid border-[#5a5a5a] text-center"
                    value={`${formData.numDeliverables} Deliverables`}
                    readOnly
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => incrementValue('numDeliverables', 7)}
                      className="h-[61px] w-[61px] bg-[#023c97] hover:bg-[#022d70] rounded-xl"
                    >
                      <Plus className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal] mb-2 block">
                  Average Length per Deliverable
                </Label>
                <Input
                  className="h-[61px] rounded-xl border border-solid border-[#5a5a5a]"
                  value={formData.avgLengthPerDeliverable}
                  onChange={(e) => handleInputChange('avgLengthPerDeliverable', e.target.value)}
                />
              </div>

              <div>
                <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal] mb-2 block">
                  Filming Days (1-7)
                </Label>
                <div className="flex items-center gap-4 h-[61px] rounded-xl border border-solid border-[#5a5a5a] px-4 bg-white">
                  <Button
                    onClick={() => decrementValue('filmingDays', 1)}
                    className="h-10 w-10 bg-[#023c97] hover:bg-[#022d70] rounded p-0"
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <span className="flex-1 text-center [font-family:'Lexend',Helvetica] text-lg font-semibold">
                    {formData.filmingDays}
                  </span>
                  <Button
                    onClick={() => incrementValue('filmingDays', 7)}
                    className="h-10 w-10 bg-[#023c97] hover:bg-[#022d70] rounded p-0"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal] mb-2 block">
                  Hours per Day (1-12)
                </Label>
                <Input
                  className="h-[61px] rounded-xl border border-solid border-[#5a5a5a]"
                  value={formData.hoursPerDay}
                  onChange={(e) => handleInputChange('hoursPerDay', e.target.value)}
                />
              </div>

              <div>
                <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal] mb-2 block">
                  Number of Locations (1-7)
                </Label>
                <Input
                  className="h-[61px] rounded-xl border border-solid border-[#5a5a5a]"
                  value={`${formData.numLocations} Locations`}
                  readOnly
                />
              </div>

              <div>
                <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal] mb-2 block">
                  Miles from Service Rep (0-300)
                </Label>
                <Input
                  className="h-[61px] rounded-xl border border-solid border-[#5a5a5a]"
                  type="number"
                  min="0"
                  max="300"
                  value={formData.milesFromServiceRep}
                  onChange={(e) => handleInputChange('milesFromServiceRep', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 px-8 py-8 mt-8">
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
