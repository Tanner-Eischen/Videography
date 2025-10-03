import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Avatar } from '../../components/ui/avatar';
import { supabase, Quote, DashboardStats } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Users, DollarSign, FileText, Download, Mail, TrendingUp } from 'lucide-react';

export const AdminDashboard = (): JSX.Element => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'admin' | 'client'>('admin');

  useEffect(() => {
    if (profile?.id) {
      fetchDashboardData();
    }
  }, [profile]);

  const fetchDashboardData = async () => {
    if (!profile?.id) return;

    const { data: statsData } = await supabase
      .from('dashboard_stats')
      .select('*')
      .eq('user_id', profile.id)
      .maybeSingle();

    if (statsData) {
      setStats(statsData as DashboardStats);
    } else {
      const defaultStats: Partial<DashboardStats> = {
        user_id: profile.id,
        total_clients: 673,
        total_revenue: 19000,
        total_quotes: 1083,
        clients_change_percent: 19,
        revenue_change_percent: 15,
        quotes_change_percent: 27,
      };

      await supabase.from('dashboard_stats').insert(defaultStats);
      setStats(defaultStats as DashboardStats);
    }

    const { data: quotesData } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (quotesData) {
      setQuotes(quotesData as Quote[]);
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
        return 'text-green-600';
      case 'draft':
        return 'text-gray-600';
      case 'exported':
        return 'text-orange-600';
      case 'emailed':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
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
      <header className="bg-[#023c97] h-[70px] flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center">
            <img className="w-8 h-8" alt="Logo" src="/v.png" />
          </div>
        </div>

        <nav className="flex items-center gap-8">
          <a href="#dashboard" className="[font-family:'Lexend',Helvetica] font-semibold text-white text-lg hover:text-[#75c4cc] transition-colors">
            DASHBOARD
          </a>
          <a href="#create-quote" className="[font-family:'Lexend',Helvetica] font-semibold text-white text-lg hover:text-[#75c4cc] transition-colors">
            CREATE QUOTE
          </a>
          <a href="#all-quotes" className="[font-family:'Lexend',Helvetica] font-semibold text-white text-lg hover:text-[#75c4cc] transition-colors">
            ALL QUOTES
          </a>
        </nav>

        <Avatar className="w-12 h-12 bg-[#75c4cc]">
          <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
            {profile?.full_name?.charAt(0) || 'A'}
          </div>
        </Avatar>
      </header>

      <div className="max-w-[1400px] mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-4xl mb-2">
            Welcome, {profile?.full_name || 'Daniel'}!
          </h1>
          <p className="[font-family:'Lexend',Helvetica] text-gray-700 text-lg">
            Here is what is happening with your business today.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-[#75c4cc] transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-[#75c4cc] text-white rounded-lg px-6 py-3">
                <div className="[font-family:'Lexend',Helvetica] font-bold text-4xl">
                  {stats?.total_clients || 673}
                </div>
              </div>
              <Users className="w-12 h-12 text-[#75c4cc]" />
            </div>
            <div className="space-y-1">
              <div className="[font-family:'Lexend',Helvetica] font-bold text-lg">Total</div>
              <div className="[font-family:'Lexend',Helvetica] font-bold text-lg">Clients</div>
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="[font-family:'Lexend',Helvetica] font-semibold">
                  + {stats?.clients_change_percent || 19}%
                </span>
              </div>
              <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-600">
                higher than last month
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-xl border-2 border-[#023c97] hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-[#75c4cc] text-white rounded-lg px-6 py-3">
                <div className="[font-family:'Lexend',Helvetica] font-bold text-4xl">
                  {(stats?.total_revenue || 19000) / 1000}k
                </div>
              </div>
              <DollarSign className="w-12 h-12 text-[#75c4cc]" />
            </div>
            <div className="space-y-1">
              <div className="[font-family:'Lexend',Helvetica] font-bold text-lg">Total</div>
              <div className="[font-family:'Lexend',Helvetica] font-bold text-lg">Revenue</div>
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="[font-family:'Lexend',Helvetica] font-semibold">
                  + {stats?.revenue_change_percent || 15}%
                </span>
              </div>
              <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-600">
                higher than last month
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-[#75c4cc] transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-[#75c4cc] text-white rounded-lg px-6 py-3">
                <div className="[font-family:'Lexend',Helvetica] font-bold text-4xl">
                  {stats?.total_quotes || 1083}
                </div>
              </div>
              <FileText className="w-12 h-12 text-[#75c4cc]" />
            </div>
            <div className="space-y-1">
              <div className="[font-family:'Lexend',Helvetica] font-bold text-lg">Total</div>
              <div className="[font-family:'Lexend',Helvetica] font-bold text-lg">Quotes</div>
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="[font-family:'Lexend',Helvetica] font-semibold">
                  + {stats?.quotes_change_percent || 27}%
                </span>
              </div>
              <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-600">
                higher than last month
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mb-6">
          <Button
            onClick={() => setActiveView('admin')}
            className={`px-6 py-3 rounded-lg [font-family:'Lexend',Helvetica] font-semibold text-lg ${
              activeView === 'admin'
                ? 'bg-[#75c4cc] text-white'
                : 'bg-white text-[#75c4cc] border-2 border-[#75c4cc]'
            }`}
          >
            My View
          </Button>
          <Button
            onClick={() => setActiveView('client')}
            className={`px-6 py-3 rounded-lg [font-family:'Lexend',Helvetica] font-semibold text-lg ${
              activeView === 'client'
                ? 'bg-[#75c4cc] text-white'
                : 'bg-white text-[#75c4cc] border-2 border-[#75c4cc]'
            }`}
          >
            Client View
          </Button>
        </div>

        <Card className="bg-white rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#023c97]">
              <tr>
                <th className="px-6 py-4 text-left [font-family:'Lexend',Helvetica] font-bold text-white text-lg">
                  CLIENT NAME
                </th>
                <th className="px-6 py-4 text-left [font-family:'Lexend',Helvetica] font-bold text-white text-lg">
                  DATE CREATED
                </th>
                <th className="px-6 py-4 text-left [font-family:'Lexend',Helvetica] font-bold text-white text-lg">
                  STATUS
                </th>
                <th className="px-6 py-4 text-left [font-family:'Lexend',Helvetica] font-bold text-white text-lg">
                  DOWNLOAD/EMAIL
                </th>
              </tr>
            </thead>
            <tbody>
              {quotes.length > 0 ? (
                quotes.map((quote, index) => (
                  <tr key={quote.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <span className="[font-family:'Lexend',Helvetica] font-medium text-lg">
                          {quote.client_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 [font-family:'Lexend',Helvetica] text-lg">
                      {formatDate(quote.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`[font-family:'Lexend',Helvetica] font-semibold text-lg capitalize ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <Button className="bg-transparent hover:bg-gray-100 p-2">
                          <Download className="w-5 h-5 text-black" />
                          <span className="ml-2 [font-family:'Lexend',Helvetica] font-semibold text-black">
                            Download
                          </span>
                        </Button>
                        <Button className="bg-transparent hover:bg-gray-100 p-2">
                          <Mail className="w-5 h-5 text-black" />
                          <span className="ml-2 [font-family:'Lexend',Helvetica] font-semibold text-black">
                            Email
                          </span>
                        </Button>
                      </div>
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
        </Card>

        <div className="flex justify-end mt-8">
          <Button className="bg-[#023c97] hover:bg-[#022d70] text-white px-8 py-4 rounded-lg [font-family:'Lexend',Helvetica] font-bold text-lg">
            See All Quotes
          </Button>
        </div>
      </div>
    </div>
  );
};
