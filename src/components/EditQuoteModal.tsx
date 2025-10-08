import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    client_name: quote?.form_data?.fullName || '',
    client_email: quote?.form_data?.contactEmail || '',
    production_company: quote?.form_data?.productionCompanyName || '',
    project_start_date: quote?.project_start_date || '',
    project_end_date: quote?.project_end_date || '',
    number_of_deliverables: quote?.form_data?.numberOfDeliverables || 0,
    filming_days: quote?.form_data?.filmingDays || 0,
    crew_per_setup: quote?.form_data?.crewPerSetup || 0,
    weight: quote?.form_data?.weight || 0,
    discount: quote?.form_data?.discount || 0,
    status: quote?.status || 'pending',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedFormData = {
        ...quote.form_data,
        fullName: formData.client_name,
        contactEmail: formData.client_email,
        productionCompanyName: formData.production_company,
        numberOfDeliverables: formData.number_of_deliverables,
        filmingDays: formData.filming_days,
        crewPerSetup: formData.crew_per_setup,
        weight: formData.weight,
        discount: formData.discount,
      };

      const { error } = await supabase
        .from('quotes')
        .update({
          client_name: formData.client_name,
          client_email: formData.client_email,
          production_company: formData.production_company,
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

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[800px] max-h-[90vh] overflow-y-auto">
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
          <div className="bg-gradient-to-r from-[#f59e0b] to-[#fb923c] p-4 rounded-lg">
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
                onChange={(e) => handleChange('client_name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="client_email">Email</Label>
              <Input
                id="client_email"
                type="email"
                value={formData.client_email}
                onChange={(e) => handleChange('client_email', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="production_company">Production Company</Label>
            <Input
              id="production_company"
              value={formData.production_company}
              onChange={(e) => handleChange('production_company', e.target.value)}
            />
          </div>

          <div className="bg-gradient-to-r from-[#f59e0b] to-[#fb923c] p-4 rounded-lg mt-6">
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
                onChange={(e) => handleChange('project_start_date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="project_end_date">End Date</Label>
              <Input
                id="project_end_date"
                type="date"
                value={formData.project_end_date}
                onChange={(e) => handleChange('project_end_date', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="number_of_deliverables">Number of Deliverables</Label>
              <Input
                id="number_of_deliverables"
                type="number"
                value={formData.number_of_deliverables}
                onChange={(e) => handleChange('number_of_deliverables', parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="filming_days">Filming Days</Label>
              <Input
                id="filming_days"
                type="number"
                value={formData.filming_days}
                onChange={(e) => handleChange('filming_days', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#f59e0b] to-[#fb923c] p-4 rounded-lg mt-6">
            <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg">
              Setup & Pricing
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="crew_per_setup">Crew per Setup</Label>
              <Input
                id="crew_per_setup"
                type="number"
                value={formData.crew_per_setup}
                onChange={(e) => handleChange('crew_per_setup', parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                value={formData.discount}
                onChange={(e) => handleChange('discount', parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg [font-family:'Lexend',Helvetica]"
            >
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
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
              className="bg-[#f59e0b] hover:bg-[#d97706] text-white"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
