import React from 'react';
import { Button } from '../../../components/ui/button';
import { LocationInput } from '../../../components/ui/LocationInput';
import { DistanceDisplay } from '../../../components/ui/DistanceDisplay';
import { useDistanceCalculation } from '../../../hooks/useDistanceCalculation';

interface LocationStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onCancel: () => void;
  onSaveProgress: () => void;
}

export const LocationStep: React.FC<LocationStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onCancel,
  onSaveProgress,
}) => {
  const { result, loading, error } = useDistanceCalculation(
    formData.pickupAddress,
    formData.dropoffAddress
  );

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 px-16 py-12 overflow-y-auto">
        <h2 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-[32px] mb-2">
          Create a New Quote
        </h2>
        <p className="[font-family:'Lexend',Helvetica] text-black text-lg mb-12">
          Enter the pickup and dropoff locations for distance calculation.
        </p>

        <div className="max-w-3xl space-y-8">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="mb-6">
              <LocationInput
                label="Pickup Location"
                value={formData.pickupAddress}
                onChange={(value) => updateFormData({ pickupAddress: value })}
                placeholder="Enter pickup address"
                onLocationSelect={(address) => updateFormData({ pickupAddress: address })}
              />
            </div>

            <div className="mb-6">
              <LocationInput
                label="Dropoff Location"
                value={formData.dropoffAddress}
                onChange={(value) => updateFormData({ dropoffAddress: value })}
                placeholder="Enter dropoff address"
                onLocationSelect={(address) => updateFormData({ dropoffAddress: address })}
              />
            </div>

            {(result || loading || error) && (
              <DistanceDisplay
                distance={result?.distance}
                duration={result?.duration}
                loading={loading}
                error={error || undefined}
              />
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="[font-family:'Lexend',Helvetica] text-sm text-blue-800">
              <strong>Note:</strong> The distance will be automatically calculated as you type.
              This information can be used for travel cost estimation in your quote.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-16 py-6 border-t bg-white">
        <Button
          onClick={onCancel}
          className="bg-white hover:bg-gray-50 text-black border-2 border-black px-8 py-3 rounded-lg [font-family:'Lexend',Helvetica] font-semibold"
        >
          Cancel
        </Button>

        <Button
          onClick={onSaveProgress}
          className="bg-white hover:bg-gray-50 text-black border-2 border-[#75c4cc] px-8 py-3 rounded-lg [font-family:'Lexend',Helvetica] font-semibold"
        >
          Save Progress
        </Button>

        <Button
          onClick={onNext}
          className="bg-[#023c97] hover:bg-[#022d70] text-white px-12 py-3 rounded-lg [font-family:'Lexend',Helvetica] font-semibold"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
