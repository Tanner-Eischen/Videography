import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Avatar } from '../../components/ui/avatar';
import { supabase, Quote } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronDown, ChevronUp, Download, Mail, User, LogOut, Settings, HelpCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateQuotePDF, sendQuoteEmail } from '../../lib/exportUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

interface AccountWithQuotes {
  accountId: string;
  accountName: string;
  accountEmail: string;
  quotes: Quote[];
}

export const SuperAdminAllQuotes = (): JSX.Element => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<AccountWithQuotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAccount, setExpandedAccount] = useState<string | null>(null);

  useEffect(() => {
    fetchAllAccountsWithQuotes();
  }, []);

  const fetchAllAccountsWithQuotes = async () => {
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('role', 'admin')
      .order('full_name');

    if (profilesData) {
      const accountsWithQuotes: AccountWithQuotes[] = [];

      for (const profileItem of profilesData) {
        const { data: quotesData } = await supabase
          .from('quotes')
          .select('*')
          .eq('client_id', profileItem.id)
          .order('created_at', { ascending: false });

        accountsWithQuotes.push({
          accountId: profileItem.id,
          accountName: profileItem.full_name || 'Unnamed Account',
          accountEmail: profileItem.email || '',
          quotes: (quotesData as Quote[]) || [],
        });
      }

      setAccounts(accountsWithQuotes);
    }

    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'exported':
        return 'bg-orange-100 text-orange-800';
      case 'emailed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleExportPDF = async (quote: Quote) => {
    await supabase
      .from('quotes')
      .update({ status: 'exported' })
      .eq('id', quote.id);

    generateQuotePDF(quote);
    fetchAllAccountsWithQuotes();
  };

  const handleEmail = async (quote: Quote) => {
    await sendQuoteEmail(quote);
    await supabase
      .from('quotes')
      .update({ status: 'emailed' })
      .eq('id', quote.id);
    fetchAllAccountsWithQuotes();
  };

  const toggleAccount = (accountId: string) => {
    setExpandedAccount(expandedAccount === accountId ? null : accountId);
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
      <header className="bg-[#6b21a8] h-[70px] flex items-center justify-between px-8">
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
            className="[font-family:'Lexend',Helvetica] font-semibold text-white text-lg hover:text-[#e9d5ff] transition-colors border-b-2 border-white"
          >
            All Quotes
          </button>
          <button
            onClick={() => navigate('/superadmin/accounts')}
            className="[font-family:'Lexend',Helvetica] font-semibold text-white text-lg hover:text-[#e9d5ff] transition-colors"
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

      <div className="max-w-[1400px] mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="[font-family:'Lexend',Helvetica] font-bold text-[#6b21a8] text-4xl mb-2">
            All Account Quotes
          </h1>
          <p className="[font-family:'Lexend',Helvetica] text-gray-700 text-lg">
            View quotes from all accounts in the system
          </p>
        </div>

        <div className="space-y-4">
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <Card key={account.accountId} className="bg-white rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAccount(account.accountId)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#9333ea] rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {account.accountName.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <div className="[font-family:'Lexend',Helvetica] font-bold text-xl text-gray-900">
                        {account.accountName}
                      </div>
                      <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-600">
                        {account.accountEmail}
                      </div>
                    </div>
                    <div className="bg-[#6b21a8] text-white px-4 py-2 rounded-lg ml-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="[font-family:'Lexend',Helvetica] font-bold">
                          {account.quotes.length} {account.quotes.length === 1 ? 'Quote' : 'Quotes'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {expandedAccount === account.accountId ? (
                    <ChevronUp className="w-6 h-6 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-600" />
                  )}
                </button>

                {expandedAccount === account.accountId && (
                  <div className="border-t">
                    {account.quotes.length > 0 ? (
                      <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left [font-family:'Lexend',Helvetica] font-bold text-gray-700 text-sm">
                              CLIENT NAME
                            </th>
                            <th className="px-6 py-3 text-left [font-family:'Lexend',Helvetica] font-bold text-gray-700 text-sm">
                              DATE CREATED
                            </th>
                            <th className="px-6 py-3 text-left [font-family:'Lexend',Helvetica] font-bold text-gray-700 text-sm">
                              TOTAL AMOUNT
                            </th>
                            <th className="px-6 py-3 text-left [font-family:'Lexend',Helvetica] font-bold text-gray-700 text-sm">
                              STATUS
                            </th>
                            <th className="px-6 py-3 text-left [font-family:'Lexend',Helvetica] font-bold text-gray-700 text-sm">
                              ACTIONS
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {account.quotes.map((quote, index) => (
                            <tr key={quote.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-6 py-4 [font-family:'Lexend',Helvetica] font-medium text-gray-900">
                                {quote.client_name}
                              </td>
                              <td className="px-6 py-4 [font-family:'Lexend',Helvetica] text-gray-700">
                                {formatDate(quote.created_at)}
                              </td>
                              <td className="px-6 py-4 [font-family:'Lexend',Helvetica] font-semibold text-gray-900">
                                ${quote.total_amount?.toLocaleString() || '0'}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(quote.status)}`}>
                                  {quote.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <Button
                                    onClick={() => handleExportPDF(quote)}
                                    className="bg-transparent hover:bg-gray-200 p-2"
                                    title="Download PDF"
                                  >
                                    <Download className="w-4 h-4 text-gray-700" />
                                  </Button>
                                  <Button
                                    onClick={() => handleEmail(quote)}
                                    className="bg-transparent hover:bg-gray-200 p-2"
                                    title="Send Email"
                                  >
                                    <Mail className="w-4 h-4 text-gray-700" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="px-6 py-12 text-center [font-family:'Lexend',Helvetica] text-gray-500">
                        No quotes for this account
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <p className="[font-family:'Lexend',Helvetica] text-gray-500 text-lg">
                No accounts found
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
