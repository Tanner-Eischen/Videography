import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Avatar } from '../../components/ui/avatar';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { User, LogOut, Settings, HelpCircle, Trash2, RotateCcw, Plus, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

interface AccountData {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
  quote_count?: number;
}

export const SuperAdminAccounts = (): JSX.Element => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: 'create' | 'delete' | 'reset'; data?: any }>({ type: 'create' });
  const [newAccount, setNewAccount] = useState({
    full_name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, created_at')
      .eq('role', 'admin')
      .order('created_at', { ascending: false });

    if (profilesData) {
      const accountsWithCounts = await Promise.all(
        profilesData.map(async (account) => {
          const { count } = await supabase
            .from('quotes')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', account.id);

          return {
            ...account,
            quote_count: count || 0,
          };
        })
      );

      setAccounts(accountsWithCounts as AccountData[]);
    }

    setLoading(false);
  };

  const handleCreateAccountClick = () => {
    if (!newAccount.email || !newAccount.password || !newAccount.full_name) {
      alert('Please fill in all fields');
      return;
    }
    setConfirmAction({ type: 'create', data: { ...newAccount } });
    setShowConfirmModal(true);
  };

  const handleCreateAccount = async () => {
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: confirmAction.data.email,
        password: confirmAction.data.password,
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: confirmAction.data.full_name,
            role: 'admin',
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        alert('Account created successfully!');
        setShowCreateModal(false);
        setShowConfirmModal(false);
        setNewAccount({ full_name: '', email: '', password: '' });
        fetchAccounts();
      }
    } catch (error: any) {
      console.error('Error creating account:', error);
      alert(`Failed to create account: ${error.message}`);
      setShowConfirmModal(false);
    }
  };

  const handleResetPasswordClick = (accountId: string, email: string) => {
    setConfirmAction({ type: 'reset', data: { accountId, email } });
    setShowConfirmModal(true);
  };

  const handleResetPassword = async () => {

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(confirmAction.data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      alert('Password reset email sent successfully!');
      setShowConfirmModal(false);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      alert(`Failed to send password reset: ${error.message}`);
      setShowConfirmModal(false);
    }
  };

  const handleDeleteAccountClick = (accountId: string, accountName: string) => {
    setConfirmAction({ type: 'delete', data: { accountId, accountName } });
    setShowConfirmModal(true);
  };

  const handleDeleteAccount = async () => {

    try {
      await supabase
        .from('quotes')
        .delete()
        .eq('client_id', confirmAction.data.accountId);

      await supabase
        .from('user_settings')
        .delete()
        .eq('user_id', confirmAction.data.accountId);

      await supabase
        .from('profiles')
        .delete()
        .eq('id', confirmAction.data.accountId);

      alert('Account deleted successfully!');
      setShowConfirmModal(false);
      fetchAccounts();
    } catch (error: any) {
      console.error('Error deleting account:', error);
      alert(`Failed to delete account: ${error.message}`);
      setShowConfirmModal(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl [font-family:'Lexend',Helvetica]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <header className="bg-[#6b21a8] min-h-[70px] flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-3 md:py-0 gap-3 md:gap-0">
        <div className="flex items-center gap-4">
          <h1 className="[font-family:'Lexend',Helvetica] font-bold text-white text-2xl">
            Vid-QUO
          </h1>
          <div className="bg-white/20 px-3 py-1 rounded-lg">
            <span className="[font-family:'Lexend',Helvetica] font-bold text-white text-sm">
              SUPER ADMIN
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-8">
          <button
            onClick={() => navigate('/superadmin')}
            className="[font-family:'Lexend',Helvetica] font-semibold text-white text-lg hover:text-[#e9d5ff] transition-colors"
          >
            Analytics
          </button>
          <button
            onClick={() => navigate('/superadmin/all-quotes')}
            className="[font-family:'Lexend',Helvetica] font-semibold text-white text-lg hover:text-[#e9d5ff] transition-colors"
          >
            All Quotes
          </button>
          <button
            onClick={() => navigate('/superadmin/accounts')}
            className="[font-family:'Lexend',Helvetica] font-semibold text-white text-lg hover:text-[#e9d5ff] transition-colors border-b-2 border-white"
          >
            Accounts
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer focus:outline-none">
                <Avatar className="w-12 h-12 bg-[#9333ea] hover:bg-[#7e22ce] transition-colors">
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <User className="w-6 h-6" />
                  </div>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="[font-family:'Lexend',Helvetica]">
                {profile?.full_name || 'Super Admin'}
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

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="[font-family:'Lexend',Helvetica] font-bold text-[#6b21a8] text-2xl md:text-4xl mb-2">
              Account Management
            </h1>
            <p className="[font-family:'Lexend',Helvetica] text-gray-700 text-sm md:text-lg">
              Create, manage, and delete user accounts
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(!showCreateModal)}
            className="bg-[#6b21a8] hover:bg-[#581c87] text-white px-6 py-3 rounded-lg [font-family:'Lexend',Helvetica] font-bold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Account
          </Button>
        </div>

        {showCreateModal && (
          <Card className="p-8 mb-8 bg-white rounded-xl border-2 border-[#6b21a8]">
            <h2 className="[font-family:'Lexend',Helvetica] font-bold text-xl mb-6">
              Create New Admin Account
            </h2>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="new_full_name" className="text-gray-700 mb-2">
                  Full Name
                </Label>
                <Input
                  id="new_full_name"
                  value={newAccount.full_name}
                  onChange={(e) => setNewAccount({ ...newAccount, full_name: e.target.value })}
                  className="border-gray-300"
                  placeholder=""
                />
              </div>
              <div>
                <Label htmlFor="new_email" className="text-gray-700 mb-2">
                  Email
                </Label>
                <Input
                  id="new_email"
                  type="email"
                  value={newAccount.email}
                  onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                  className="border-gray-300"
                  placeholder=""
                />
              </div>
              <div>
                <Label htmlFor="new_password" className="text-gray-700 mb-2">
                  Password
                </Label>
                <Input
                  id="new_password"
                  type="password"
                  value={newAccount.password}
                  onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                  className="border-gray-300"
                  placeholder=""
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewAccount({ full_name: '', email: '', password: '' });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateAccountClick}
                className="bg-[#6b21a8] hover:bg-[#581c87] text-white px-6 py-2 rounded-lg"
              >
                Create Account
              </Button>
            </div>
          </Card>
        )}

        <Card className="bg-white rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#6b21a8]">
              <tr>
                <th className="px-6 py-4 text-left [font-family:'Lexend',Helvetica] font-bold text-white text-lg">
                  ACCOUNT NAME
                </th>
                <th className="px-6 py-4 text-left [font-family:'Lexend',Helvetica] font-bold text-white text-lg">
                  EMAIL
                </th>
                <th className="px-6 py-4 text-left [font-family:'Lexend',Helvetica] font-bold text-white text-lg">
                  QUOTES
                </th>
                <th className="px-6 py-4 text-left [font-family:'Lexend',Helvetica] font-bold text-white text-lg">
                  CREATED
                </th>
                <th className="px-6 py-4 text-left [font-family:'Lexend',Helvetica] font-bold text-white text-lg">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {accounts.length > 0 ? (
                accounts.map((account, index) => (
                  <tr key={account.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#9333ea] rounded-full flex items-center justify-center text-white font-bold">
                          {account.full_name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <span className="[font-family:'Lexend',Helvetica] font-medium text-lg">
                          {account.full_name || 'Unnamed Account'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 [font-family:'Lexend',Helvetica] text-gray-700">
                      {account.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#6b21a8] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {account.quote_count || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 [font-family:'Lexend',Helvetica] text-gray-700">
                      {formatDate(account.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleResetPasswordClick(account.id, account.email)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2"
                          title="Reset Password"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reset
                        </Button>
                        <Button
                          onClick={() => handleDeleteAccountClick(account.id, account.full_name)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center gap-2"
                          title="Delete Account"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center [font-family:'Lexend',Helvetica] text-gray-500">
                    No accounts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="[font-family:'Lexend',Helvetica] font-bold text-xl">
              {confirmAction.type === 'create' && 'Create Account?'}
              {confirmAction.type === 'delete' && 'Delete Account?'}
              {confirmAction.type === 'reset' && 'Reset Password?'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="[font-family:'Lexend',Helvetica] text-gray-700">
              {confirmAction.type === 'create' && `Are you sure you want to create an account for ${confirmAction.data?.email}?`}
              {confirmAction.type === 'delete' && `Are you sure you want to delete the account for ${confirmAction.data?.accountName}? This will also delete all their quotes. This action cannot be undone.`}
              {confirmAction.type === 'reset' && `Send password reset email to ${confirmAction.data?.email}?`}
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
              onClick={() => {
                if (confirmAction.type === 'create') handleCreateAccount();
                if (confirmAction.type === 'delete') handleDeleteAccount();
                if (confirmAction.type === 'reset') handleResetPassword();
              }}
              className={`${confirmAction.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#003D82] hover:bg-[#022d70]'} text-white [font-family:'Lexend',Helvetica] font-semibold`}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
