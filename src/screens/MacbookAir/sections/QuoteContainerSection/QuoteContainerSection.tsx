import React from "react";

export const QuoteContainerSection = (): JSX.Element => {
  return (
    <section className="flex flex-col w-full items-start gap-[11px] relative">
      <h1 className="relative self-stretch h-[50px] mt-[-1.00px] [font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-[40px] tracking-[0] leading-[normal]">
        Create a New Quote
      </h1>

      <p className="relative self-stretch h-[29px] [font-family:'Lexend',Helvetica] font-normal text-black text-[25px] tracking-[0] leading-[normal] whitespace-nowrap">
        Fill out client details below to start your quote.
      </p>
    </section>
  );
};
