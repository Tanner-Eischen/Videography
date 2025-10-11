import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X, Plus, Minus, ChevronUp, ChevronDown } from 'lucide-react';

interface EditQuoteModalProps {
  quote: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditQuoteModal: React.FC<EditQuoteModalProps> = ({
  quote,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number>(-1);

  const initialFormData = quote?.form_data || {};
  const [formData, setFormData] = useState({
    client_name: quote?.client_name || '',
    client_email: quote?.client_email || '',
    client_phone: quote?.client_phone || '',
    project_start_date: quote?.project_start_date || '',
    project_end_date: quote?.project_end_date || '',
    status: quote?.status || 'pending',
    numberOfDeliverables: initialFormData.numberOfDeliverables || 1,
    deliverables: initialFormData.deliverables || [{ hours: 0, minutes: 0 }],
    filmingDays: initialFormData.filmingDays || 1,
    filmingDetails: initialFormData.filmingDetails || [
      {
        date: { month: '', day: '', year: '' },
        hours: 0,
        minutes: 0,
        locations: [{ address: '', miles: 0, requiresSetup: false }],
      },
    ],
    crewPerSetup: initialFormData.crewPerSetup || 0,
    weight: initialFormData.weight || 0,
    discount: initialFormData.discount || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedFormData = {
        ...quote.form_data,
        fullName: formData.client_name,
        contactEmail: formData.client_email,
        clientPhoneNumber: formData.client_phone,
        numberOfDeliverables: formData.numberOfDeliverables,
        deliverables: formData.deliverables,
        filmingDays: formData.filmingDays,
        filmingDetails: formData.filmingDetails,
        crewPerSetup: formData.crewPerSetup,
        weight: formData.weight,
        discount: formData.discount,
      };

      const { error } = await supabase
        .from('quotes')
        .update({
          client_name: formData.client_name,
          client_email: formData.client_email,
          client_phone: formData.client_phone,
          project_start_date: formData.project_start_date,
          project_end_date: formData.project_end_date,
          status: formData.status,
          form_data: updatedFormData,
        })
        .eq('id', quote.id);

      if (error) throw error;

      alert('Quote updated successfully!');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating quote:', error);
      alert('Failed to update quote');
    } finally {
      setLoading(false);
    }
  };

  const updateDeliverableCount = (change: number) => {
    const newCount = Math.max(1, Math.min(7, formData.numberOfDeliverables + change));
    const newDeliverables = [...formData.deliverables];
    while (newDeliverables.length < newCount) {
      newDeliverables.push({ hours: 0, minutes: 0 });
    }
    setFormData({
      ...formData,
      numberOfDeliverables: newCount,
      deliverables: newDeliverables.slice(0, newCount),
    });
  };

  const updateDeliverable = (index: number, field: string, value: number) => {
    const newDeliverables = [...formData.deliverables];
    newDeliverables[index] = { ...newDeliverables[index], [field]: value };
    setFormData({ ...formData, deliverables: newDeliverables });
  };

  const updateFilmingDays = (change: number) => {
    const newCount = Math.max(1, Math.min(7, formData.filmingDays + change));
    const newDetails = [...formData.filmingDetails];
    while (newDetails.length < newCount) {
      newDetails.push({
        date: { month: '', day: '', year: '' },
        hours: 0,
        minutes: 0,
        locations: [{ address: '', miles: 0, requiresSetup: false }],
      });
    }
    setFormData({
      ...formData,
      filmingDays: newCount,
      filmingDetails: newDetails.slice(0, newCount),
    });
  };

  const updateFilmingDetail = (dayIndex: number, field: string, value: any) => {
    const newDetails = [...formData.filmingDetails];
    newDetails[dayIndex] = { ...newDetails[dayIndex], [field]: value };
    setFormData({ ...formData, filmingDetails: newDetails });
  };

  const addLocation = (dayIndex: number) => {
    const newDetails = [...formData.filmingDetails];
    newDetails[dayIndex].locations.push({
      address: '',
      miles: 0,
      requiresSetup: false,
    });
    setFormData({ ...formData, filmingDetails: newDetails });
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
    setFormData({ ...formData, filmingDetails: newDetails });
  };

  const removeLocation = (dayIndex: number, locationIndex: number) => {
    const newDetails = [...formData.filmingDetails];
    if (newDetails[dayIndex].locations.length > 1) {
      newDetails[dayIndex].locations.splice(locationIndex, 1);
      setFormData({ ...formData, filmingDetails: newDetails });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Edit Quote</DialogTitle>
              <p className="text-sm text-gray-600 [font-family:'Lexend',Helvetica] mt-1">
                Quote ID: {quote?.id.slice(0, 8)}...
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#0050c8] p-4 rounded-lg">
            <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg">
              Client Information
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client_name">Full Name</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) =>
                  setFormData({ ...formData, client_name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="client_email">Email</Label>
              <Input
                id="client_email"
                type="email"
                value={formData.client_email}
                onChange={(e) =>
                  setFormData({ ...formData, client_email: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="client_phone">Client Phone Number</Label>
            <Input
              id="client_phone"
              value={formData.client_phone}
              onChange={(e) =>
                setFormData({ ...formData, client_phone: e.target.value })
              }
            />
          </div>

          <div className="bg-[#0050c8] p-4 rounded-lg mt-6">
            <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg">
              Project Details
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project_start_date">Start Date</Label>
              <Input
                id="project_start_date"
                type="date"
                value={formData.project_start_date}
                onChange={(e) =>
                  setFormData({ ...formData, project_start_date: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="project_end_date">End Date</Label>
              <Input
                id="project_end_date"
                type="date"
                value={formData.project_end_date}
                onChange={(e) =>
                  setFormData({ ...formData, project_end_date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="bg-[#d4e8ea] rounded-xl p-6">
            <div className="mb-4">
              <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-base mb-3 block">
                Number of Deliverables (1-7)
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={() => updateDeliverableCount(-1)}
                  className="w-10 h-10 bg-[#75c4cc] hover:bg-[#65b4bc] rounded-lg flex items-center justify-center"
                >
                  <Minus className="w-5 h-5 text-black" />
                </Button>
                <div className="w-16 h-10 bg-white rounded-lg flex items-center justify-center [font-family:'Lexend',Helvetica] font-bold text-xl">
                  {formData.numberOfDeliverables}
                </div>
                <Button
                  type="button"
                  onClick={() => updateDeliverableCount(1)}
                  className="w-10 h-10 bg-[#0050c8] hover:bg-[#003d99] rounded-lg flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 text-white" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-base mb-3 block">
                Length per Deliverable
              </Label>
              <div className="bg-white rounded-lg p-4 space-y-2">
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
                        updateDeliverable(index, 'hours', parseInt(e.target.value) || 0)
                      }
                      className="h-10 text-center border-2 border-gray-300 rounded-lg [font-family:'Lexend',Helvetica]"
                    />
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={deliverable.minutes}
                      onChange={(e) =>
                        updateDeliverable(index, 'minutes', parseInt(e.target.value) || 0)
                      }
                      className="h-10 text-center border-2 border-gray-300 rounded-lg [font-family:'Lexend',Helvetica]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#d4e8ea] rounded-xl p-6">
            <div className="mb-4">
              <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-base mb-3 block">
                Filming Days (1-7)
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={() => updateFilmingDays(-1)}
                  className="w-10 h-10 bg-[#75c4cc] hover:bg-[#65b4bc] rounded-lg flex items-center justify-center"
                >
                  <Minus className="w-5 h-5 text-black" />
                </Button>
                <div className="w-16 h-10 bg-white rounded-lg flex items-center justify-center [font-family:'Lexend',Helvetica] font-bold text-xl">
                  {formData.filmingDays}
                </div>
                <Button
                  type="button"
                  onClick={() => updateFilmingDays(1)}
                  className="w-10 h-10 bg-[#0050c8] hover:bg-[#003d99] rounded-lg flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 text-white" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-base mb-4 block">
                Filming Details
              </Label>
              <div className="space-y-3">
                {formData.filmingDetails.map((detail: any, dayIndex: number) => (
                  <div key={dayIndex} className="bg-white rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedDay(expandedDay === dayIndex ? -1 : dayIndex)
                      }
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-[#75c4cc] px-4 py-2 rounded [font-family:'Lexend',Helvetica] font-bold">
                          Day {dayIndex + 1}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 [font-family:'Lexend',Helvetica] text-sm">
                          <input
                            type="text"
                            placeholder="MM"
                            value={detail.date.month}
                            onChange={(e) =>
                              updateFilmingDetail(dayIndex, 'date', {
                                ...detail.date,
                                month: e.target.value,
                              })
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="w-10 text-center border border-gray-300 rounded px-1 py-1"
                            maxLength={2}
                          />
                          <span>/</span>
                          <input
                            type="text"
                            placeholder="DD"
                            value={detail.date.day}
                            onChange={(e) =>
                              updateFilmingDetail(dayIndex, 'date', {
                                ...detail.date,
                                day: e.target.value,
                              })
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="w-10 text-center border border-gray-300 rounded px-1 py-1"
                            maxLength={2}
                          />
                          <span>/</span>
                          <input
                            type="text"
                            placeholder="YYYY"
                            value={detail.date.year}
                            onChange={(e) =>
                              updateFilmingDetail(dayIndex, 'date', {
                                ...detail.date,
                                year: e.target.value,
                              })
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="w-14 text-center border border-gray-300 rounded px-1 py-1"
                            maxLength={4}
                          />
                        </div>
                      </div>
                      {expandedDay === dayIndex ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>

                    {expandedDay === dayIndex && (
                      <div className="p-4 border-t space-y-4">
                        <div>
                          <Label className="[font-family:'Lexend',Helvetica] font-bold text-sm mb-2 block">
                            Filming Hours
                          </Label>
                          <div className="flex items-center gap-3">
                            <span className="[font-family:'Lexend',Helvetica] text-sm">
                              Hours
                            </span>
                            <input
                              type="number"
                              min="0"
                              value={detail.hours}
                              onChange={(e) =>
                                updateFilmingDetail(
                                  dayIndex,
                                  'hours',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-16 h-8 text-center border-2 border-gray-300 rounded [font-family:'Lexend',Helvetica]"
                            />
                            <span>:</span>
                            <span className="[font-family:'Lexend',Helvetica] text-sm">
                              Minutes
                            </span>
                            <input
                              type="number"
                              min="0"
                              max="59"
                              value={detail.minutes}
                              onChange={(e) =>
                                updateFilmingDetail(
                                  dayIndex,
                                  'minutes',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-16 h-8 text-center border-2 border-gray-300 rounded [font-family:'Lexend',Helvetica]"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="[font-family:'Lexend',Helvetica] font-bold text-sm mb-2 block">
                            Locations
                          </Label>
                          <div className="space-y-3">
                            {detail.locations.map((location: any, locationIndex: number) => (
                              <div
                                key={locationIndex}
                                className="bg-gray-50 rounded-lg p-3 space-y-2"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="[font-family:'Lexend',Helvetica] text-sm font-semibold">
                                    Location {locationIndex + 1}
                                  </span>
                                  {locationIndex > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => removeLocation(dayIndex, locationIndex)}
                                      className="text-red-600 text-sm hover:text-red-800"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                                <input
                                  type="text"
                                  placeholder="Address"
                                  value={location.address}
                                  onChange={(e) =>
                                    updateLocation(
                                      dayIndex,
                                      locationIndex,
                                      'address',
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded [font-family:'Lexend',Helvetica] text-sm"
                                />
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2">
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
                                          parseFloat(e.target.value) || 0
                                        )
                                      }
                                      className="w-20 h-8 text-center border border-gray-300 rounded [font-family:'Lexend',Helvetica] text-sm"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="[font-family:'Lexend',Helvetica] text-sm">
                                      Setup?
                                    </span>
                                    <label className="flex items-center gap-1">
                                      <input
                                        type="radio"
                                        name={`setup-${dayIndex}-${locationIndex}`}
                                        checked={location.requiresSetup === true}
                                        onChange={() =>
                                          updateLocation(
                                            dayIndex,
                                            locationIndex,
                                            'requiresSetup',
                                            true
                                          )
                                        }
                                        className="w-3 h-3"
                                      />
                                      <span className="[font-family:'Lexend',Helvetica] text-sm">
                                        Yes
                                      </span>
                                    </label>
                                    <label className="flex items-center gap-1">
                                      <input
                                        type="radio"
                                        name={`setup-${dayIndex}-${locationIndex}`}
                                        checked={location.requiresSetup === false}
                                        onChange={() =>
                                          updateLocation(
                                            dayIndex,
                                            locationIndex,
                                            'requiresSetup',
                                            false
                                          )
                                        }
                                        className="w-3 h-3"
                                      />
                                      <span className="[font-family:'Lexend',Helvetica] text-sm">
                                        No
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addLocation(dayIndex)}
                              className="text-[#023c97] [font-family:'Lexend',Helvetica] font-semibold text-sm flex items-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Add location
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

          <div className="bg-[#0050c8] p-4 rounded-lg mt-6">
            <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg">
              Setup & Pricing
            </h3>
          </div>

          <div className="space-y-6">
            <div>
              <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-base mb-3 block">
                Crew per Setup (DP + Other) (1-7)
              </Label>
              <Input
                type="number"
                min="1"
                max="7"
                value={formData.crewPerSetup || ''}
                onChange={(e) =>
                  setFormData({ ...formData, crewPerSetup: parseInt(e.target.value) || 0 })
                }
                className="h-12 rounded-lg border-2 border-gray-300 [font-family:'Lexend',Helvetica] text-lg px-4"
              />
            </div>

            <div>
              <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-base mb-3 block">
                Weight (Production to Profit) (40–80%)
              </Label>
              <Input
                type="number"
                min="40"
                max="80"
                value={formData.weight || ''}
                onChange={(e) =>
                  setFormData({ ...formData, weight: parseInt(e.target.value) || 0 })
                }
                className="h-12 rounded-lg border-2 border-gray-300 [font-family:'Lexend',Helvetica] text-lg px-4"
              />
            </div>

            <div>
              <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-base mb-3 block">
                Discount (0–20%)
              </Label>
              <Input
                type="number"
                min="0"
                max="20"
                value={formData.discount || ''}
                onChange={(e) =>
                  setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })
                }
                className="h-12 rounded-lg border-2 border-gray-300 [font-family:'Lexend',Helvetica] text-lg px-4"
              />
            </div>
          </div>

          <div className="bg-[#0050c8] p-4 rounded-lg mt-6">
            <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg">
              Quote Status
            </h3>
          </div>

          <div className="mt-6 bg-gray-50 p-6 rounded-lg border-2 border-gray-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1">
                <Label className="[font-family:'Lexend',Helvetica] font-bold text-black text-base block mb-2">
                  Current Status: <span className={`${
                    formData.status === 'accepted' ? 'text-green-600' :
                    formData.status === 'pending' ? 'text-yellow-600' :
                    'text-gray-600'
                  } capitalize`}>{formData.status}</span>
                </Label>
                <p className="text-sm text-gray-600 [font-family:'Lexend',Helvetica]">
                  {formData.status === 'draft' && 'Quote has not been sent to customer yet'}
                  {formData.status === 'pending' && 'Quote has been sent to customer and is awaiting response'}
                  {formData.status === 'accepted' && 'Quote has been accepted by customer'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white p-4 rounded-lg border-2 border-gray-300">
              <input
                type="checkbox"
                id="acceptedCheckbox"
                checked={formData.status === 'accepted'}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.checked ? 'accepted' : (formData.status === 'accepted' ? 'pending' : formData.status) })
                }
                className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-600"
              />
              <Label htmlFor="acceptedCheckbox" className="[font-family:'Lexend',Helvetica] font-bold text-black text-base cursor-pointer">
                Mark as Accepted
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#0050c8] hover:bg-[#0050c8] text-white"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
