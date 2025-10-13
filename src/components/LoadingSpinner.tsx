import React from 'react';

export const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003D82] to-[#8FC4D4] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
        </div>
        <p className="[font-family:'Lexend',Helvetica] text-white text-xl font-semibold">
          {message}
        </p>
      </div>
    </div>
  );
};
