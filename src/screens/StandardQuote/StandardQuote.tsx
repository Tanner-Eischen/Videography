import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { QuoteHeaderSection } from '../MacbookAir/sections/QuoteHeaderSection/QuoteHeaderSection';
import { NavigationSection } from '../MacbookAir/sections/NavigationSection/NavigationSection';
import { QuoteContainerSection } from '../MacbookAir/sections/QuoteContainerSection/QuoteContainerSection';
import { Minus, Plus } from 'lucide-react';

export const StandardQuote = (): JSX.Element => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'basic' | 'standard' | 'premium'>('standard');
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

  const handleNext = () => {
    navigate('/quote/premium');
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleSaveProgress = () => {
    alert('Progress saved!');
  };

  const actionButtons = [
    {
      text: 'Cancel',
      className: 'bg-[#5a5a5a] hover:bg-[#4a4a4a]',
      onClick: handleCancel,
    },
    {
      text: 'Save Progress',
      className: 'bg-[#007c89] hover:bg-[#006670]',
      onClick: handleSaveProgress,
    },
    {
      text: 'Next',
      className: 'bg-[#023c97] hover:bg-[#022d70]',
      onClick: handleNext,
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
            <NavigationSection currentStep={currentStep} onStepChange={setCurrentStep} />
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="px-8 py-6">
            <QuoteContainerSection />
          </div>

          <div className="px-8 mt-8">
            <h2 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-[25px] tracking-[0] leading-[normal] mb-6">
              Project Information
            </h2>

            <div className="grid grid-cols-2 gap-6 max-w-[900px]">
              <div>
                <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal] mb-2 block">
                  Number of Deliverables
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => decrementValue('numDeliverables', 1)}
                    className="w-12 h-12 bg-[#75c4cc] hover:bg-[#60b0b8] rounded-lg"
                  >
                    <Minus className="w-6 h-6" />
                  </Button>
                  <Input
                    className="h-[61px] rounded-xl border border-solid border-[#5a5a5a] text-center"
                    value={formData.numDeliverables}
                    readOnly
                  />
                  <Button
                    onClick={() => incrementValue('numDeliverables', 20)}
                    className="w-12 h-12 bg-[#75c4cc] hover:bg-[#60b0b8] rounded-lg"
                  >
                    <Plus className="w-6 h-6" />
                  </Button>
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
                  Filming Days
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => decrementValue('filmingDays', 1)}
                    className="w-12 h-12 bg-[#75c4cc] hover:bg-[#60b0b8] rounded-lg"
                  >
                    <Minus className="w-6 h-6" />
                  </Button>
                  <Input
                    className="h-[61px] rounded-xl border border-solid border-[#5a5a5a] text-center"
                    value={formData.filmingDays}
                    readOnly
                  />
                  <Button
                    onClick={() => incrementValue('filmingDays', 30)}
                    className="w-12 h-12 bg-[#75c4cc] hover:bg-[#60b0b8] rounded-lg"
                  >
                    <Plus className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal] mb-2 block">
                  Hours per Day
                </Label>
                <Input
                  className="h-[61px] rounded-xl border border-solid border-[#5a5a5a]"
                  value={formData.hoursPerDay}
                  onChange={(e) => handleInputChange('hoursPerDay', e.target.value)}
                />
              </div>

              <div>
                <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal] mb-2 block">
                  Number of Locations
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => decrementValue('numLocations', 1)}
                    className="w-12 h-12 bg-[#75c4cc] hover:bg-[#60b0b8] rounded-lg"
                  >
                    <Minus className="w-6 h-6" />
                  </Button>
                  <Input
                    className="h-[61px] rounded-xl border border-solid border-[#5a5a5a] text-center"
                    value={formData.numLocations}
                    readOnly
                  />
                  <Button
                    onClick={() => incrementValue('numLocations', 50)}
                    className="w-12 h-12 bg-[#75c4cc] hover:bg-[#60b0b8] rounded-lg"
                  >
                    <Plus className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal] mb-2 block">
                  Miles from Service Rep
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => decrementValue('milesFromServiceRep', 0)}
                    className="w-12 h-12 bg-[#75c4cc] hover:bg-[#60b0b8] rounded-lg"
                  >
                    <Minus className="w-6 h-6" />
                  </Button>
                  <Input
                    className="h-[61px] rounded-xl border border-solid border-[#5a5a5a] text-center"
                    value={formData.milesFromServiceRep}
                    readOnly
                  />
                  <Button
                    onClick={() => incrementValue('milesFromServiceRep', 1000)}
                    className="w-12 h-12 bg-[#75c4cc] hover:bg-[#60b0b8] rounded-lg"
                  >
                    <Plus className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

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
