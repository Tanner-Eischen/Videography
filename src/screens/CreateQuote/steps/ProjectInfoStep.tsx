import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Plus, Minus, ChevronUp, ChevronDown } from "lucide-react";
import { LocationWithDistance } from "../components/LocationWithDistance";

interface ProjectInfoStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onBack?: () => void;
  onCancel: () => void;
  onSaveProgress: () => void;
}

export const ProjectInfoStep: React.FC<ProjectInfoStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
  onCancel,
  onSaveProgress,
}) => {
  const [expandedDay, setExpandedDay] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const updateDeliverableCount = (change: number) => {
    const newCount = Math.max(
      1,
      Math.min(7, formData.numberOfDeliverables + change)
    );
    const newDeliverables = [...formData.deliverables];
    while (newDeliverables.length < newCount) {
      newDeliverables.push({ hours: 0, minutes: 0, seconds: 0 });
    }
    updateFormData({
      numberOfDeliverables: newCount,
      deliverables: newDeliverables.slice(0, newCount),
    });
  };

  const updateFilmingDays = (change: number) => {
    const newCount = Math.max(1, Math.min(7, formData.filmingDays + change));
    const newDetails = [...formData.filmingDetails];
    while (newDetails.length < newCount) {
      newDetails.push({
        date: { month: "", day: "", year: "" },
        hours: 0,
        minutes: 0,
        locations: [{ address: "", miles: 0, requiresSetup: false }],
      });
    }
    updateFormData({
      filmingDays: newCount,
      filmingDetails: newDetails.slice(0, newCount),
    });
  };

  const updateDeliverable = (index: number, field: string, value: number) => {
    const newDeliverables = [...formData.deliverables];
    newDeliverables[index] = { ...newDeliverables[index], [field]: value };
    updateFormData({ deliverables: newDeliverables });
  };

  const updateFilmingDetail = (dayIndex: number, field: string, value: any) => {
    const newDetails = [...formData.filmingDetails];
    newDetails[dayIndex] = { ...newDetails[dayIndex], [field]: value };
    updateFormData({ filmingDetails: newDetails });
  };

  const addLocation = (dayIndex: number) => {
    const newDetails = [...formData.filmingDetails];
    newDetails[dayIndex].locations.push({
      address: "",
      miles: 0,
      requiresSetup: false,
    });
    updateFormData({ filmingDetails: newDetails });
  };

  const updateLocation = (
    dayIndex: number,
    locationIndex: number,
    field: string,
    value: any
  ) => {
    const newDetails = [...formData.filmingDetails];
    newDetails[dayIndex].locations[locationIndex] = {
      ...newDetails[dayIndex].locations[locationIndex],
      [field]: value,
    };
    updateFormData({ filmingDetails: newDetails });
  };

  const removeLocation = (dayIndex: number, locationIndex: number) => {
    const newDetails = [...formData.filmingDetails];
    if (newDetails[dayIndex].locations.length > 1) {
      newDetails[dayIndex].locations.splice(locationIndex, 1);
      updateFormData({ filmingDetails: newDetails });
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 px-4 md:px-16 py-6 md:py-12 overflow-y-auto">
        <h3 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-[32px] mb-8">
          Project Information
        </h3>

        <div className="bg-[#d4e8ea] rounded-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#0050c8] text-white px-4 py-2 rounded [font-family:'Lexend',Helvetica] font-bold text-lg flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20 6H4V4h16v2zm-2 4H6v2h12v-2zm-2 6H8v2h8v-2z" />
              </svg>
              Deliverables
            </div>
          </div>

          <div className="flex items-start gap-12">
            <div>
              <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-base mb-3 block">
                Number of Deliverables (1-7)
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => updateDeliverableCount(-1)}
                  className="w-12 h-12 bg-[#8dd3dc] hover:bg-[#7cc5d0] rounded-lg flex items-center justify-center"
                >
                  <Minus className="w-6 h-6 text-black" />
                </Button>
                <div className="w-20 h-12 bg-white rounded-lg flex items-center justify-center [font-family:'Lexend',Helvetica] font-bold text-2xl">
                  {formData.numberOfDeliverables}
                </div>
                <Button
                  onClick={() => updateDeliverableCount(1)}
                  className="w-12 h-12 bg-[#0050c8] hover:bg-[#003d99] rounded-lg flex items-center justify-center"
                >
                  <Plus className="w-6 h-6 text-white" />
                </Button>
              </div>
            </div>

            <div className="flex-1">
              <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-base mb-3 block">
                Average Length per Deliverable
              </Label>
              <div className="bg-white rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-4 gap-4 text-center [font-family:'Lexend',Helvetica] text-sm text-gray-600 font-semibold">
                  <div>Deliverable</div>
                  <div>Hours</div>
                  <div>Minutes</div>
                  <div>Seconds</div>
                </div>
                {formData.deliverables.map((deliverable: any, index: number) => (
                  <div key={index} className="grid grid-cols-4 gap-4 items-center">
                    <div className="bg-[#8dd3dc] text-center py-2 rounded-lg [font-family:'Lexend',Helvetica] font-bold">
                      {index + 1}
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={deliverable.hours}
                      onChange={(e) =>
                        updateDeliverable(index, "hours", parseInt(e.target.value) || 0)
                      }
                      className="h-10 text-center border-2 border-gray-300 rounded-lg [font-family:'Lexend',Helvetica] text-lg"
                    />
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={deliverable.minutes}
                      onChange={(e) =>
                        updateDeliverable(
                          index,
                          "minutes",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="h-10 text-center border-2 border-gray-300 rounded-lg [font-family:'Lexend',Helvetica] text-lg"
                    />
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={deliverable.seconds || 0}
                      onChange={(e) =>
                        updateDeliverable(
                          index,
                          "seconds",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="h-10 text-center border-2 border-gray-300 rounded-lg [font-family:'Lexend',Helvetica] text-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#d4e8ea] rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#0050c8] text-white px-4 py-2 rounded [font-family:'Lexend',Helvetica] font-bold text-lg flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
              </svg>
              Filming
            </div>
          </div>

          <div className="mb-6">
            <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-base mb-3 block">
              Filming Days (1-7)
            </Label>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => updateFilmingDays(-1)}
                className="w-12 h-12 bg-[#8dd3dc] hover:bg-[#7cc5d0] rounded-lg flex items-center justify-center"
              >
                <Minus className="w-6 h-6 text-black" />
              </Button>
              <div className="w-32 h-12 bg-white rounded-lg flex items-center justify-center [font-family:'Lexend',Helvetica] font-bold text-2xl">
                {formData.filmingDays}
              </div>
              <Button
                onClick={() => updateFilmingDays(1)}
                className="w-12 h-12 bg-[#0050c8] hover:bg-[#003d99] rounded-lg flex items-center justify-center"
              >
                <Plus className="w-6 h-6 text-white" />
              </Button>
            </div>
          </div>

          <div>
            <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-base mb-4 block">
              Filming Details
            </Label>
            <div className="space-y-4">
              {formData.filmingDetails.map((detail: any, dayIndex: number) => (
                <div key={dayIndex} className="bg-white rounded-xl overflow-hidden">
                  <button
                    onClick={() =>
                      setExpandedDay(expandedDay === dayIndex ? -1 : dayIndex)
                    }
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-[#8dd3dc] px-6 py-2 rounded [font-family:'Lexend',Helvetica] font-bold text-lg">
                        Day {dayIndex + 1}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 [font-family:'Lexend',Helvetica]">
                        <input
                          type="text"
                          placeholder="MM"
                          value={detail.date.month}
                          onChange={(e) =>
                            updateFilmingDetail(dayIndex, "date", {
                              ...detail.date,
                              month: e.target.value,
                            })
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-12 text-center border border-gray-300 rounded px-2 py-1"
                          maxLength={2}
                        />
                        <span>/</span>
                        <input
                          type="text"
                          placeholder="DD"
                          value={detail.date.day}
                          onChange={(e) =>
                            updateFilmingDetail(dayIndex, "date", {
                              ...detail.date,
                              day: e.target.value,
                            })
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-12 text-center border border-gray-300 rounded px-2 py-1"
                          maxLength={2}
                        />
                        <span>/</span>
                        <input
                          type="text"
                          placeholder="YYYY"
                          value={detail.date.year}
                          onChange={(e) =>
                            updateFilmingDetail(dayIndex, "date", {
                              ...detail.date,
                              year: e.target.value,
                            })
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                          maxLength={4}
                        />
                      </div>
                    </div>
                    {expandedDay === dayIndex ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </button>

                  {expandedDay === dayIndex && (
                    <div className="p-6 border-t space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
                          <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-base mb-3 block">
                            Hours
                          </Label>
                          <input
                            type="number"
                            min="0"
                            value={detail.hours}
                            onChange={(e) =>
                              updateFilmingDetail(
                                dayIndex,
                                "hours",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-full h-12 text-center border-2 border-gray-300 rounded-lg [font-family:'Lexend',Helvetica] text-lg bg-white"
                          />
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
                          <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-base mb-3 block">
                            Crew per Setup
                          </Label>
                          <input
                            type="number"
                            min="1"
                            max="7"
                            value={formData.crewPerSetup || ''}
                            onChange={(e) =>
                              updateFormData({
                                crewPerSetup: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-full h-12 text-center border-2 border-gray-300 rounded-lg [font-family:'Lexend',Helvetica] text-lg bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-base mb-3 block">
                          Location
                        </Label>
                        <div className="space-y-4">
                          {detail.locations.map(
                            (location: any, locationIndex: number) => {
                              const previousAddress = locationIndex > 0
                                ? detail.locations[locationIndex - 1].address
                                : '';

                              return (
                                <div key={locationIndex} className="relative">
                                  <LocationWithDistance
                                    locationIndex={locationIndex}
                                    dayIndex={dayIndex}
                                    location={location}
                                    previousAddress={previousAddress}
                                    updateLocation={updateLocation}
                                  />
                                  {detail.locations.length > 1 && (
                                    <button
                                      onClick={() => removeLocation(dayIndex, locationIndex)}
                                      className="absolute top-2 right-2 text-red-600 hover:text-red-800 bg-white rounded-full p-1 shadow-md"
                                      title="Remove location"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              );
                            }
                          )}
                          <button
                            onClick={() => addLocation(dayIndex)}
                            className="text-[#023c97] [font-family:'Lexend',Helvetica] font-semibold text-sm flex items-center gap-2 pl-8"
                          >
                            <Plus className="w-4 h-4" />
                            Add next location
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <div className="bg-[#0050c8] text-white px-4 py-2 rounded-lg [font-family:'Lexend',Helvetica] font-bold text-base flex items-center gap-2">
                          <span>Total Miles:</span>
                          <span>
                            {detail.locations.reduce((sum: number, location: any, idx: number) => {
                              return idx > 0 ? sum + (location.miles || 0) : sum;
                            }, 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#d4e8ea] rounded-xl p-8 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#0050c8] text-white px-4 py-2 rounded [font-family:'Lexend',Helvetica] font-bold text-lg flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Pricing Configuration
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-base">
                  Weight (Production to Profit) (40-100%)
                </Label>
              </div>
              <div className="flex justify-between text-xs [font-family:'Lexend',Helvetica] text-gray-600 mb-2">
                <span>40%</span>
                <span>55%</span>
                <span>70%</span>
                <span>85%</span>
                <span>100%</span>
              </div>
              <div
                className="relative h-12 flex items-center rounded-lg overflow-visible border-2 border-gray-300 cursor-pointer"
                onMouseDown={(e) => {
                  setIsDragging(true);
                  e.preventDefault();

                  const rect = e.currentTarget.getBoundingClientRect();

                  const handleMove = (moveEvent: MouseEvent) => {
                    const x = moveEvent.clientX - rect.left;
                    const percentage = 40 + ((x / rect.width) * 60);
                    const newWeight = Math.round(Math.max(40, Math.min(100, percentage)));
                    updateFormData({ weight: newWeight });
                  };

                  const handleUp = () => {
                    setIsDragging(false);
                    document.removeEventListener('mousemove', handleMove);
                    document.removeEventListener('mouseup', handleUp);
                  };

                  // Initial position update
                  const x = e.clientX - rect.left;
                  const percentage = 40 + ((x / rect.width) * 60);
                  const newWeight = Math.round(Math.max(40, Math.min(100, percentage)));
                  updateFormData({ weight: newWeight });

                  document.addEventListener('mousemove', handleMove);
                  document.addEventListener('mouseup', handleUp);
                }}
              >
                <div className="absolute left-0 top-0 h-full w-full bg-[#8dd3dc] rounded-md"></div>
                <div
                  className="absolute top-0 h-full bg-[#4a4a4a] rounded-r-md"
                  style={{
                    left: `${((formData.weight || 60) - 40) * (100 / 60)}%`,
                    width: `${(100 - (formData.weight || 60)) * (100 / 60)}%`
                  }}
                />
                <div
                  className="absolute top-0 h-full w-1 bg-white shadow-lg transition-none"
                  style={{
                    left: `${((formData.weight || 60) - 40) * (100 / 60)}%`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-8 bg-white rounded-md shadow-lg border-2 border-gray-300 flex items-center justify-center transition-none">
                    <div className="flex flex-col gap-1">
                      <div className="w-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="w-3 h-0.5 bg-gray-400 rounded"></div>
                      <div className="w-3 h-0.5 bg-gray-400 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 w-full flex items-center justify-between px-4 pointer-events-none">
                  <span className="[font-family:'Lexend',Helvetica] text-sm font-bold text-white">Production Cost</span>
                  <span className="[font-family:'Lexend',Helvetica] text-sm font-bold text-white">Profit (+other expense)</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 mt-4">
                <Label className="[font-family:'Lexend',Helvetica] text-sm text-gray-700">
                  Manual Input:
                </Label>
                <input
                  type="number"
                  min="40"
                  max="100"
                  value={formData.weight || 60}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 60;
                    const clampedValue = Math.max(40, Math.min(100, value));
                    updateFormData({ weight: clampedValue });
                  }}
                  className="w-20 h-10 px-3 text-center border-2 border-gray-300 rounded-lg [font-family:'Lexend',Helvetica] text-base bg-white"
                />
                <span className="[font-family:'Lexend',Helvetica] text-sm text-gray-700">%</span>
              </div>
              <div className="text-center mt-2 [font-family:'Lexend',Helvetica] text-xs text-gray-600">
                Defaults to 60% profit
              </div>
            </div>

            <div>
              <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-base mb-3 block">
                Discount (0-20%)
              </Label>
              <input
                type="number"
                min="0"
                max="20"
                value={formData.discount || ''}
                onChange={(e) =>
                  updateFormData({
                    discount: Math.min(20, Math.max(0, parseInt(e.target.value) || 0)),
                  })
                }
                className="w-full h-12 px-4 border-2 border-gray-300 rounded-lg [font-family:'Lexend',Helvetica] text-lg bg-white"
                placeholder="Enter discount percentage"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="rushFee"
                  checked={formData.rushFee || false}
                  onChange={(e) => updateFormData({ rushFee: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-[#023c97] focus:ring-[#023c97]"
                />
                <Label htmlFor="rushFee" className="[font-family:'Lexend',Helvetica] font-bold text-black text-base cursor-pointer">
                  Apply Rush Fee
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="highTrafficFee"
                  checked={formData.highTrafficFee || false}
                  onChange={(e) => updateFormData({ highTrafficFee: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-[#023c97] focus:ring-[#023c97]"
                />
                <Label htmlFor="highTrafficFee" className="[font-family:'Lexend',Helvetica] font-bold text-black text-base cursor-pointer">
                  Apply High Traffic Fee
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-4 px-4 md:px-16 py-6 md:py-8 border-t border-gray-200">
        <div>
          {onBack && (
            <Button
              onClick={onBack}
              className="h-[50px] px-8 rounded-lg bg-[#5a5a5a] hover:bg-[#4a4a4a] [font-family:'Lexend',Helvetica] font-bold text-white text-xl"
            >
              Back
            </Button>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <Button
            onClick={onCancel}
            className="h-[50px] px-8 rounded-lg bg-[#5a5a5a] hover:bg-[#4a4a4a] [font-family:'Lexend',Helvetica] font-bold text-white text-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={onSaveProgress}
            className="h-[50px] px-8 rounded-lg bg-[#007c89] hover:bg-[#006670] [font-family:'Lexend',Helvetica] font-bold text-white text-xl"
          >
            Save Progress
          </Button>
          <Button
            onClick={onNext}
            className="h-[50px] px-8 rounded-lg bg-[#0050c8] hover:bg-[#003d99] [font-family:'Lexend',Helvetica] font-bold text-white text-xl"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
