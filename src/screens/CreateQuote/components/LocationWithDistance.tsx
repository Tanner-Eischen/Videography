import React, { useEffect } from 'react';
import { LocationInput } from '../../../components/ui/LocationInput';
import { useLocationDistance } from '../../../hooks/useLocationDistance';

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
  const { distance, loading } = useLocationDistance(
    previousAddress,
    location.address
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
          <div className="flex items-center justify-between pl-8">
            <div className="flex items-center gap-3">
              <span className="[font-family:'Lexend',Helvetica] text-sm">
                Miles
              </span>
              <input
                type="number"
                min="0"
                value={location.miles}
                onChange={(e) =>
                  updateLocation(
                    dayIndex,
                    locationIndex,
                    'miles',
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-20 h-8 text-center border border-gray-300 rounded [font-family:'Lexend',Helvetica]"
              />
            </div>
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
        <div className="pl-8">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <LocationInput
                value={location.address}
                onChange={(value) =>
                  updateLocation(dayIndex, locationIndex, 'address', value)
                }
                placeholder="Additional location"
                onLocationSelect={(address) =>
                  updateLocation(dayIndex, locationIndex, 'address', address)
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-between pl-0 mt-3">
            <div className="flex items-center gap-3">
              <span className="[font-family:'Lexend',Helvetica] text-sm">
                Miles
              </span>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={location.miles}
                  onChange={(e) =>
                    updateLocation(
                      dayIndex,
                      locationIndex,
                      'miles',
                      parseInt(e.target.value) || 0
                    )
                  }
                  className={`w-20 h-8 text-center border rounded [font-family:'Lexend',Helvetica] ${
                    loading
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                  readOnly={loading}
                />
                {loading && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
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
        </div>
      )}
    </div>
  );
};
