import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Plus, Minus, ChevronUp, ChevronDown } from "lucide-react";

interface ProjectInfoStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onCancel: () => void;
  onSaveProgress: () => void;
}

export const ProjectInfoStep: React.FC<ProjectInfoStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onCancel,
  onSaveProgress,
}) => {
  const [expandedDay, setExpandedDay] = useState<number>(0);

  const updateDeliverableCount = (change: number) => {
    const newCount = Math.max(
      1,
      Math.min(7, formData.numberOfDeliverables + change)
    );
    const newDeliverables = [...formData.deliverables];
    while (newDeliverables.length < newCount) {
      newDeliverables.push({ hours: 0, minutes: 0 });
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

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 px-16 py-12 overflow-y-auto">
        <h2 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-[32px] mb-2">
          Create a New Quote
        </h2>
        <p className="[font-family:'Lexend',Helvetica] text-black text-lg mb-12">
          Next fill out the project details.
        </p>

        <h3 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-[25px] mb-6">
          Project Information
        </h3>

        <div className="bg-[#d4e8ea] rounded-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#023c97] text-white px-4 py-2 rounded [font-family:'Lexend',Helvetica] font-bold text-lg flex items-center gap-2">
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
                  className="w-12 h-12 bg-[#75c4cc] hover:bg-[#65b4bc] rounded-lg flex items-center justify-center"
                >
                  <Minus className="w-6 h-6 text-black" />
                </Button>
                <div className="w-20 h-12 bg-white rounded-lg flex items-center justify-center [font-family:'Lexend',Helvetica] font-bold text-2xl">
                  {formData.numberOfDeliverables}
                </div>
                <Button
                  onClick={() => updateDeliverableCount(1)}
                  className="w-12 h-12 bg-[#023c97] hover:bg-[#022d70] rounded-lg flex items-center justify-center"
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
                <div className="grid grid-cols-3 gap-4 text-center [font-family:'Lexend',Helvetica] text-sm text-gray-600 font-semibold">
                  <div>Deliverable</div>
                  <div>Hours</div>
                  <div>Minutes</div>
                </div>
                {formData.deliverables.map((deliverable: any, index: number) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-center">
                    <div className="bg-[#75c4cc] text-center py-2 rounded-lg [font-family:'Lexend',Helvetica] font-bold">
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#d4e8ea] rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#023c97] text-white px-4 py-2 rounded [font-family:'Lexend',Helvetica] font-bold text-lg flex items-center gap-2">
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
                className="w-12 h-12 bg-[#75c4cc] hover:bg-[#65b4bc] rounded-lg flex items-center justify-center"
              >
                <Minus className="w-6 h-6 text-black" />
              </Button>
              <div className="w-32 h-12 bg-white rounded-lg flex items-center justify-center [font-family:'Lexend',Helvetica] font-bold text-2xl">
                {formData.filmingDays}
              </div>
              <Button
                onClick={() => updateFilmingDays(1)}
                className="w-12 h-12 bg-[#023c97] hover:bg-[#022d70] rounded-lg flex items-center justify-center"
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
                      <div className="bg-[#75c4cc] px-6 py-2 rounded [font-family:'Lexend',Helvetica] font-bold text-lg">
                        Day {dayIndex + 1}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 [font-family:'Lexend',Helvetica]">
                        <span className="text-sm">Month</span>
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
                        <span className="text-sm">Day</span>
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
                        <span className="text-sm">Year</span>
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
                      <div>
                        <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-base mb-3 block">
                          Hours
                        </Label>
                        <div className="flex items-center gap-4">
                          <span className="[font-family:'Lexend',Helvetica]">Hours</span>
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
                            className="w-20 h-10 text-center border-2 border-gray-300 rounded-lg [font-family:'Lexend',Helvetica] text-lg"
                          />
                          <span>:</span>
                          <span className="[font-family:'Lexend',Helvetica]">Minutes</span>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={detail.minutes}
                            onChange={(e) =>
                              updateFilmingDetail(
                                dayIndex,
                                "minutes",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-20 h-10 text-center border-2 border-gray-300 rounded-lg [font-family:'Lexend',Helvetica] text-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-base mb-3 block">
                          Location
                        </Label>
                        <div className="space-y-4">
                          {detail.locations.map(
                            (location: any, locationIndex: number) => (
                              <div key={locationIndex} className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 flex items-center gap-3 border-2 border-gray-300 rounded-lg px-4 py-2">
                                    <svg
                                      width="20"
                                      height="20"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                                        stroke="#5a5a5a"
                                        strokeWidth="2"
                                      />
                                      <circle
                                        cx="12"
                                        cy="10"
                                        r="3"
                                        stroke="#5a5a5a"
                                        strokeWidth="2"
                                      />
                                    </svg>
                                    <input
                                      type="text"
                                      placeholder={
                                        locationIndex === 0
                                          ? "123 Address City"
                                          : "Additional location"
                                      }
                                      value={location.address}
                                      onChange={(e) =>
                                        updateLocation(
                                          dayIndex,
                                          locationIndex,
                                          "address",
                                          e.target.value
                                        )
                                      }
                                      className="flex-1 outline-none [font-family:'Lexend',Helvetica] text-base"
                                    />
                                  </div>
                                  <button className="p-2 hover:bg-gray-100 rounded">
                                    <svg
                                      width="20"
                                      height="20"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                    >
                                      <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="#5a5a5a"
                                        strokeWidth="2"
                                      />
                                      <path
                                        d="M12 8v8m-4-4h8"
                                        stroke="#5a5a5a"
                                        strokeWidth="2"
                                      />
                                    </svg>
                                  </button>
                                </div>
                                <div className="flex items-center justify-between pl-4">
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
                                          "miles",
                                          parseInt(e.target.value) || 0
                                        )
                                      }
                                      className="w-20 h-8 text-center border border-gray-300 rounded [font-family:'Lexend',Helvetica]"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="[font-family:'Lexend',Helvetica] text-sm">
                                      Does this require setup?
                                    </span>
                                    <label className="flex items-center gap-2">
                                      <input
                                        type="radio"
                                        name={`setup-${dayIndex}-${locationIndex}`}
                                        checked={location.requiresSetup === true}
                                        onChange={() =>
                                          updateLocation(
                                            dayIndex,
                                            locationIndex,
                                            "requiresSetup",
                                            true
                                          )
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
                                          updateLocation(
                                            dayIndex,
                                            locationIndex,
                                            "requiresSetup",
                                            false
                                          )
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
                            )
                          )}
                          <button
                            onClick={() => addLocation(dayIndex)}
                            className="text-[#023c97] [font-family:'Lexend',Helvetica] font-semibold text-sm flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add more location
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 px-16 py-8 border-t border-gray-200">
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
          className="h-[50px] px-8 rounded-lg bg-[#023c97] hover:bg-[#022d70] [font-family:'Lexend',Helvetica] font-bold text-white text-xl"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
