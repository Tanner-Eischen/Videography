import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Footer } from '../../components/ui/footer';
import { ArrowLeft, Save, User, DollarSign, Building2, LogOut, Settings, HelpCircle } from 'lucide-react';
import { Avatar } from '../../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

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
  const { user, profile, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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

  const handleSaveSettingsClick = () => {
    setShowConfirmModal(true);
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
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
      setShowConfirmModal(false);
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

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const isSuperAdmin = profile?.role === 'superadmin';
  const headerBgColor = isSuperAdmin ? 'bg-[#6b21a8]' : 'bg-[#003D82]';
  const avatarBgColor = isSuperAdmin ? 'bg-[#9333ea] hover:bg-[#7e22ce]' : 'bg-[#003D82] hover:bg-[#002A5C]';

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <header className={`${headerBgColor} min-h-[70px] flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-3 md:py-0 gap-3 md:gap-0`}>
        <h1 className="[font-family:'Lexend',Helvetica] font-bold text-white text-2xl">
          Vid-QUO
        </h1>
        <nav className="flex items-center gap-3 md:gap-8 overflow-x-auto">
          {isSuperAdmin ? (
            <>
              <button
                onClick={() => navigate('/superadmin')}
                className="[font-family:'Lexend',Helvetica] font-semibold text-white text-sm md:text-lg hover:text-[#e9d5ff] transition-colors whitespace-nowrap"
              >
                Analytics
              </button>
              <button
                onClick={() => navigate('/superadmin/all-quotes')}
                className="[font-family:'Lexend',Helvetica] font-semibold text-white text-sm md:text-lg hover:text-[#e9d5ff] transition-colors whitespace-nowrap"
              >
                All Quotes
              </button>
              <button
                onClick={() => navigate('/superadmin/accounts')}
                className="[font-family:'Lexend',Helvetica] font-semibold text-white text-sm md:text-lg hover:text-[#e9d5ff] transition-colors whitespace-nowrap"
              >
                Accounts
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="[font-family:'Lexend',Helvetica] font-semibold text-white text-sm md:text-lg hover:text-[#8FC4D4] transition-colors whitespace-nowrap"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/create-quote')}
                className="[font-family:'Lexend',Helvetica] font-semibold text-white text-sm md:text-lg hover:text-[#8FC4D4] transition-colors whitespace-nowrap"
              >
                Create Quote
              </button>
              <button
                onClick={() => navigate('/all-quotes')}
                className="[font-family:'Lexend',Helvetica] font-semibold text-white text-sm md:text-lg hover:text-[#8FC4D4] transition-colors whitespace-nowrap"
              >
                All Quotes
              </button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer focus:outline-none">
                <Avatar className={`w-12 h-12 ${avatarBgColor} transition-colors`}>
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <User className="w-6 h-6" />
                  </div>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="[font-family:'Lexend',Helvetica]">
                {profile?.full_name || 'My Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate('/settings')}
                className="[font-family:'Lexend',Helvetica] cursor-pointer"
              >
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open('mailto:support@example.com', '_blank')}
                className="[font-family:'Lexend',Helvetica] cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="[font-family:'Lexend',Helvetica] cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-12">
        <div className="mb-6 md:mb-8">
          <h1 className={`[font-family:'Lexend',Helvetica] font-bold ${isSuperAdmin ? 'text-[#6b21a8]' : 'text-[#003D82]'} text-2xl md:text-4xl mb-2`}>
            Account Settings
          </h1>
          <p className="[font-family:'Lexend',Helvetica] text-gray-700 text-sm md:text-lg">
            Manage your profile and crew rate preferences
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-4 md:p-8 bg-white rounded-xl border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <User className={`w-6 h-6 ${isSuperAdmin ? 'text-[#6b21a8]' : 'text-[#003D82]'}`} />
              <h2 className="[font-family:'Lexend',Helvetica] font-bold text-black text-2xl">
                Account Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

          <Card className="p-4 md:p-8 bg-white rounded-xl border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className={`w-6 h-6 ${isSuperAdmin ? 'text-[#6b21a8]' : 'text-[#003D82]'}`} />
              <h2 className="[font-family:'Lexend',Helvetica] font-bold text-black text-2xl">
                Crew Rates (Hourly)
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

          <Card className="p-4 md:p-8 bg-white rounded-xl border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className={`w-6 h-6 ${isSuperAdmin ? 'text-[#6b21a8]' : 'text-[#003D82]'}`} />
              <h2 className="[font-family:'Lexend',Helvetica] font-bold text-black text-2xl">
                Additional Fees
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
              onClick={handleSaveSettingsClick}
              disabled={saving}
              className={`${isSuperAdmin ? 'bg-[#6b21a8] hover:bg-[#581c87]' : 'bg-[#003D82] hover:bg-[#003D82]/90'} text-white px-8 py-6 text-lg`}
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="[font-family:'Lexend',Helvetica] font-bold text-xl">
              Save Settings?
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="[font-family:'Lexend',Helvetica] text-gray-700">
              Are you sure you want to save these changes?
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setShowConfirmModal(false)}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 [font-family:'Lexend',Helvetica] font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSettings}
              disabled={saving}
              className="bg-[#003D82] hover:bg-[#002A5C] text-white [font-family:'Lexend',Helvetica] font-semibold"
            >
              {saving ? 'Saving...' : 'Confirm'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer bgColor="bg-[#003D82]" />
    </div>
  );
};
