import React from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

interface SetupStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onComplete: () => void;
  onCancel: () => void;
  onSaveProgress: () => void;
}

export const SetupStep: React.FC<SetupStepProps> = ({
  formData,
  updateFormData,
  onComplete,
  onCancel,
  onSaveProgress,
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 px-4 md:px-16 py-6 md:py-12">
        <h2 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-[32px] mb-2">
          Create a New Quote
        </h2>
        <p className="[font-family:'Lexend',Helvetica] text-black text-lg mb-12">
          Almost there! Fill out the specifics/discount details.
        </p>

        <h3 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-[25px] mb-6">
          Project Information
        </h3>

        <div className="space-y-8 max-w-4xl">
          <div>
            <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg mb-3 block">
              Crew per Setup (DP + Other) (1-7)
            </Label>
            <Input
              type="number"
              min="1"
              max="7"
              value={formData.crewPerSetup || ""}
              onChange={(e) =>
                updateFormData({
                  crewPerSetup: parseInt(e.target.value) || 0,
                })
              }
              className="h-[60px] rounded-xl border-2 border-[#5a5a5a] [font-family:'Lexend',Helvetica] text-lg px-6"
            />
          </div>

          <div>
            <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg mb-3 block">
              Weight (Production to Profit) (40–80%)
            </Label>
            <Input
              type="number"
              min="40"
              max="80"
              value={formData.weight || ""}
              onChange={(e) =>
                updateFormData({
                  weight: parseInt(e.target.value) || 0,
                })
              }
              className="h-[60px] rounded-xl border-2 border-[#5a5a5a] [font-family:'Lexend',Helvetica] text-lg px-6"
            />
          </div>

          <div>
            <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg mb-3 block">
              Discount (0–20%)
            </Label>
            <Input
              type="number"
              min="0"
              max="20"
              value={formData.discount || ""}
              onChange={(e) =>
                updateFormData({
                  discount: parseInt(e.target.value) || 0,
                })
              }
              className="h-[60px] rounded-xl border-2 border-[#5a5a5a] [font-family:'Lexend',Helvetica] text-lg px-6"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 px-4 md:px-16 py-6 md:py-8 border-t border-gray-200">
        <Button
          onClick={onCancel}
          className="h-[50px] px-8 rounded-lg bg-[#5a5a5a] hover:bg-[#4a4a4a] [font-family:'Lexend',Helvetica] font-bold text-white text-xl"
        >
          Cancel
        </Button>
        <Button
          onClick={onSaveProgress}
          className="h-[50px] px-8 rounded-lg bg-[#007c89] hover:bg-[#006670] [font-family:'Lexend',Helvetica] font-bold text-white text-xl"
        >
          Save Progress
        </Button>
        <Button
          onClick={onComplete}
          className="h-[50px] px-8 rounded-lg bg-[#023c97] hover:bg-[#022d70] [font-family:'Lexend',Helvetica] font-bold text-white text-xl"
        >
          Complete
        </Button>
      </div>
    </div>
  );
};
