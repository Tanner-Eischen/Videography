import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Avatar } from '../../components/ui/avatar';
import { supabase, Quote } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Download, Mail, Calendar, LogOut, User, Clock, DollarSign, CircleCheck as CheckCircle, TrendingUp, CircleAlert as AlertCircle, CreditCard as Edit, Settings, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CircularGauge, SemiCircleGauge, ProgressBarGauge } from '../../components/ui/gauge';
import { calculateDashboardMetrics } from '../../lib/dashboardMetrics';
import { generateQuotePDF, generateQuoteExcel, sendQuoteEmail } from '../../lib/exportUtils';
import { EditQuoteModal } from '../../components/EditQuoteModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

export const AdminDashboard = (): JSX.Element => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [growthView, setGrowthView] = useState<'revenue' | 'quotes'>('revenue');
  const isSuperAdmin = profile?.role === 'superadmin';
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleExportPDF = async (quote: Quote) => {
    await supabase
      .from('quotes')
      .update({ status: 'exported' })
      .eq('id', quote.id);

    generateQuotePDF(quote);
    fetchClientQuotes();
  };

  const handleEmail = async (quote: Quote) => {
    await sendQuoteEmail(quote);
    await supabase
      .from('quotes')
      .update({ status: 'emailed' })
      .eq('id', quote.id);
    fetchClientQuotes();
  };

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchClientQuotes();
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer focus:outline-none">
                <Avatar className="w-12 h-12 bg-[#5c8bb0] hover:bg-[#4a7a9a] transition-colors">
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
          <Card className="p-6 bg-white rounded-xl border-2 border-gray-200 flex flex-col h-full">
            <div className="mb-4">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg">
                Quote Status
              </h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-4">
              <div className="relative">
                <svg height={180} width={180} className="transform -rotate-90">
                  <circle
                    stroke="#e5e7eb"
                    fill="transparent"
                    strokeWidth={24}
                    r={78}
                    cx={90}
                    cy={90}
                  />
                  <circle
                    stroke="#5c8bb0"
                    fill="transparent"
                    strokeWidth={24}
                    strokeDasharray={`${78 * 2 * Math.PI} ${78 * 2 * Math.PI}`}
                    style={{ strokeDashoffset: `${78 * 2 * Math.PI - (Math.min((metrics.quotesAccepted / (metrics.totalQuotes || 1)) * 100, 100) / 100) * 78 * 2 * Math.PI}`, transition: 'stroke-dashoffset 0.5s ease' }}
                    strokeLinecap="round"
                    r={78}
                    cx={90}
                    cy={90}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2">
                    <FileText className="w-7 h-7 text-[#5c8bb0]" />
                    <div className="[font-family:'Lexend',Helvetica] font-bold text-4xl text-[#5c8bb0]">
                      {metrics.quotesAccepted}
                    </div>
                  </div>
                  <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-500 mt-1">
                    of {metrics.totalQuotes} quotes
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3 mt-4">
              <ProgressBarGauge
                current={metrics.quotesAccepted}
                total={metrics.totalQuotes}
                label="quotes accepted"
                color="#10b981"
              />
              <ProgressBarGauge
                current={metrics.quotesDrafted}
                total={metrics.totalQuotes}
                label="quotes drafted"
                color="#d1d5db"
              />
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-xl border-2 border-gray-200 flex flex-col h-full">
            <div className="mb-4">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg">
                Production Hours
              </h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-4">
              <div className="relative mb-4">
                <svg height={110} width={200} className="transform rotate-180">
                  <path
                    d="M 18 100 A 72 72 0 0 1 182 100"
                    stroke="#e5e7eb"
                    fill="transparent"
                    strokeWidth={18}
                    strokeLinecap="round"
                  />
                  <path
                    d="M 18 100 A 72 72 0 0 1 182 100"
                    stroke="#5c8bb0"
                    fill="transparent"
                    strokeWidth={18}
                    strokeDasharray={`${72 * Math.PI} ${72 * Math.PI}`}
                    style={{ strokeDashoffset: `${72 * Math.PI - (Math.min((metrics.acceptedFilmingHours / (metrics.totalFilmingHours || 1)) * 100, 100) / 100) * 72 * Math.PI}`, transition: 'stroke-dashoffset 0.5s ease' }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center" style={{ top: '45%' }}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-6 h-6 text-[#5c8bb0]" />
                    <div className="[font-family:'Lexend',Helvetica] font-bold text-4xl text-[#5c8bb0]">
                      {metrics.acceptedFilmingHours}
                    </div>
                  </div>
                  <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-500 mt-1">
                    of {metrics.totalFilmingHours} hours
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3 mt-4">
              <ProgressBarGauge
                current={metrics.acceptedFilmingHours}
                total={metrics.totalFilmingHours}
                label="hours accepted"
                color="#10b981"
              />
              <ProgressBarGauge
                current={metrics.totalFilmingHours - metrics.acceptedFilmingHours}
                total={metrics.totalFilmingHours}
                label="hours drafted"
                color="#d1d5db"
              />
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-xl border-2 border-gray-200 flex flex-col h-full">
            <div className="mb-4">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg">
                Days Scheduled
              </h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-4">
              <div className="relative mb-4">
                <svg height={110} width={200} className="transform rotate-180">
                  <path
                    d="M 18 100 A 72 72 0 0 1 182 100"
                    stroke="#e5e7eb"
                    fill="transparent"
                    strokeWidth={18}
                    strokeLinecap="round"
                  />
                  <path
                    d="M 18 100 A 72 72 0 0 1 182 100"
                    stroke="#5c8bb0"
                    fill="transparent"
                    strokeWidth={18}
                    strokeDasharray={`${72 * Math.PI} ${72 * Math.PI}`}
                    style={{ strokeDashoffset: `${72 * Math.PI - (Math.min((metrics.acceptedDaysScheduled / (metrics.daysScheduled || 1)) * 100, 100) / 100) * 72 * Math.PI}`, transition: 'stroke-dashoffset 0.5s ease' }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center" style={{ top: '45%' }}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-[#5c8bb0]" />
                    <div className="[font-family:'Lexend',Helvetica] font-bold text-4xl text-[#5c8bb0]">
                      {metrics.acceptedDaysScheduled}
                    </div>
                  </div>
                  <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-500 mt-1">
                    of {metrics.daysScheduled} days
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3 mt-4">
              <ProgressBarGauge
                current={metrics.acceptedDaysScheduled}
                total={metrics.daysScheduled}
                label="days accepted"
                color="#10b981"
              />
              <ProgressBarGauge
                current={metrics.daysScheduled - metrics.acceptedDaysScheduled}
                total={metrics.daysScheduled}
                label="days drafted"
                color="#d1d5db"
              />
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

                <div className="relative h-48 mb-4">
                  <svg width="100%" height="100%" className="overflow-visible">
                    {metrics.monthlyData.map((data, index) => {
                      const x = (index / (metrics.monthlyData.length - 1)) * 100;
                      const maxRevenue = Math.max(...metrics.monthlyData.map(d => d.revenue), 1);
                      const y = 100 - (data.revenue / maxRevenue) * 80;

                      return (
                        <g key={index}>
                          <line
                            x1={`${x}%`}
                            y1="100%"
                            x2={`${x}%`}
                            y2="0%"
                            stroke="#f0f0f0"
                            strokeWidth="1"
                          />
                          <text
                            x={`${x}%`}
                            y="100%"
                            dy="16"
                            textAnchor="middle"
                            className="[font-family:'Lexend',Helvetica] text-xs fill-gray-500"
                          >
                            {data.month}
                          </text>
                        </g>
                      );
                    })}

                    <polyline
                      points={metrics.monthlyData.map((data, index) => {
                        const x = (index / (metrics.monthlyData.length - 1)) * 100;
                        const maxRevenue = Math.max(...metrics.monthlyData.map(d => d.revenue), 1);
                        const y = 100 - (data.revenue / maxRevenue) * 80;
                        return `${x}%,${y}%`;
                      }).join(' ')}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {metrics.monthlyData.map((data, index) => {
                      const x = (index / (metrics.monthlyData.length - 1)) * 100;
                      const maxRevenue = Math.max(...metrics.monthlyData.map(d => d.revenue), 1);
                      const y = 100 - (data.revenue / maxRevenue) * 80;

                      return (
                        <g key={index}>
                          <circle
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r="4"
                            fill="#10b981"
                          />
                          <text
                            x={`${x}%`}
                            y={`${y}%`}
                            dy="-10"
                            textAnchor="middle"
                            className="[font-family:'Lexend',Helvetica] text-xs font-bold fill-[#10b981]"
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

                <div className="relative h-48 mb-4">
                  <svg width="100%" height="100%" className="overflow-visible">
                    {metrics.monthlyData.map((data, index) => {
                      const x = (index / (metrics.monthlyData.length - 1)) * 100;

                      return (
                        <g key={index}>
                          <line
                            x1={`${x}%`}
                            y1="100%"
                            x2={`${x}%`}
                            y2="0%"
                            stroke="#f0f0f0"
                            strokeWidth="1"
                          />
                          <text
                            x={`${x}%`}
                            y="100%"
                            dy="16"
                            textAnchor="middle"
                            className="[font-family:'Lexend',Helvetica] text-xs fill-gray-500"
                          >
                            {data.month}
                          </text>
                        </g>
                      );
                    })}

                    <polyline
                      points={metrics.monthlyData.map((data, index) => {
                        const x = (index / (metrics.monthlyData.length - 1)) * 100;
                        const maxQuotes = Math.max(...metrics.monthlyData.map(d => d.quotes), 1);
                        const y = 100 - (data.quotes / maxQuotes) * 80;
                        return `${x}%,${y}%`;
                      }).join(' ')}
                      fill="none"
                      stroke="#75c4cc"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {metrics.monthlyData.map((data, index) => {
                      const x = (index / (metrics.monthlyData.length - 1)) * 100;
                      const maxQuotes = Math.max(...metrics.monthlyData.map(d => d.quotes), 1);
                      const y = 100 - (data.quotes / maxQuotes) * 80;

                      return (
                        <g key={index}>
                          <circle
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r="4"
                            fill="#75c4cc"
                          />
                          <text
                            x={`${x}%`}
                            y={`${y}%`}
                            dy="-10"
                            textAnchor="middle"
                            className="[font-family:'Lexend',Helvetica] text-xs font-bold fill-[#75c4cc]"
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

          <Card className="p-6 bg-white rounded-xl border-2 border-gray-200 flex flex-col h-full">
            <div className="mb-4">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-black text-lg">
                Revenue Overview
              </h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-4">
              <div className="relative mb-4">
                <svg height={110} width={200} className="transform rotate-180">
                  <path
                    d="M 18 100 A 72 72 0 0 1 182 100"
                    stroke="#e5e7eb"
                    fill="transparent"
                    strokeWidth={18}
                    strokeLinecap="round"
                  />
                  <path
                    d="M 18 100 A 72 72 0 0 1 182 100"
                    stroke="#5c8bb0"
                    fill="transparent"
                    strokeWidth={18}
                    strokeDasharray={`${72 * Math.PI} ${72 * Math.PI}`}
                    style={{ strokeDashoffset: `${72 * Math.PI - (Math.min((metrics.actualRevenue / (metrics.totalPotentialRevenue || 1)) * 100, 100) / 100) * 72 * Math.PI}`, transition: 'stroke-dashoffset 0.5s ease' }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center" style={{ top: '45%' }}>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-[#5c8bb0]" />
                    <div className="[font-family:'Lexend',Helvetica] font-bold text-3xl text-[#5c8bb0]">
                      ${(metrics.actualRevenue / 1000).toFixed(1)}k
                    </div>
                  </div>
                  <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-500 mt-1">
                    of ${(metrics.totalPotentialRevenue / 1000).toFixed(1)}k
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3 mt-4">
              <ProgressBarGauge
                current={metrics.actualRevenue}
                total={metrics.totalPotentialRevenue}
                label={`$${metrics.actualRevenue.toLocaleString()} revenue accepted`}
                color="#10b981"
              />
              <ProgressBarGauge
                current={metrics.totalPotentialRevenue - metrics.actualRevenue}
                total={metrics.totalPotentialRevenue}
                label={`$${(metrics.totalPotentialRevenue - metrics.actualRevenue).toLocaleString()} revenue drafted`}
                color="#d1d5db"
              />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="[font-family:'Lexend',Helvetica] text-sm text-gray-600">
                  Conversion Rate
                </span>
                <span className="[font-family:'Lexend',Helvetica] text-xl font-bold text-[#023c97]">
                  {completionRate}%
                </span>
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
                      <button
                        onClick={() => handleEditQuote(quote)}
                        className="space-y-1 hover:opacity-75 transition-opacity text-left w-full"
                      >
                        <div className="[font-family:'Lexend',Helvetica] font-semibold text-lg flex items-center gap-2">
                          <Edit className="w-4 h-4 text-gray-600" />
                          {quote.client_name}
                        </div>
                        <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-600">
                          {quote.production_company || 'N/A'}
                        </div>
                      </button>
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
                        <Button
                          onClick={() => handleEmail(quote)}
                          className="bg-[#023c97] hover:bg-[#022d70] text-white px-4 py-2 rounded-lg"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          <span className="[font-family:'Lexend',Helvetica] font-semibold text-sm">
                            Email
                          </span>
                        </Button>
                        <Button
                          onClick={() => handleExportPDF(quote)}
                          className="bg-white hover:bg-gray-50 text-[#023c97] border-2 border-[#023c97] px-4 py-2 rounded-lg"
                        >
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

      {editingQuote && (
        <EditQuoteModal
          quote={editingQuote}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};
