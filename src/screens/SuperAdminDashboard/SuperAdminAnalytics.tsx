import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Avatar } from '../../components/ui/avatar';
import { supabase, Quote } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Users, DollarSign, FileText, TrendingUp, LogOut, User, Settings, HelpCircle, Activity, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStatusColor, formatDate } from '../../lib/quoteUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

interface SystemStats {
  totalAccounts: number;
  totalQuotes: number;
  totalRevenue: number;
  quotesByStatus: {
    draft: number;
    done: number;
    exported: number;
    emailed: number;
  };
  recentQuotes: Quote[];
  topAccounts: Array<{
    id: string;
    name: string;
    quoteCount: number;
    totalRevenue: number;
  }>;
}

export const SuperAdminAnalytics = (): JSX.Element => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('role', 'admin');

    const { data: quotesData } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesData && quotesData) {
      const totalRevenue = quotesData.reduce((sum, quote) => sum + (quote.total_amount || 0), 0);

      const quotesByStatus = {
        draft: quotesData.filter(q => q.status === 'draft').length,
        done: quotesData.filter(q => q.status === 'done').length,
        exported: quotesData.filter(q => q.status === 'exported').length,
        emailed: quotesData.filter(q => q.status === 'emailed').length,
      };

      const accountQuoteCounts = new Map<string, { count: number; revenue: number; name: string }>();

      quotesData.forEach(quote => {
        const existing = accountQuoteCounts.get(quote.client_id) || { count: 0, revenue: 0, name: '' };
        accountQuoteCounts.set(quote.client_id, {
          count: existing.count + 1,
          revenue: existing.revenue + (quote.total_amount || 0),
          name: quote.client_name || 'Unknown',
        });
      });

      const topAccounts = Array.from(accountQuoteCounts.entries())
        .map(([id, data]) => ({
          id,
          name: data.name,
          quoteCount: data.count,
          totalRevenue: data.revenue,
        }))
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 5);

      setStats({
        totalAccounts: profilesData.length,
        totalQuotes: quotesData.length,
        totalRevenue,
        quotesByStatus,
        recentQuotes: quotesData.slice(0, 10) as Quote[],
        topAccounts,
      });
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
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
        <div className="flex items-center gap-2 md:gap-4">
          <h1 className="[font-family:'Lexend',Helvetica] font-bold text-white text-xl md:text-2xl">
            Vid-QUO
          </h1>
          <div className="bg-white/20 px-2 md:px-3 py-1 rounded-lg">
            <span className="[font-family:'Lexend',Helvetica] font-bold text-white text-xs md:text-sm">
              SUPER ADMIN
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-3 md:gap-8 overflow-x-auto">
          <button
            onClick={() => navigate('/superadmin')}
            className="[font-family:'Lexend',Helvetica] font-semibold text-white text-sm md:text-lg hover:text-[#e9d5ff] transition-colors border-b-2 border-white whitespace-nowrap"
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
        <div className="mb-6 md:mb-8">
          <h1 className="[font-family:'Lexend',Helvetica] font-bold text-[#6b21a8] text-2xl md:text-2xl md:text-4xl mb-2">
            System Analytics
          </h1>
          <p className="[font-family:'Lexend',Helvetica] text-gray-700 text-sm md:text-lg">
            Overview of all accounts and system-wide metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <Card className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-[#9333ea] transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-[#9333ea] text-white rounded-lg px-6 py-3">
                <div className="[font-family:'Lexend',Helvetica] font-bold text-4xl">
                  {stats?.totalAccounts || 0}
                </div>
              </div>
              <Users className="w-12 h-12 text-[#9333ea]" />
            </div>
            <div className="space-y-1">
              <div className="[font-family:'Lexend',Helvetica] font-bold text-lg">Total Accounts</div>
              <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-600">
                Active admin accounts
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-xl border-2 border-[#6b21a8] hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-[#9333ea] text-white rounded-lg px-6 py-3">
                <div className="[font-family:'Lexend',Helvetica] font-bold text-4xl">
                  ${((stats?.totalRevenue || 0) / 1000).toFixed(0)}k
                </div>
              </div>
              <DollarSign className="w-12 h-12 text-[#9333ea]" />
            </div>
            <div className="space-y-1">
              <div className="[font-family:'Lexend',Helvetica] font-bold text-lg">Total Revenue</div>
              <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-600">
                All-time system revenue
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-[#9333ea] transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-[#9333ea] text-white rounded-lg px-6 py-3">
                <div className="[font-family:'Lexend',Helvetica] font-bold text-4xl">
                  {stats?.totalQuotes || 0}
                </div>
              </div>
              <FileText className="w-12 h-12 text-[#9333ea]" />
            </div>
            <div className="space-y-1">
              <div className="[font-family:'Lexend',Helvetica] font-bold text-lg">Total Quotes</div>
              <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-600">
                All quotes system-wide
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="p-6 bg-white rounded-xl border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-[#6b21a8]" />
              <h2 className="[font-family:'Lexend',Helvetica] font-bold text-xl">
                Quotes by Status
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="[font-family:'Lexend',Helvetica] font-medium">Done</span>
                <span className="[font-family:'Lexend',Helvetica] font-bold text-green-700">
                  {stats?.quotesByStatus.done || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="[font-family:'Lexend',Helvetica] font-medium">Emailed</span>
                <span className="[font-family:'Lexend',Helvetica] font-bold text-blue-700">
                  {stats?.quotesByStatus.emailed || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className="[font-family:'Lexend',Helvetica] font-medium">Exported</span>
                <span className="[font-family:'Lexend',Helvetica] font-bold text-orange-700">
                  {stats?.quotesByStatus.exported || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="[font-family:'Lexend',Helvetica] font-medium">Draft</span>
                <span className="[font-family:'Lexend',Helvetica] font-bold text-gray-700">
                  {stats?.quotesByStatus.draft || 0}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-xl border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-[#6b21a8]" />
              <h2 className="[font-family:'Lexend',Helvetica] font-bold text-xl">
                Top Accounts by Revenue
              </h2>
            </div>
            <div className="space-y-3">
              {stats?.topAccounts && stats.topAccounts.length > 0 ? (
                stats.topAccounts.map((account, index) => (
                  <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#9333ea] rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="[font-family:'Lexend',Helvetica] font-medium">
                        {account.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="[font-family:'Lexend',Helvetica] font-bold text-[#6b21a8]">
                        ${account.totalRevenue.toLocaleString()}
                      </div>
                      <div className="[font-family:'Lexend',Helvetica] text-xs text-gray-600">
                        {account.quoteCount} quotes
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 [font-family:'Lexend',Helvetica]">
                  No data available
                </div>
              )}
            </div>
          </Card>
        </div>

        <Card className="bg-white rounded-xl overflow-hidden">
          <div className="bg-[#6b21a8] px-4 md:px-6 py-3 md:py-4">
            <h2 className="[font-family:'Lexend',Helvetica] font-bold text-white text-xl">
              Recent Quotes (All Accounts)
            </h2>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left [font-family:'Lexend',Helvetica] font-bold text-gray-700 text-sm">
                  CLIENT NAME
                </th>
                <th className="px-6 py-3 text-left [font-family:'Lexend',Helvetica] font-bold text-gray-700 text-sm">
                  DATE CREATED
                </th>
                <th className="px-6 py-3 text-left [font-family:'Lexend',Helvetica] font-bold text-gray-700 text-sm">
                  AMOUNT
                </th>
                <th className="px-6 py-3 text-left [font-family:'Lexend',Helvetica] font-bold text-gray-700 text-sm">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentQuotes && stats.recentQuotes.length > 0 ? (
                stats.recentQuotes.map((quote, index) => (
                  <tr key={quote.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 [font-family:'Lexend',Helvetica] font-medium">
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center [font-family:'Lexend',Helvetica] text-gray-500">
                    No quotes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
