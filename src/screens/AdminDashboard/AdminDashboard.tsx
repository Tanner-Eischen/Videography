import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Avatar } from '../../components/ui/avatar';
import { supabase, Quote } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Download, Mail, Calendar, LogOut, User, Clock, DollarSign, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CircularGauge, SemiCircleGauge, ProgressBarGauge } from '../../components/ui/gauge';
import { calculateDashboardMetrics } from '../../lib/dashboardMetrics';

export const AdminDashboard = (): JSX.Element => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [growthView, setGrowthView] = useState<'revenue' | 'quotes'>('revenue');
  const isSuperAdmin = profile?.role === 'superadmin';

  useEffect(() => {
    if (profile?.id) {
      fetchClientQuotes();
    }
  }, [profile]);

  const fetchClientQuotes = async () => {
    if (!profile?.id) return;

    const { data: quotesData } = await supabase
      .from('quotes')
      .select('*')
      .eq('client_id', profile.id)
      .order('created_at', { ascending: false });

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

  const metrics = calculateDashboardMetrics(quotes);
  const completionRate = metrics.totalQuotes > 0
    ? Math.round((metrics.quotesAccepted / metrics.totalQuotes) * 100)
    : 0;

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
      <header className="bg-[#023c97] h-[70px] flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <h1 className="[font-family:'Lexend',Helvetica] font-bold text-white text-2xl">
            Vid-QUO
          </h1>
        </div>

        <nav className="flex items-center gap-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="[font-family:'Lexend',Helvetica] font-semibold text-white text-lg hover:text-[#75c4cc] transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/all-quotes')}
            className="[font-family:'Lexend',Helvetica] font-semibold text-white text-lg hover:text-[#75c4cc] transition-colors"
          >
            My Quotes
          </button>
          <button
            onClick={() => navigate('/create-quote')}
            className="[font-family:'Lexend',Helvetica] font-semibold text-white text-lg hover:text-[#75c4cc] transition-colors"
          >
            Create Quote
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleLogout}
            className="bg-transparent hover:bg-white/10 text-white px-4 py-2 rounded-lg [font-family:'Lexend',Helvetica] font-semibold flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
          <Avatar className="w-12 h-12 bg-[#5c8bb0]">
            <div className="w-full h-full flex items-center justify-center text-white">
              <User className="w-6 h-6" />
            </div>
          </Avatar>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-4xl mb-2">
            Welcome back, {profile?.full_name || 'Admin'}!
          </h1>
          <p className="[font-family:'Lexend',Helvetica] text-gray-700 text-lg">
            You've completed <span className="font-bold text-[#75c4cc]">{metrics.quotesAccepted}</span> of your quotes. Way to go!
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white rounded-xl border-2 border-gray-200">
            <div className="flex items-center justify-center">
              <CircularGauge
                value={metrics.quotesAccepted}
                max={metrics.totalQuotes || 1}
                label="Quote Status"
                color="#75c4cc"
                size="medium"
              />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="[font-family:'Lexend',Helvetica] text-gray-600">Draft</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#75c4cc]"></div>
                  <span className="[font-family:'Lexend',Helvetica] text-gray-600">Done</span>
                </div>
              </div>
              <div className="mb-4">
                <ProgressBarGauge
                  current={metrics.quotesAccepted}
                  total={metrics.totalQuotes}
                  label="Quotes Accepted"
                  color="#10b981"
                />
              </div>
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span className="[font-family:'Lexend',Helvetica] text-xs text-gray-600">Pending Response</span>
                </div>
                <span className="[font-family:'Lexend',Helvetica] font-bold text-lg text-orange-500">
                  {metrics.quotesPending}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white rounded-xl border-2 border-gray-200">
            <h3 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-lg mb-4 text-center">
              Quote Actions
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[#75c4cc]/10 rounded-lg">
                <div className="flex items-center justify-center w-14 h-14 bg-[#75c4cc] rounded-full">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="[font-family:'Lexend',Helvetica] font-bold text-2xl text-[#023c97]">
                    {metrics.quotesEmailed}
                  </div>
                  <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-600">
                    quotes emailed to clients
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-[#75c4cc]/10 rounded-lg">
                <div className="flex items-center justify-center w-14 h-14 bg-[#75c4cc] rounded-full">
                  <Download className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="[font-family:'Lexend',Helvetica] font-bold text-2xl text-[#023c97]">
                    {metrics.quotesExported}
                  </div>
                  <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-600">
                    quotes exported for clients
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-xl border-2 border-gray-200">
            <div className="flex items-center justify-center">
              <SemiCircleGauge
                value={metrics.acceptedDaysScheduled}
                max={metrics.daysScheduled || 1}
                label="Days Scheduled"
                subtitle={`${metrics.acceptedDaysScheduled} days accepted`}
                icon={<Calendar className="w-6 h-6 text-[#75c4cc]" />}
                color="#75c4cc"
              />
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#75c4cc]" />
                  <span className="[font-family:'Lexend',Helvetica] text-sm text-gray-600">Filming Hours</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="[font-family:'Lexend',Helvetica] font-bold text-2xl text-gray-600">
                    {metrics.totalFilmingHours}
                  </div>
                  <div className="[font-family:'Lexend',Helvetica] text-xs text-gray-500 mt-1">
                    Total Hours
                  </div>
                </div>
                <div className="text-center p-3 bg-[#10b981]/10 rounded-lg">
                  <div className="[font-family:'Lexend',Helvetica] font-bold text-2xl text-[#10b981]">
                    {metrics.acceptedFilmingHours}
                  </div>
                  <div className="[font-family:'Lexend',Helvetica] text-xs text-gray-500 mt-1">
                    Hours Accepted
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-white rounded-xl border-2 border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-xl">
                Month-over-Month Growth
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setGrowthView('revenue')}
                    className={`px-3 py-1 rounded-md text-xs [font-family:'Lexend',Helvetica] font-medium transition-all ${
                      growthView === 'revenue'
                        ? 'bg-[#023c97] text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Revenue
                  </button>
                  <button
                    onClick={() => setGrowthView('quotes')}
                    className={`px-3 py-1 rounded-md text-xs [font-family:'Lexend',Helvetica] font-medium transition-all ${
                      growthView === 'quotes'
                        ? 'bg-[#023c97] text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Quotes
                  </button>
                </div>
              </div>
            </div>

            {growthView === 'revenue' ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="[font-family:'Lexend',Helvetica] text-sm font-medium text-gray-600">
                    Revenue Growth
                  </span>
                  <span className={`[font-family:'Lexend',Helvetica] text-2xl font-bold ${metrics.revenueGrowthPercent >= 0 ? 'text-[#10b981]' : 'text-red-500'}`}>
                    {metrics.revenueGrowthPercent > 0 ? '+' : ''}{metrics.revenueGrowthPercent}%
                  </span>
                </div>

                <div className="relative h-48 mb-4 px-4">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
                    {metrics.monthlyData.map((data, index) => {
                      const padding = 8;
                      const x = padding + (index / (metrics.monthlyData.length - 1)) * (100 - 2 * padding);
                      const maxRevenue = Math.max(...metrics.monthlyData.map(d => d.revenue), 1);
                      const y = 100 - (data.revenue / maxRevenue) * 80;

                      return (
                        <g key={index}>
                          <line
                            x1={x}
                            y1="100"
                            x2={x}
                            y2="0"
                            stroke="#f0f0f0"
                            strokeWidth="0.3"
                            vectorEffect="non-scaling-stroke"
                          />
                          <text
                            x={x}
                            y="100"
                            dy="5"
                            textAnchor="middle"
                            className="[font-family:'Lexend',Helvetica] text-xs fill-gray-500"
                            style={{ fontSize: '4px' }}
                          >
                            {data.month}
                          </text>
                        </g>
                      );
                    })}

                    <polyline
                      points={metrics.monthlyData.map((data, index) => {
                        const padding = 8;
                        const x = padding + (index / (metrics.monthlyData.length - 1)) * (100 - 2 * padding);
                        const maxRevenue = Math.max(...metrics.monthlyData.map(d => d.revenue), 1);
                        const y = 100 - (data.revenue / maxRevenue) * 80;
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />

                    {metrics.monthlyData.map((data, index) => {
                      const padding = 8;
                      const x = padding + (index / (metrics.monthlyData.length - 1)) * (100 - 2 * padding);
                      const maxRevenue = Math.max(...metrics.monthlyData.map(d => d.revenue), 1);
                      const y = 100 - (data.revenue / maxRevenue) * 80;

                      return (
                        <g key={index}>
                          <circle
                            cx={x}
                            cy={y}
                            r="1.5"
                            fill="#10b981"
                            vectorEffect="non-scaling-stroke"
                          />
                          <text
                            x={x}
                            y={y}
                            dy="-3"
                            textAnchor="middle"
                            className="[font-family:'Lexend',Helvetica] text-xs font-bold fill-[#10b981]"
                            style={{ fontSize: '3.5px' }}
                          >
                            ${(data.revenue / 1000).toFixed(0)}k
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="[font-family:'Lexend',Helvetica] text-xs text-gray-500 mb-1">
                      Last Month
                    </div>
                    <div className="[font-family:'Lexend',Helvetica] font-bold text-lg text-gray-600">
                      ${metrics.lastMonthRevenue.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-[#10b981]/10 p-3 rounded-lg">
                    <div className="[font-family:'Lexend',Helvetica] text-xs text-gray-500 mb-1">
                      This Month
                    </div>
                    <div className="[font-family:'Lexend',Helvetica] font-bold text-lg text-[#10b981]">
                      ${metrics.currentMonthRevenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="[font-family:'Lexend',Helvetica] text-sm font-medium text-gray-600">
                    Quotes Growth
                  </span>
                  <span className={`[font-family:'Lexend',Helvetica] text-2xl font-bold ${metrics.quotesGrowthPercent >= 0 ? 'text-[#10b981]' : 'text-red-500'}`}>
                    {metrics.quotesGrowthPercent > 0 ? '+' : ''}{metrics.quotesGrowthPercent}%
                  </span>
                </div>

                <div className="relative h-48 mb-4 px-4">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
                    {metrics.monthlyData.map((data, index) => {
                      const padding = 8;
                      const x = padding + (index / (metrics.monthlyData.length - 1)) * (100 - 2 * padding);

                      return (
                        <g key={index}>
                          <line
                            x1={x}
                            y1="100"
                            x2={x}
                            y2="0"
                            stroke="#f0f0f0"
                            strokeWidth="0.3"
                            vectorEffect="non-scaling-stroke"
                          />
                          <text
                            x={x}
                            y="100"
                            dy="5"
                            textAnchor="middle"
                            className="[font-family:'Lexend',Helvetica] text-xs fill-gray-500"
                            style={{ fontSize: '4px' }}
                          >
                            {data.month}
                          </text>
                        </g>
                      );
                    })}

                    <polyline
                      points={metrics.monthlyData.map((data, index) => {
                        const padding = 8;
                        const x = padding + (index / (metrics.monthlyData.length - 1)) * (100 - 2 * padding);
                        const maxQuotes = Math.max(...metrics.monthlyData.map(d => d.quotes), 1);
                        const y = 100 - (data.quotes / maxQuotes) * 80;
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#75c4cc"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />

                    {metrics.monthlyData.map((data, index) => {
                      const padding = 8;
                      const x = padding + (index / (metrics.monthlyData.length - 1)) * (100 - 2 * padding);
                      const maxQuotes = Math.max(...metrics.monthlyData.map(d => d.quotes), 1);
                      const y = 100 - (data.quotes / maxQuotes) * 80;

                      return (
                        <g key={index}>
                          <circle
                            cx={x}
                            cy={y}
                            r="1.5"
                            fill="#75c4cc"
                            vectorEffect="non-scaling-stroke"
                          />
                          <text
                            x={x}
                            y={y}
                            dy="-3"
                            textAnchor="middle"
                            className="[font-family:'Lexend',Helvetica] text-xs font-bold fill-[#75c4cc]"
                            style={{ fontSize: '3.5px' }}
                          >
                            {data.quotes}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="[font-family:'Lexend',Helvetica] text-xs text-gray-500 mb-1">
                      Last Month
                    </div>
                    <div className="[font-family:'Lexend',Helvetica] font-bold text-lg text-gray-600">
                      {metrics.lastMonthQuotes}
                    </div>
                  </div>
                  <div className="bg-[#75c4cc]/10 p-3 rounded-lg">
                    <div className="[font-family:'Lexend',Helvetica] text-xs text-gray-500 mb-1">
                      This Month
                    </div>
                    <div className="[font-family:'Lexend',Helvetica] font-bold text-lg text-[#75c4cc]">
                      {metrics.currentMonthQuotes}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-white rounded-xl border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-xl">
                Revenue Overview
              </h3>
              <DollarSign className="w-8 h-8 text-[#75c4cc]" />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="[font-family:'Lexend',Helvetica] text-sm font-medium text-gray-600">
                    Total Potential Revenue
                  </span>
                  <span className="[font-family:'Lexend',Helvetica] text-2xl font-bold text-gray-400">
                    ${metrics.totalPotentialRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-400 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="[font-family:'Lexend',Helvetica] text-sm font-medium text-gray-600">
                    Actual Revenue (Accepted)
                  </span>
                  <span className="[font-family:'Lexend',Helvetica] text-2xl font-bold text-[#10b981]">
                    ${metrics.actualRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#10b981] rounded-full transition-all duration-500"
                    style={{ width: metrics.totalPotentialRevenue > 0 ? `${(metrics.actualRevenue / metrics.totalPotentialRevenue) * 100}%` : '0%' }}
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="[font-family:'Lexend',Helvetica] text-sm text-gray-600">
                    Conversion Rate
                  </span>
                  <span className="[font-family:'Lexend',Helvetica] text-xl font-bold text-[#023c97]">
                    {completionRate}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-2xl mb-4">
            Recent Quotes
          </h2>
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
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {quotes.length > 0 ? (
                quotes.slice(0, 5).map((quote, index) => (
                  <tr key={quote.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="[font-family:'Lexend',Helvetica] font-semibold text-lg">
                          {quote.client_name}
                        </div>
                        <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-600">
                          {quote.production_company || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 [font-family:'Lexend',Helvetica] text-lg">
                      {formatDate(quote.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full [font-family:'Lexend',Helvetica] font-semibold text-sm capitalize ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button className="bg-[#023c97] hover:bg-[#022d70] text-white px-4 py-2 rounded-lg">
                          <Mail className="w-4 h-4 mr-2" />
                          <span className="[font-family:'Lexend',Helvetica] font-semibold text-sm">
                            Email
                          </span>
                        </Button>
                        <Button className="bg-white hover:bg-gray-50 text-[#023c97] border-2 border-[#023c97] px-4 py-2 rounded-lg">
                          <Download className="w-4 h-4 mr-2" />
                          <span className="[font-family:'Lexend',Helvetica] font-semibold text-sm">
                            PDF Export
                          </span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-16 h-16 text-gray-300 mb-4" />
                      <div className="[font-family:'Lexend',Helvetica] text-gray-500 text-lg">
                        No quotes yet
                      </div>
                      <div className="[font-family:'Lexend',Helvetica] text-gray-400 text-sm mt-2">
                        Create your first quote to get started
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};
