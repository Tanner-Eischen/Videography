import React from "react";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";

export const QuoteFormSection = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full items-start gap-[9px] relative">
      <Label className="font-bold [font-family:'Lexend',Helvetica] text-black text-lg tracking-[0] leading-[normal]">
        Full Name
      </Label>

      <Input
        defaultValue="Jane Doe"
        className="h-[61px] px-5 py-0 rounded-xl border border-solid border-[#5a5a5a] [font-family:'Lexend',Helvetica] font-normal text-black text-lg tracking-[0] leading-[normal]"
      />
    </div>
  );
};
