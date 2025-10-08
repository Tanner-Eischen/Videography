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
}

export const calculateDashboardMetrics = (quotes: Quote[]): DashboardMetrics => {
  const totalQuotes = quotes.length;
  const acceptedQuotes = quotes.filter(q => q.is_accepted);
  const emailedQuotes = quotes.filter(q => q.status === 'emailed');
  const exportedQuotes = quotes.filter(q => q.status === 'exported' || q.status === 'downloaded');

  const totalFilmingHours = quotes.reduce((sum, q) => sum + (q.filming_hours || 0), 0);
  const acceptedFilmingHours = acceptedQuotes.reduce((sum, q) => sum + (q.filming_hours || 0), 0);

  const totalPotentialRevenue = quotes.reduce((sum, q) => sum + (q.revenue || 0), 0);
  const actualRevenue = acceptedQuotes.reduce((sum, q) => sum + (q.revenue || 0), 0);

  const daysScheduled = quotes.filter(q => q.project_start_date).length;
  const acceptedDaysScheduled = acceptedQuotes.filter(q => q.project_start_date).length;

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
  };
};
