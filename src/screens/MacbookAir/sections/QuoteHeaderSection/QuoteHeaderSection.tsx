import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";

export const QuoteHeaderSection = (): JSX.Element => {
  const navigationItems = [
    { label: "Dashboard", href: "#" },
    { label: "Create Quote", href: "#" },
    { label: "All Quotes", href: "#" },
  ];

  return (
    <header className="flex w-full items-center justify-between px-[60px] py-5 bg-[#007c89]">
      <div className="flex w-[61.12px] h-[61.12px] items-center gap-2.5 px-2 py-1 relative">
        <div className="absolute top-0 left-0 w-[61px] h-[61px] bg-white rounded-[30.56px]" />
        <img className="relative w-11 h-11" alt="V" src="/v.png" />
      </div>

      <nav className="inline-flex items-center gap-[50px] relative flex-[0_0_auto]">
        <div className="flex w-[403px] items-center justify-between relative">
          {navigationItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-fit h-auto font-normal [font-family:'Lexend',Helvetica] text-black text-lg tracking-[0] leading-[normal] hover:bg-transparent p-0"
            >
              {item.label}
            </Button>
          ))}
        </div>

        <Avatar className="w-[61px] h-[60px]">
          <AvatarImage src="/frame-87.svg" alt="User profile" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </nav>
    </header>
  );
};
