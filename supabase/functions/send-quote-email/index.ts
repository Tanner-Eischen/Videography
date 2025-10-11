import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailRequest {
  to: string;
  clientName: string;
  quoteData: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    projectStartDate: string;
    projectEndDate: string;
    filmingHours: number;
    tier: string;
    revenue: number;
    status: string;
    createdAt: string;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { to, clientName, quoteData }: EmailRequest = await req.json();

    if (!to || !clientName || !quoteData) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ 
          error: "Email service not configured",
          message: "Quote email simulation - in production, this would send an email to " + to 
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Lexend', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .header {
            background: #003D82;
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
          }
          
          .section {
            margin-bottom: 25px;
          }
          
          .section-title {
            background: #E8EFF3;
            padding: 12px 15px;
            font-size: 16px;
            font-weight: 700;
            color: #003D82;
            margin-bottom: 15px;
            border-radius: 4px;
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
            background: #E8EFF3;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            border-radius: 8px;
          }
          
          .price {
            font-size: 42px;
            font-weight: 700;
            color: #003D82;
            margin: 0;
          }
          
          .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Vid-QUO</h1>
          <p style="margin: 5px 0 0 0;">Your Video Production Quote</p>
        </div>
        
        <div class="content">
          <p>Dear ${quoteData.clientName},</p>
          <p>Thank you for your interest! Please find your video production quote details below:</p>
          
          <div class="section">
            <div class="section-title">Client Information</div>
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">${quoteData.clientName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${quoteData.clientEmail}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">${quoteData.clientPhone || 'N/A'}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Project Information</div>
            <div class="info-row">
              <span class="info-label">Start Date:</span>
              <span class="info-value">${quoteData.projectStartDate || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">End Date:</span>
              <span class="info-value">${quoteData.projectEndDate || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Filming Hours:</span>
              <span class="info-value">${quoteData.filmingHours || 0} hours</span>
            </div>
            <div class="info-row">
              <span class="info-label">Tier:</span>
              <span class="info-value">${quoteData.tier || 'Standard'}</span>
            </div>
          </div>
          
          <div class="price-section">
            <div class="price">$${quoteData.revenue?.toLocaleString() || '0'}</div>
            <p style="margin: 10px 0 0 0; color: #6b7280;">Total Quote Amount</p>
          </div>
          
          <div class="section">
            <div class="info-row">
              <span class="info-label">Quote Created:</span>
              <span class="info-value">${new Date(quoteData.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="info-value">${quoteData.status}</span>
            </div>
          </div>
          
          <p style="margin-top: 30px;">If you have any questions or would like to discuss this quote further, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>The Vid-QUO Team</p>
        </div>
        
        <div class="footer">
          <p>This is an automated email from Vid-QUO. Please do not reply directly to this email.</p>
        </div>
      </body>
      </html>
    `;

    const emailText = `
Dear ${quoteData.clientName},

Thank you for your interest! Please find your video production quote details below:

Client Information:
- Name: ${quoteData.clientName}
- Email: ${quoteData.clientEmail}
- Phone: ${quoteData.clientPhone || 'N/A'}

Project Information:
- Start Date: ${quoteData.projectStartDate || 'N/A'}
- End Date: ${quoteData.projectEndDate || 'N/A'}
- Filming Hours: ${quoteData.filmingHours || 0} hours
- Tier: ${quoteData.tier || 'Standard'}

Total Quote Amount: $${quoteData.revenue?.toLocaleString() || '0'}

Quote Created: ${new Date(quoteData.createdAt).toLocaleDateString()}
Status: ${quoteData.status}

If you have any questions or would like to discuss this quote further, please don't hesitate to contact us.

Best regards,
The Vid-QUO Team
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Vid-QUO <onboarding@resend.dev>",
        to: [to],
        subject: `Your Video Production Quote - ${clientName}`,
        html: emailHtml,
        text: emailText,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error("Resend API error:", errorData);
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to send email",
          details: errorData 
        }),
        {
          status: resendResponse.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const result = await resendResponse.json();

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Email sent successfully",
        emailId: result.id 
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in send-quote-email function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});