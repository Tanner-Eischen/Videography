import React from "react";

interface FooterProps {
  bgColor?: string;
}

export const Footer: React.FC<FooterProps> = ({ bgColor = "bg-[#003D82]" }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${bgColor} py-8 px-8 mt-auto`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-3">
              About
            </h3>
            <p className="[font-family:'Lexend',Helvetica] text-white/80 text-sm leading-relaxed">
              Professional video production quote management system
            </p>
          </div>

          <div>
            <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-3">
              Contact
            </h3>
            <div className="space-y-2">
              <p className="[font-family:'Lexend',Helvetica] text-white/80 text-sm">
                Email: support@vidquo.com
              </p>
              <p className="[font-family:'Lexend',Helvetica] text-white/80 text-sm">
                Phone: (555) 123-4567
              </p>
            </div>
          </div>

          <div>
            <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-3">
              Resources
            </h3>
            <div className="space-y-2">
              <a
                href="#"
                className="[font-family:'Lexend',Helvetica] text-white/80 text-sm hover:text-white transition-colors block"
              >
                Help Center
              </a>
              <a
                href="#"
                className="[font-family:'Lexend',Helvetica] text-white/80 text-sm hover:text-white transition-colors block"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="[font-family:'Lexend',Helvetica] text-white/80 text-sm hover:text-white transition-colors block"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6">
          <p className="[font-family:'Lexend',Helvetica] text-white/60 text-sm text-center">
            {currentYear} VidQuo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
