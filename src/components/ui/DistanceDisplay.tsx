import React from 'react';
import { MapPin, Clock, Navigation } from 'lucide-react';

interface DistanceDisplayProps {
  distance?: {
    miles: number;
    km: number;
  };
  duration?: {
    minutes: number;
    text: string;
  };
  loading?: boolean;
  error?: string;
}

export const DistanceDisplay: React.FC<DistanceDisplayProps> = ({
  distance,
  duration,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="[font-family:'Lexend',Helvetica] text-sm font-medium">
            Calculating distance...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
        <div className="flex items-center gap-2 text-red-600">
          <MapPin className="w-5 h-5" />
          <span className="[font-family:'Lexend',Helvetica] text-sm font-medium">
            {error}
          </span>
        </div>
      </div>
    );
  }

  if (!distance) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-[#023c97] to-[#023c97]/90 border border-[#023c97] rounded-lg p-6 mt-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Navigation className="w-5 h-5 text-white" />
        <h3 className="[font-family:'Lexend',Helvetica] text-lg font-bold text-white">
          Route Information
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-[#75c4cc]" />
            <span className="[font-family:'Lexend',Helvetica] text-xs font-medium text-white/80">
              Distance
            </span>
          </div>
          <div className="[font-family:'Lexend',Helvetica] text-2xl font-bold text-white">
            {distance.miles.toFixed(1)} mi
          </div>
          <div className="[font-family:'Lexend',Helvetica] text-xs text-white/60 mt-1">
            {distance.km.toFixed(1)} km
          </div>
        </div>

        {duration && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-[#75c4cc]" />
              <span className="[font-family:'Lexend',Helvetica] text-xs font-medium text-white/80">
                Travel Time
              </span>
            </div>
            <div className="[font-family:'Lexend',Helvetica] text-2xl font-bold text-white">
              {duration.text}
            </div>
            <div className="[font-family:'Lexend',Helvetica] text-xs text-white/60 mt-1">
              ~{duration.minutes} minutes
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
