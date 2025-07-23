// Email service utility for sending welcome and other emails via Resend
// Uses Resend API directly for sending custom emails

interface WelcomeEmailData {
  email: string;
  name: string;
  nickname?: string;
  signupDate: string;
}

interface EmailResponse {
  success: boolean;
  error?: string;
  messageId?: string;
}

/**
 * Sends a welcome email to newly registered users
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<EmailResponse> {
  try {
    console.log('EmailService: Sending welcome email to:', data.email);
    
    const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.error('EmailService: VITE_RESEND_API_KEY not found in environment variables');
      return { 
        success: false, 
        error: 'Resend API key not configured' 
      };
    }

    const displayName = data.nickname || data.name || 'Wellness Seeker';
    const formattedDate = new Date(data.signupDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Serin</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              color: #374151; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            .header { 
              text-align: center; 
              padding: 40px 0; 
              background: linear-gradient(135deg, #8B5CF6, #EC4899); 
              border-radius: 12px; 
              margin-bottom: 30px; 
            }
            .header h1 { 
              color: white; 
              margin: 0; 
              font-size: 28px; 
              font-weight: 700; 
            }
            .content { 
              padding: 0 20px; 
            }
            .welcome-text { 
              font-size: 18px; 
              margin-bottom: 20px; 
            }
            .cta-button { 
              display: inline-block; 
              background: linear-gradient(135deg, #8B5CF6, #EC4899); 
              color: white; 
              padding: 16px 32px; 
              text-decoration: none; 
              border-radius: 50px; 
              font-weight: 600; 
              margin: 20px 0; 
              text-align: center; 
            }
            .footer { 
              margin-top: 40px; 
              padding-top: 20px; 
              border-top: 1px solid #E5E7EB; 
              text-align: center; 
              color: #6B7280; 
              font-size: 14px; 
            }
            .features { 
              background: #F9FAFB; 
              border-radius: 8px; 
              padding: 20px; 
              margin: 20px 0; 
            }
            .feature-item { 
              margin: 10px 0; 
              display: flex; 
              align-items: center; 
            }
            .feature-icon { 
              margin-right: 10px; 
              font-size: 18px; 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Welcome to Serin 💜</h1>
          </div>
          
          <div class="content">
            <div class="welcome-text">
              <p>Hi ${displayName},</p>
              <p>Welcome to Serin! Your wellness journey starts here. We're so excited to have you join our community on <strong>${formattedDate}</strong>.</p>
            </div>

            <div class="features">
              <h3 style="margin-top: 0; color: #374151;">What you can do with Serin:</h3>
              <div class="feature-item">
                <span class="feature-icon">🤖</span>
                <span>Chat with your personal AI wellness companion</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">👥</span>
                <span>Connect with peers who understand your journey</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📱</span>
                <span>Access a supportive community anytime, anywhere</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🌱</span>
                <span>Track your progress and celebrate growth</span>
              </div>
            </div>

            <div style="text-align: center;">
              <a href="https://your-app-domain.com/chat" class="cta-button">
                Start Your Wellness Journey →
              </a>
            </div>

            <p>Your mental health matters, and we're here to support you every step of the way. Take it one day at a time. 🌸</p>
            
            <p>If you have any questions or need help getting started, just reply to this email.</p>
            
            <p>With care,<br>The Serin Team</p>
          </div>

          <div class="footer">
            <p>This email was sent because you created an account with Serin.</p>
            <p>© 2025 Serin. Made with 💜 for your wellbeing.</p>
          </div>
        </body>
      </html>
    `;

    const emailText = `
Hi ${displayName},

Welcome to Serin! Your wellness journey starts here. We're so excited to have you join our community on ${formattedDate}.

What you can do with Serin:
🤖 Chat with your personal AI wellness companion
👥 Connect with peers who understand your journey  
📱 Access a supportive community anytime, anywhere
🌱 Track your progress and celebrate growth

Ready to get started? Visit: https://your-app-domain.com/chat

Your mental health matters, and we're here to support you every step of the way. Take it one day at a time. 🌸

If you have any questions or need help getting started, just reply to this email.

With care,
The Serin Team

---
This email was sent because you created an account with Serin.
© 2025 Serin. Made with 💜 for your wellbeing.
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Serin <onboarding@resend.dev>', // Using Resend's default domain for now
        to: [data.email],
        subject: 'Welcome to Serin 💜 Your wellness journey starts here',
        html: emailHTML,
        text: emailText,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('EmailService: Resend API error:', response.status, errorData);
      return { 
        success: false, 
        error: `Email send failed: ${response.status} ${errorData}` 
      };
    }

    const result = await response.json();
    console.log('EmailService: Welcome email sent successfully:', result.id);
    
    return { 
      success: true, 
      messageId: result.id 
    };

  } catch (error) {
    console.error('EmailService: Exception sending welcome email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Sends a test email to verify the email service is working
 */
export async function sendTestEmail(toEmail: string): Promise<EmailResponse> {
  try {
    console.log('EmailService: Sending test email to:', toEmail);
    
    const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;
    
    if (!resendApiKey) {
      return { 
        success: false, 
        error: 'Resend API key not configured' 
      };
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Serin <onboarding@resend.dev>',
        to: [toEmail],
        subject: 'Test Email from Serin',
        text: 'This is a test email to verify the email service is working correctly.',
        html: '<h2>Test Email</h2><p>This is a test email to verify the email service is working correctly.</p>',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return { 
        success: false, 
        error: `Test email failed: ${response.status} ${errorData}` 
      };
    }

    const result = await response.json();
    return { 
      success: true, 
      messageId: result.id 
    };

  } catch (error) {
    console.error('EmailService: Exception sending test email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}