import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Avatar } from '../../components/ui/avatar';
import { supabase, Quote } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Download, Mail, LogOut, User, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateQuotePDF, generateQuoteExcel, sendQuoteEmail } from '../../lib/exportUtils';
import { EditQuoteModal } from '../../components/EditQuoteModal';

export const AllQuotes = (): JSX.Element => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    const { data: quotesData } = await supabase
      .from('quotes')
      .select('*')
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
    fetchQuotes();
  };

  const handleExportExcel = (quote: Quote) => {
    generateQuoteExcel(quote);
  };

  const handleEmail = async (quote: Quote) => {
    await sendQuoteEmail(quote);
    await supabase
      .from('quotes')
      .update({ status: 'emailed' })
      .eq('id', quote.id);
    fetchQuotes();
  };

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchQuotes();
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
            onClick={() => navigate('/create-quote')}
            className="[font-family:'Lexend',Helvetica] font-semibold text-white text-lg hover:text-[#75c4cc] transition-colors"
          >
            Create Quote
          </button>
          <button
            onClick={() => navigate('/all-quotes')}
            className="[font-family:'Lexend',Helvetica] font-semibold text-white text-lg hover:text-[#75c4cc] transition-colors"
          >
            All Quotes
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleLogout}
            className="bg-transparent hover:bg-white/10 text-white px-4 py-2 rounded-lg [font-family:'Lexend',Helvetica] font-semibold flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
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
            All Quotes
          </h1>
          <p className="[font-family:'Lexend',Helvetica] text-gray-700 text-lg">
            View and manage all your quotes.
          </p>
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
                      <button
                        onClick={() => handleEditQuote(quote)}
                        className="flex items-center gap-3 hover:opacity-75 transition-opacity text-left w-full"
                      >
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <Edit className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="[font-family:'Lexend',Helvetica] font-medium text-lg">
                          {quote.client_name}
                        </span>
                      </button>
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
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleExportPDF(quote)}
                          className="bg-transparent hover:bg-gray-100 p-2"
                        >
                          <Download className="w-5 h-5 text-black" />
                          <span className="ml-2 [font-family:'Lexend',Helvetica] font-semibold text-black">
                            PDF
                          </span>
                        </Button>
                        <Button
                          onClick={() => handleExportExcel(quote)}
                          className="bg-transparent hover:bg-gray-100 p-2"
                        >
                          <Download className="w-5 h-5 text-black" />
                          <span className="ml-2 [font-family:'Lexend',Helvetica] font-semibold text-black">
                            Excel
                          </span>
                        </Button>
                        <Button
                          onClick={() => handleEmail(quote)}
                          className="bg-transparent hover:bg-gray-100 p-2"
                        >
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

        <div className="flex justify-start mt-8">
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-[#5a5a5a] hover:bg-[#4a4a4a] text-white px-8 py-4 rounded-lg [font-family:'Lexend',Helvetica] font-bold text-lg"
          >
            Back to Dashboard
          </Button>
        </div>
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
