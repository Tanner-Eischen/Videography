import React from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

interface ClientInfoStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onCancel: () => void;
  onSaveProgress: () => void;
}

export const ClientInfoStep: React.FC<ClientInfoStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onCancel,
  onSaveProgress,
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 px-4 md:px-16 py-6 md:py-12">
        <h3 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-[32px] mb-8">
          Client Information
        </h3>

        <div className="space-y-8 max-w-4xl">
          <div>
            <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg mb-3 block">
              Full Name
            </Label>
            <Input
              value={formData.fullName}
              onChange={(e) => updateFormData({ fullName: e.target.value })}
              placeholder="Jane Doe"
              className="h-[60px] rounded-xl border-2 border-[#5a5a5a] [font-family:'Lexend',Helvetica] text-lg px-6"
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg mb-3 block">
                Project Start Date
              </Label>
              <div className="flex items-center gap-3 bg-white border-2 border-[#5a5a5a] rounded-xl h-[60px] px-6">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
                    stroke="#5a5a5a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 2V6"
                    stroke="#5a5a5a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 2V6"
                    stroke="#5a5a5a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 10H21"
                    stroke="#5a5a5a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-gray-500"></span>
                  <input
                    type="text"
                    placeholder="MM"
                    value={formData.projectStartDate.month}
                    onChange={(e) =>
                      updateFormData({
                        projectStartDate: {
                          ...formData.projectStartDate,
                          month: e.target.value,
                        },
                      })
                    }
                    className="w-12 [font-family:'Lexend',Helvetica] text-lg outline-none"
                    maxLength={2}
                  />
                  <span className="text-gray-400">/</span>
                  <span className="text-sm text-gray-500"></span>
                  <input
                    type="text"
                    placeholder="DD"
                    value={formData.projectStartDate.day}
                    onChange={(e) =>
                      updateFormData({
                        projectStartDate: {
                          ...formData.projectStartDate,
                          day: e.target.value,
                        },
                      })
                    }
                    className="w-12 [font-family:'Lexend',Helvetica] text-lg outline-none"
                    maxLength={2}
                  />
                  <span className="text-gray-400">/</span>
                  <span className="text-sm text-gray-500"></span>
                  <input
                    type="text"
                    placeholder="YYYY"
                    value={formData.projectStartDate.year}
                    onChange={(e) =>
                      updateFormData({
                        projectStartDate: {
                          ...formData.projectStartDate,
                          year: e.target.value,
                        },
                      })
                    }
                    className="w-16 [font-family:'Lexend',Helvetica] text-lg outline-none"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg mb-3 block">
                Project End Date
              </Label>
              <div className="flex items-center gap-3 bg-white border-2 border-[#5a5a5a] rounded-xl h-[60px] px-6">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
                    stroke="#5a5a5a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 2V6"
                    stroke="#5a5a5a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 2V6"
                    stroke="#5a5a5a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 10H21"
                    stroke="#5a5a5a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-gray-500"></span>
                  <input
                    type="text"
                    placeholder="MM"
                    value={formData.projectEndDate.month}
                    onChange={(e) =>
                      updateFormData({
                        projectEndDate: {
                          ...formData.projectEndDate,
                          month: e.target.value,
                        },
                      })
                    }
                    className="w-12 [font-family:'Lexend',Helvetica] text-lg outline-none"
                    maxLength={2}
                  />
                  <span className="text-gray-400">/</span>
                  <span className="text-sm text-gray-500"></span>
                  <input
                    type="text"
                    placeholder="DD"
                    value={formData.projectEndDate.day}
                    onChange={(e) =>
                      updateFormData({
                        projectEndDate: {
                          ...formData.projectEndDate,
                          day: e.target.value,
                        },
                      })
                    }
                    className="w-12 [font-family:'Lexend',Helvetica] text-lg outline-none"
                    maxLength={2}
                  />
                  <span className="text-gray-400">/</span>
                  <span className="text-sm text-gray-500"></span>
                  <input
                    type="text"
                    placeholder="YYYY"
                    value={formData.projectEndDate.year}
                    onChange={(e) =>
                      updateFormData({
                        projectEndDate: {
                          ...formData.projectEndDate,
                          year: e.target.value,
                        },
                      })
                    }
                    className="w-16 [font-family:'Lexend',Helvetica] text-lg outline-none"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg mb-3 block">
              Contact Email
            </Label>
            <Input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => updateFormData({ contactEmail: e.target.value })}
              placeholder="janedoe@email.com"
              className="h-[60px] rounded-xl border-2 border-[#5a5a5a] [font-family:'Lexend',Helvetica] text-lg px-6"
            />
          </div>

          <div>
            <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg mb-3 block">
             Client Phone Number
            </Label>
            <Input
              value={formData.clientPhoneNumber}
              onChange={(e) => updateFormData({ clientPhoneNumber: e.target.value })}
              placeholder="(xxx)xxx-xxxx"
              className="h-[60px] rounded-xl border-2 border-[#5a5a5a] [font-family:'Lexend',Helvetica] text-lg px-6"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 px-4 md:px-16 py-6 md:py-8 border-t border-gray-200">
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
