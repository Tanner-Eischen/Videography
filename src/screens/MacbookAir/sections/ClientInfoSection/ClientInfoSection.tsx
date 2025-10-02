import { CalendarIcon } from "lucide-react";
import React from "react";

export const ClientInfoSection = (): JSX.Element => {
  const dateFields = [
    {
      label: "Month",
      placeholder: "MM",
      width: "w-[41px]",
      leftPosition: "left-[74px]",
      underlineWidth: "w-8",
      underlineLeft: "left-[74px]",
    },
    {
      label: "Day",
      placeholder: "DD",
      width: "w-[31px]",
      leftPosition: "left-[158px]",
      underlineWidth: "w-[27px]",
      underlineLeft: "left-[158px]",
    },
    {
      label: "Year",
      placeholder: "YYYY",
      width: "w-[52px]",
      leftPosition: "left-[243px]",
      underlineWidth: "w-12",
      underlineLeft: "left-[243px]",
    },
  ];

  const separators = [{ left: "left-[129px]" }, { left: "left-[211px]" }];

  return (
    <div className="relative w-full h-[61px] rounded-xl border border-solid border-[#5a5a5a]">
      <div className="absolute top-[11px] left-[15px] w-10 h-10 bg-m3state-layerslightonsurfacevariantopacity-008 rounded-[5px] flex items-center justify-center">
        <img
          className="absolute right-0 bottom-0 w-[38px] h-7"
          alt="Ripple"
          src="/ripple.svg"
        />
        <CalendarIcon className="w-6 h-6 text-[#007c89]" />
      </div>

      {dateFields.map((field, index) => (
        <div
          key={index}
          className={`absolute top-[5px] ${field.leftPosition} ${field.width} h-[42px] flex flex-col gap-1`}
        >
          <div
            className={`${field.label === "Day" ? "ml-0.5 w-6" : field.label === "Year" ? "w-[27px]" : "w-[37px]"} h-[15px] [font-family:'Lexend',Helvetica] font-normal text-[#007c89] text-xs tracking-[0] leading-[normal]`}
          >
            {field.label}
          </div>
          <div
            className={`${field.placeholder === "DD" ? "w-[27px]" : field.placeholder === "YYYY" ? "w-12" : "w-8"} h-[23px] [font-family:'Lexend',Helvetica] font-normal text-[#75c4cc66] text-lg tracking-[0] leading-[normal]`}
          >
            {field.placeholder}
          </div>
        </div>
      ))}

      {separators.map((separator, index) => (
        <img
          key={index}
          className={`absolute top-[22px] ${separator.left} w-[11px] h-8`}
          alt="Line"
          src="/line-2.svg"
        />
      ))}

      {dateFields.map((field, index) => (
        <img
          key={index}
          className={`absolute top-[50px] ${field.underlineLeft} ${field.underlineWidth} h-px object-cover`}
          alt="Line"
          src={`/line-${index + 4}.svg`}
        />
      ))}
    </div>
  );
};
