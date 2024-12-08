import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not configured in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private static async sendEmail(options: EmailOptions) {
    try {
      await resend.emails.send({
        from: 'Texau <noreply@texau.app>',
        ...options,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  static async sendPaymentSuccessEmail(options: {
    to: string;
    amount: number;
    currency: string;
  }) {
    const { to, amount, currency } = options;
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);

    await this.sendEmail({
      to,
      subject: 'Thank You for Your Donation!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Thank You for Your Support!</h1>
          <p>We've received your generous donation of ${formattedAmount}.</p>
          <p>Your support helps us continue improving our transcription service and developing new features.</p>
          <p>Here's what your donation helps us do:</p>
          <ul>
            <li>Maintain and improve our servers</li>
            <li>Develop new transcription features</li>
            <li>Support more languages and formats</li>
            <li>Keep the service accessible to everyone</li>
          </ul>
          <p>If you have any questions or feedback, please don't hesitate to reach out.</p>
          <p>Best regards,<br>The Texau Team</p>
        </div>
      `,
    });
  }

  static async sendPaymentFailedEmail(options: {
    to: string;
    amount: number;
    currency: string;
  }) {
    const { to, amount, currency } = options;
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);

    await this.sendEmail({
      to,
      subject: 'Payment Failed - Action Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Payment Failed</h1>
          <p>We were unable to process your donation of ${formattedAmount}.</p>
          <p>This could be due to:</p>
          <ul>
            <li>Insufficient funds</li>
            <li>Expired card</li>
            <li>Incorrect card information</li>
            <li>Bank decline</li>
          </ul>
          <p>Please try again with a different payment method or contact your bank for more information.</p>
          <p>If you need assistance, feel free to reply to this email.</p>
          <p>Best regards,<br>The Texau Team</p>
        </div>
      `,
    });
  }
}
