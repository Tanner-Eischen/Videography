import { Quote } from './supabase';

export interface DashboardMetrics {
  totalQuotes: number;
  quotesAccepted: number;
  quotesEmailed: number;
  quotesExported: number;
  totalFilmingHours: number;
  acceptedFilmingHours: number;
  totalPotentialRevenue: number;
  actualRevenue: number;
  daysScheduled: number;
  acceptedDaysScheduled: number;
  quotesPending: number;
  currentMonthRevenue: number;
  lastMonthRevenue: number;
  revenueGrowthPercent: number;
  currentMonthQuotes: number;
  lastMonthQuotes: number;
  quotesGrowthPercent: number;
}

export const calculateDashboardMetrics = (quotes: Quote[]): DashboardMetrics => {
  const totalQuotes = quotes.length;
  const acceptedQuotes = quotes.filter(q => q.is_accepted);
  const emailedQuotes = quotes.filter(q => q.status === 'emailed');
  const exportedQuotes = quotes.filter(q => q.status === 'exported' || q.status === 'downloaded');
  const pendingQuotes = quotes.filter(q => q.status === 'emailed' && !q.is_accepted);

  const totalFilmingHours = quotes.reduce((sum, q) => sum + (q.filming_hours || 0), 0);
  const acceptedFilmingHours = acceptedQuotes.reduce((sum, q) => sum + (q.filming_hours || 0), 0);

  const totalPotentialRevenue = quotes.reduce((sum, q) => sum + (q.revenue || 0), 0);
  const actualRevenue = acceptedQuotes.reduce((sum, q) => sum + (q.revenue || 0), 0);

  const daysScheduled = quotes.filter(q => q.project_start_date).length;
  const acceptedDaysScheduled = acceptedQuotes.filter(q => q.project_start_date).length;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthQuotesData = acceptedQuotes.filter(q => {
    const acceptedDate = new Date(q.accepted_at || q.updated_at);
    return acceptedDate.getMonth() === currentMonth && acceptedDate.getFullYear() === currentYear;
  });

  const lastMonthQuotesData = acceptedQuotes.filter(q => {
    const acceptedDate = new Date(q.accepted_at || q.updated_at);
    return acceptedDate.getMonth() === lastMonth && acceptedDate.getFullYear() === lastMonthYear;
  });

  const currentMonthRevenue = currentMonthQuotesData.reduce((sum, q) => sum + (q.revenue || 0), 0);
  const lastMonthRevenue = lastMonthQuotesData.reduce((sum, q) => sum + (q.revenue || 0), 0);
  const revenueGrowthPercent = lastMonthRevenue > 0
    ? Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
    : currentMonthRevenue > 0 ? 100 : 0;

  const currentMonthQuotes = currentMonthQuotesData.length;
  const lastMonthQuotes = lastMonthQuotesData.length;
  const quotesGrowthPercent = lastMonthQuotes > 0
    ? Math.round(((currentMonthQuotes - lastMonthQuotes) / lastMonthQuotes) * 100)
    : currentMonthQuotes > 0 ? 100 : 0;

  return {
    totalQuotes,
    quotesAccepted: acceptedQuotes.length,
    quotesEmailed: emailedQuotes.length,
    quotesExported: exportedQuotes.length,
    totalFilmingHours: Math.round(totalFilmingHours),
    acceptedFilmingHours: Math.round(acceptedFilmingHours),
    totalPotentialRevenue: Math.round(totalPotentialRevenue),
    actualRevenue: Math.round(actualRevenue),
    daysScheduled,
    acceptedDaysScheduled,
    quotesPending: pendingQuotes.length,
    currentMonthRevenue: Math.round(currentMonthRevenue),
    lastMonthRevenue: Math.round(lastMonthRevenue),
    revenueGrowthPercent,
    currentMonthQuotes,
    lastMonthQuotes,
    quotesGrowthPercent,
  };
};
