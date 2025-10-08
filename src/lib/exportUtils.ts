import { Quote } from './supabase';

export const generateQuotePDF = (quote: Quote, formData?: any) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download PDF');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Quote - ${quote.client_name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Lexend', sans-serif;
          padding: 40px;
          color: #333;
        }

        .header {
          background: #023c97;
          color: white;
          padding: 30px;
          margin-bottom: 30px;
        }

        .header h1 {
          font-size: 32px;
          margin-bottom: 10px;
        }

        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }

        .section-title {
          background: #d4e8ea;
          padding: 15px;
          font-size: 20px;
          font-weight: 700;
          color: #023c97;
          margin-bottom: 15px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          padding: 15px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .info-label {
          font-weight: 600;
          color: #6b7280;
        }

        .info-value {
          font-weight: 500;
          color: #111827;
        }

        .price-section {
          background: #f3f4f6;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
        }

        .price {
          font-size: 48px;
          font-weight: 700;
          color: #023c97;
        }

        @media print {
          body {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Vid-QUO</h1>
        <p>Video Production Quote</p>
      </div>

      <div class="section">
        <div class="section-title">Client Information</div>
        <div class="info-grid">
          <div class="info-row">
            <span class="info-label">Client Name:</span>
            <span class="info-value">${quote.client_name || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">${quote.client_email || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone:</span>
            <span class="info-value">${quote.client_phone || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Production Company:</span>
            <span class="info-value">${quote.production_company || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Project Information</div>
        <div class="info-grid">
          <div class="info-row">
            <span class="info-label">Start Date:</span>
            <span class="info-value">${quote.project_start_date || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">End Date:</span>
            <span class="info-value">${quote.project_end_date || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Filming Hours:</span>
            <span class="info-value">${quote.filming_hours || 0} hours</span>
          </div>
          <div class="info-row">
            <span class="info-label">Tier:</span>
            <span class="info-value">${quote.tier || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div class="price-section">
        <div class="price">$${quote.revenue?.toLocaleString() || '0'}</div>
        <p style="margin-top: 10px; color: #6b7280;">Total Quote Amount</p>
      </div>

      <div class="section">
        <div class="info-row">
          <span class="info-label">Quote Created:</span>
          <span class="info-value">${new Date(quote.created_at).toLocaleDateString()}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status:</span>
          <span class="info-value">${quote.status}</span>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
  }, 250);
};

export const generateQuoteExcel = (quote: Quote) => {
  const csvContent = [
    ['Quote Information'],
    [''],
    ['Client Name', quote.client_name],
    ['Email', quote.client_email],
    ['Phone', quote.client_phone || 'N/A'],
    ['Production Company', quote.production_company || 'N/A'],
    [''],
    ['Project Information'],
    ['Start Date', quote.project_start_date || 'N/A'],
    ['End Date', quote.project_end_date || 'N/A'],
    ['Filming Hours', quote.filming_hours?.toString() || '0'],
    ['Tier', quote.tier || 'N/A'],
    [''],
    ['Financial'],
    ['Revenue', `$${quote.revenue?.toLocaleString() || '0'}`],
    [''],
    ['Status', quote.status],
    ['Created', new Date(quote.created_at).toLocaleDateString()],
  ]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `quote-${quote.client_name}-${Date.now()}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const sendQuoteEmail = async (quote: Quote) => {
  alert(`Email functionality will be implemented. Quote for ${quote.client_name} will be sent to ${quote.client_email}`);
};
