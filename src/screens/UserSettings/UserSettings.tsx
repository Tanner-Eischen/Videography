import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Save, User, DollarSign, Building2 } from 'lucide-react';

interface UserSettings {
  director_of_photography_rate: number;
  editor_rate: number;
  producer_rate: number;
  enablement_content_owner_rate: number;
  creative_director_rate: number;
  set_designer_rate: number;
  company_name: string;
  phone_number: string;
  rush_fee: number;
  high_traffic_fee: number;
}

export const UserSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    director_of_photography_rate: 0,
    editor_rate: 0,
    producer_rate: 0,
    enablement_content_owner_rate: 0,
    creative_director_rate: 0,
    set_designer_rate: 0,
    company_name: '',
    phone_number: '',
    rush_fee: 0,
    high_traffic_fee: 0,
  });
  const [accountInfo, setAccountInfo] = useState({
    full_name: profile?.full_name || '',
    email: user?.email || '',
  });

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        setSettings({
          director_of_photography_rate: data.director_of_photography_rate || 0,
          editor_rate: data.editor_rate || 0,
          producer_rate: data.producer_rate || 0,
          enablement_content_owner_rate: data.enablement_content_owner_rate || 0,
          creative_director_rate: data.creative_director_rate || 0,
          set_designer_rate: data.set_designer_rate || 0,
          company_name: data.company_name || '',
          phone_number: data.phone_number || '',
          rush_fee: data.rush_fee || 0,
          high_traffic_fee: data.high_traffic_fee || 0,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings,
        });

      if (settingsError) throw settingsError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: accountInfo.full_name })
        .eq('id', user.id);

      if (profileError) throw profileError;

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e6f2ff] to-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f2ff] to-white">
      <div className="max-w-[1200px] mx-auto px-8 py-12">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-[#023c97] hover:text-[#023c97]/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-4xl mb-2">
            Account Settings
          </h1>
          <p className="[font-family:'Lexend',Helvetica] text-gray-700 text-lg">
            Manage your profile and crew rate preferences
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-8 bg-white rounded-xl border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-[#023c97]" />
              <h2 className="[font-family:'Lexend',Helvetica] font-bold text-black text-2xl">
                Account Information
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="full_name" className="text-gray-700 mb-2">
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  value={accountInfo.full_name}
                  onChange={(e) =>
                    setAccountInfo({ ...accountInfo, full_name: e.target.value })
                  }
                  className="border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-700 mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  value={accountInfo.email}
                  disabled
                  className="border-gray-300 bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="company_name" className="text-gray-700 mb-2">
                  Company Name
                </Label>
                <Input
                  id="company_name"
                  value={settings.company_name}
                  onChange={(e) =>
                    setSettings({ ...settings, company_name: e.target.value })
                  }
                  className="border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="phone_number" className="text-gray-700 mb-2">
                  Phone Number
                </Label>
                <Input
                  id="phone_number"
                  value={settings.phone_number}
                  onChange={(e) =>
                    setSettings({ ...settings, phone_number: e.target.value })
                  }
                  className="border-gray-300"
                />
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-white rounded-xl border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-[#023c97]" />
              <h2 className="[font-family:'Lexend',Helvetica] font-bold text-black text-2xl">
                Crew Rates (Hourly)
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="dop_rate" className="text-gray-700 mb-2">
                  Director of Photography
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="dop_rate"
                    type="number"
                    step="0.01"
                    value={settings.director_of_photography_rate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        director_of_photography_rate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="border-gray-300 pl-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editor_rate" className="text-gray-700 mb-2">
                  Editor
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="editor_rate"
                    type="number"
                    step="0.01"
                    value={settings.editor_rate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        editor_rate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="border-gray-300 pl-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="producer_rate" className="text-gray-700 mb-2">
                  Producer
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="producer_rate"
                    type="number"
                    step="0.01"
                    value={settings.producer_rate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        producer_rate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="border-gray-300 pl-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="eco_rate" className="text-gray-700 mb-2">
                  Enablement Content Owner
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="eco_rate"
                    type="number"
                    step="0.01"
                    value={settings.enablement_content_owner_rate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        enablement_content_owner_rate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="border-gray-300 pl-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cd_rate" className="text-gray-700 mb-2">
                  Creative Director
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="cd_rate"
                    type="number"
                    step="0.01"
                    value={settings.creative_director_rate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        creative_director_rate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="border-gray-300 pl-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="sd_rate" className="text-gray-700 mb-2">
                  Set Designer
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="sd_rate"
                    type="number"
                    step="0.01"
                    value={settings.set_designer_rate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        set_designer_rate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="border-gray-300 pl-8"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-white rounded-xl border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-[#023c97]" />
              <h2 className="[font-family:'Lexend',Helvetica] font-bold text-black text-2xl">
                Additional Fees
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="rush_fee" className="text-gray-700 mb-2">
                  Rush Fee
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="rush_fee"
                    type="number"
                    step="0.01"
                    value={settings.rush_fee}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        rush_fee: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="border-gray-300 pl-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="high_traffic_fee" className="text-gray-700 mb-2">
                  High Traffic Fee
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="high_traffic_fee"
                    type="number"
                    step="0.01"
                    value={settings.high_traffic_fee}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        high_traffic_fee: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="border-gray-300 pl-8"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveSettings}
              disabled={saving}
              className="bg-[#023c97] hover:bg-[#023c97]/90 text-white px-8 py-6 text-lg"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
