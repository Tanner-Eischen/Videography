import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Avatar } from '../../components/ui/avatar';
import { supabase, Quote } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Download, Mail, Calendar, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ClientDashboard = (): JSX.Element => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

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

  const pendingQuotes = quotes.filter(q => q.status === 'draft').length;
  const completedQuotes = quotes.filter(q => q.status === 'done').length;

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
          <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center">
            <img className="w-8 h-8" alt="Logo" src="/v.png" />
          </div>
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
          <Avatar className="w-12 h-12 bg-[#75c4cc]">
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
              {profile?.full_name?.charAt(0) || 'C'}
            </div>
          </Avatar>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-4xl mb-2">
            Welcome, {profile?.full_name || 'Client'}!
          </h1>
          <p className="[font-family:'Lexend',Helvetica] text-gray-700 text-lg">
            Here are your quotes and project information.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-[#75c4cc] transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-[#75c4cc] text-white rounded-lg px-6 py-3">
                <div className="[font-family:'Lexend',Helvetica] font-bold text-4xl">
                  {quotes.length}
                </div>
              </div>
              <FileText className="w-12 h-12 text-[#75c4cc]" />
            </div>
            <div className="space-y-1">
              <div className="[font-family:'Lexend',Helvetica] font-bold text-lg">Total</div>
              <div className="[font-family:'Lexend',Helvetica] font-bold text-lg">Quotes</div>
              <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-600 mt-2">
                All your project quotes
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-xl border-2 border-[#023c97] hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-[#fbbf24] text-white rounded-lg px-6 py-3">
                <div className="[font-family:'Lexend',Helvetica] font-bold text-4xl">
                  {pendingQuotes}
                </div>
              </div>
              <Calendar className="w-12 h-12 text-[#fbbf24]" />
            </div>
            <div className="space-y-1">
              <div className="[font-family:'Lexend',Helvetica] font-bold text-lg">Pending</div>
              <div className="[font-family:'Lexend',Helvetica] font-bold text-lg">Quotes</div>
              <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-600 mt-2">
                Awaiting completion
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-[#75c4cc] transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-green-500 text-white rounded-lg px-6 py-3">
                <div className="[font-family:'Lexend',Helvetica] font-bold text-4xl">
                  {completedQuotes}
                </div>
              </div>
              <FileText className="w-12 h-12 text-green-500" />
            </div>
            <div className="space-y-1">
              <div className="[font-family:'Lexend',Helvetica] font-bold text-lg">Completed</div>
              <div className="[font-family:'Lexend',Helvetica] font-bold text-lg">Quotes</div>
              <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-600 mt-2">
                Ready for review
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-2xl mb-4">
            My Quotes
          </h2>
        </div>

        <Card className="bg-white rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#023c97]">
              <tr>
                <th className="px-6 py-4 text-left [font-family:'Lexend',Helvetica] font-bold text-white text-lg">
                  PROJECT
                </th>
                <th className="px-6 py-4 text-left [font-family:'Lexend',Helvetica] font-bold text-white text-lg">
                  DATE CREATED
                </th>
                <th className="px-6 py-4 text-left [font-family:'Lexend',Helvetica] font-bold text-white text-lg">
                  STATUS
                </th>
                <th className="px-6 py-4 text-left [font-family:'Lexend',Helvetica] font-bold text-white text-lg">
                  TIER
                </th>
                <th className="px-6 py-4 text-left [font-family:'Lexend',Helvetica] font-bold text-white text-lg">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {quotes.length > 0 ? (
                quotes.map((quote, index) => (
                  <tr key={quote.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="[font-family:'Lexend',Helvetica] font-semibold text-lg">
                          {quote.production_company || 'Untitled Project'}
                        </div>
                        <div className="[font-family:'Lexend',Helvetica] text-sm text-gray-600">
                          {quote.client_name}
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
                      <span className="[font-family:'Lexend',Helvetica] font-medium text-lg capitalize">
                        {quote.tier || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button className="bg-[#023c97] hover:bg-[#022d70] text-white px-4 py-2 rounded-lg">
                          <Download className="w-4 h-4 mr-2" />
                          <span className="[font-family:'Lexend',Helvetica] font-semibold text-sm">
                            Download
                          </span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-16 h-16 text-gray-300 mb-4" />
                      <div className="[font-family:'Lexend',Helvetica] text-gray-500 text-lg">
                        No quotes yet
                      </div>
                      <div className="[font-family:'Lexend',Helvetica] text-gray-400 text-sm mt-2">
                        Contact your account manager to create your first quote
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

        {quotes.length > 0 && (
          <div className="mt-8 p-6 bg-white rounded-xl border-2 border-gray-200">
            <h3 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-xl mb-4">
              Need help?
            </h3>
            <p className="[font-family:'Lexend',Helvetica] text-gray-700 mb-4">
              If you have any questions about your quotes or need assistance, please contact your account manager.
            </p>
            <Button className="bg-[#75c4cc] hover:bg-[#60b0b8] text-white px-6 py-3 rounded-lg [font-family:'Lexend',Helvetica] font-semibold">
              <Mail className="w-5 h-5 mr-2" />
              Contact Support
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
