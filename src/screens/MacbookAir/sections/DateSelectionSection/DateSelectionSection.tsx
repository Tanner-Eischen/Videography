import { CalendarIcon } from "lucide-react";
import React from "react";

export const DateSelectionSection = (): JSX.Element => {
  const dateFields = [
    {
      label: "Month",
      placeholder: "MM",
      width: "w-[41px]",
      placeholderWidth: "w-8",
    },
    {
      label: "Day",
      placeholder: "DD",
      width: "w-[31px]",
      placeholderWidth: "w-[27px]",
    },
    {
      label: "Year",
      placeholder: "YYYY",
      width: "w-[52px]",
      placeholderWidth: "w-12",
    },
  ];

  return (
    <div className="w-full h-[61px] rounded-xl border border-solid border-[#5a5a5a] relative">
      <div className="absolute top-[11px] left-[15px] w-10 h-10 bg-m3state-layerslightonsurfacevariantopacity-008 rounded-[5px] flex items-center justify-center">
        <img
          className="absolute right-0 bottom-0 w-[38px] h-7"
          alt="Ripple"
          src="/ripple.svg"
        />
        <CalendarIcon className="w-6 h-6 text-gray-600" />
      </div>

      {dateFields.map((field, index) => {
        const leftPositions = ["left-[74px]", "left-[158px]", "left-[243px]"];
        const marginClass = field.label === "Day" ? "ml-0.5" : "";

        return (
          <div
            key={field.label}
            className={`absolute top-[5px] ${leftPositions[index]} ${field.width} h-[42px] flex flex-col gap-1`}
          >
            <div
              className={`${marginClass} w-[37px] h-[15px] [font-family:'Lexend',Helvetica] font-normal text-[#007c89] text-xs tracking-[0] leading-[normal]`}
            >
              {field.label}
            </div>
            <div
              className={`${field.placeholderWidth} h-[23px] [font-family:'Lexend',Helvetica] font-normal text-[#75c4cc66] text-lg tracking-[0] leading-[normal]`}
            >
              {field.placeholder}
            </div>
          </div>
        );
      })}

      <img
        className="absolute top-[22px] left-[211px] w-[11px] h-8"
        alt="Line"
        src="/line-2.svg"
      />

      <img
        className="absolute top-[22px] left-[129px] w-[11px] h-8"
        alt="Line"
        src="/line-2.svg"
      />

      <img
        className="absolute top-[50px] left-[74px] w-8 h-px object-cover"
        alt="Line"
        src="/line-4.svg"
      />

      <img
        className="absolute top-[50px] left-[158px] w-[27px] h-px object-cover"
        alt="Line"
        src="/line-5.svg"
      />

      <img
        className="absolute top-[50px] left-[243px] w-12 h-px object-cover"
        alt="Line"
        src="/line-6.svg"
      />
    </div>
  );
};
