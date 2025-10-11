import React, { useEffect } from 'react';
import { LocationInput } from '../../../components/ui/LocationInput';
import { useDistanceCalculation } from '../../../hooks/useDistanceCalculation';
import { ArrowDownRight, Clock } from 'lucide-react';

interface LocationWithDistanceProps {
  locationIndex: number;
  dayIndex: number;
  location: {
    address: string;
    miles: number;
    requiresSetup: boolean;
  };
  previousAddress: string;
  updateLocation: (
    dayIndex: number,
    locationIndex: number,
    field: string,
    value: any
  ) => void;
}

export const LocationWithDistance: React.FC<LocationWithDistanceProps> = ({
  locationIndex,
  dayIndex,
  location,
  previousAddress,
  updateLocation,
}) => {
  const { distance, result, loading } = useDistanceCalculation(
    previousAddress,
    location.address,
    { debounceMs: 1500, includeMetrics: true }
  );

  useEffect(() => {
    if (distance !== null && distance !== location.miles) {
      updateLocation(dayIndex, locationIndex, 'miles', distance);
    }
  }, [distance, dayIndex, locationIndex, location.miles, updateLocation]);

  const isFirstLocation = locationIndex === 0;

  return (
    <div className="space-y-3">
      {isFirstLocation ? (
        <>
          <div>
            <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-600 mb-2">
              Starting Location
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <LocationInput
                  value={location.address}
                  onChange={(value) =>
                    updateLocation(dayIndex, locationIndex, 'address', value)
                  }
                  placeholder="123 Address City"
                  onLocationSelect={(address) =>
                    updateLocation(dayIndex, locationIndex, 'address', address)
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
              <span className="[font-family:'Lexend',Helvetica] text-sm">
                Setup required?
              </span>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`setup-${dayIndex}-${locationIndex}`}
                  checked={location.requiresSetup === true}
                  onChange={() =>
                    updateLocation(dayIndex, locationIndex, 'requiresSetup', true)
                  }
                  className="w-4 h-4"
                />
                <span className="[font-family:'Lexend',Helvetica] text-sm">
                  Yes
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`setup-${dayIndex}-${locationIndex}`}
                  checked={location.requiresSetup === false}
                  onChange={() =>
                    updateLocation(dayIndex, locationIndex, 'requiresSetup', false)
                  }
                  className="w-4 h-4"
                />
                <span className="[font-family:'Lexend',Helvetica] text-sm">
                  No
                </span>
              </label>
            </div>
          </div>
        </>
      ) : (
        <div className="relative">
          <div className="absolute left-0 top-0 h-12 border-l-2 border-b-2 border-[#003D82] rounded-bl-lg" style={{ width: '32px', left: '0px' }}>
            <div className="absolute right-0 top-full -mt-1.5 -mr-0.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 6L12 6L7 11L7 1L12 6Z" fill="#003D82"/>
              </svg>
            </div>
          </div>

          <div className="pl-12 space-y-3">
            <div className="relative bg-gradient-to-r from-blue-50 to-transparent border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-blue-300">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-[#003D82] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="[font-family:'Lexend',Helvetica] font-bold text-[#003D82] text-lg">
                      {location.miles}
                    </span>
                  )}
                  <span className="[font-family:'Lexend',Helvetica] text-xs font-medium text-gray-600">
                    {loading ? 'calculating...' : 'miles to'}
                  </span>
                </div>
                {!loading && result?.duration && (
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-blue-300">
                    <Clock className="w-4 h-4 text-[#003D82]" />
                    <span className="[font-family:'Lexend',Helvetica] text-sm text-gray-700">
                      {result.duration.text}
                    </span>
                  </div>
                )}
              </div>

              <LocationInput
                value={location.address}
                onChange={(value) =>
                  updateLocation(dayIndex, locationIndex, 'address', value)
                }
                placeholder="Next location address"
                onLocationSelect={(address) =>
                  updateLocation(dayIndex, locationIndex, 'address', address)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="[font-family:'Lexend',Helvetica] text-sm text-gray-600">
                  Setup required?
                </span>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`setup-${dayIndex}-${locationIndex}`}
                    checked={location.requiresSetup === true}
                    onChange={() =>
                      updateLocation(dayIndex, locationIndex, 'requiresSetup', true)
                    }
                    className="w-4 h-4"
                  />
                  <span className="[font-family:'Lexend',Helvetica] text-sm">
                    Yes
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`setup-${dayIndex}-${locationIndex}`}
                    checked={location.requiresSetup === false}
                    onChange={() =>
                      updateLocation(dayIndex, locationIndex, 'requiresSetup', false)
                    }
                    className="w-4 h-4"
                  />
                  <span className="[font-family:'Lexend',Helvetica] text-sm">
                    No
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
