import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { CreateQuote } from '../CreateQuote/CreateQuote';

export const EditQuote = (): JSX.Element => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quoteData, setQuoteData] = useState<any>(null);

  useEffect(() => {
    if (quoteId) {
      fetchQuoteData();
    }
  }, [quoteId]);

  const fetchQuoteData = async () => {
    if (!quoteId) return;

    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .maybeSingle();

    if (error || !data) {
      alert('Quote not found');
      navigate('/all-quotes');
      return;
    }

    setQuoteData(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl [font-family:'Lexend',Helvetica]">Loading quote...</div>
      </div>
    );
  }

  return <CreateQuote existingQuote={quoteData} isEditMode={true} />;
};
