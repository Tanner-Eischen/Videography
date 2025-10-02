import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

export const NavigationSection = (): JSX.Element => {
  const navigationItems = [
    {
      id: "basic",
      title: "Basic",
      isSelected: true,
      icon: "check",
      bgColor: "bg-[#ffffff]",
      shadow: "shadow-[0px_4px_4px_#00000040]",
      fontWeight: "font-bold",
    },
    {
      id: "standard",
      title: "Standard",
      isSelected: false,
      icon: "2",
      bgColor: "bg-[#ffffff4c]",
      shadow: "",
      fontWeight: "font-normal",
    },
    {
      id: "premium",
      title: "Premium",
      isSelected: false,
      icon: "3",
      bgColor: "bg-[#ffffff4c]",
      shadow: "",
      fontWeight: "font-normal",
    },
  ];

  return (
    <nav className="flex flex-col w-[277px]">
      {navigationItems.map((item, index) => (
        <div key={item.id} className="flex flex-col">
          <Card
            className={`w-[277px] h-20 ${item.bgColor} rounded-[10px] ${item.shadow} border-0`}
          >
            <CardContent className="p-0 relative h-full">
              <div
                className={`absolute top-[25px] left-20 [font-family:'Lexend',Helvetica] ${item.fontWeight} text-[#023c97] text-[25px] tracking-[0] leading-[normal]`}
              >
                {item.title}
              </div>

              {item.icon === "check" ? (
                <img
                  className="absolute top-[18px] left-[19px] w-11 h-11"
                  alt="Group"
                  src="/group-26.png"
                />
              ) : (
                <div className="absolute top-[18px] left-[19px] w-[46px] h-11">
                  <div className="absolute top-0 left-0 w-11 h-11 bg-[#2cacba] rounded-[22px]" />
                  <div className="absolute top-1.5 left-[15px] [font-family:'Lexend',Helvetica] font-normal text-[#023c97] text-[25px] tracking-[0] leading-[normal]">
                    {item.icon}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {index < navigationItems.length - 1 && (
            <div className="ml-9 w-[9px] h-[100px] bg-[#2cacba]" />
          )}
        </div>
      ))}
    </nav>
  );
};
