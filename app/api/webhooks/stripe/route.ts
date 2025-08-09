import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PaymentService } from '@/lib/db/services/payment-service';
import { PaymentStatus } from '@prisma/client';

// Initialize Stripe with a specific API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const paymentService = new PaymentService();

// Disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    console.log('=== WEBHOOK PROCESSING START ===');
    console.log('Timestamp:', new Date().toISOString());

    // Get the raw body first
    let rawBody: string;
    try {
      rawBody = await req.text();
      console.log('Raw body received:', {
        length: rawBody.length,
        preview: rawBody.substring(0, 100) + '...',
      });
    } catch (err: any) {
      console.error('Failed to get raw body:', err);
      return NextResponse.json(
        { error: 'Could not read request body' },
        { status: 400 }
      );
    }

    // Get headers after body
    const headersList = headers();
    const signature = headersList.get('stripe-signature');
    
    console.log('Headers:', {
      'stripe-signature': signature ? 'Present' : 'Missing',
      'content-type': headersList.get('content-type'),
      'content-length': headersList.get('content-length'),
    });

    if (!signature) {
      console.error('No Stripe signature found in request');
      return NextResponse.json(
        { error: 'No Stripe signature found' },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('No webhook secret configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify the event
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody.toString(),
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      
      console.log('Event constructed successfully:', {
        id: event.id,
        type: event.type,
        created: new Date(event.created * 1000).toISOString(),
      });
    } catch (err: any) {
      console.error('Failed to verify webhook:', {
        error: err.message,
        type: err.type,
        signature: signature ? signature.substring(0, 20) + '...' : 'missing',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? process.env.STRIPE_WEBHOOK_SECRET.substring(0, 5) + '...' : 'missing',
        bodyLength: rawBody.length,
      });
      
      return NextResponse.json(
        { error: `Webhook verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    try {
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Processing payment success:', {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status,
        });

        try {
          // Check for existing payment
          let payment = await paymentService.getPaymentByIntentId(paymentIntent.id);
          console.log('Existing payment check:', { found: !!payment });
        
          if (payment) {
            try {
              payment = await paymentService.updatePayment(payment.id, {
                status: 'SUCCEEDED' as PaymentStatus,
                customerEmail: paymentIntent.receipt_email || undefined,
                metadata: paymentIntent.metadata,
              });
              console.log('Updated payment:', { id: payment.id, status: payment.status });
            } catch (updateError: any) {
              console.error('Failed to update payment:', {
                error: updateError.message,
                code: updateError.code,
                paymentId: payment.id,
              });
              throw updateError;
            }
          } else {
            try {
              payment = await paymentService.createPayment({
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                paymentIntentId: paymentIntent.id,
                status: 'SUCCEEDED' as PaymentStatus,
                customerEmail: paymentIntent.receipt_email || undefined,
                metadata: paymentIntent.metadata,
              });
              console.log('Created new payment:', { id: payment.id, status: payment.status });
            } catch (createError: any) {
              console.error('Failed to create payment:', {
                error: createError.message,
                code: createError.code,
                paymentIntentId: paymentIntent.id,
              });
              throw createError;
            }
          }
        } catch (dbError: any) {
          console.error('Database operation failed:', {
            error: dbError.message,
            code: dbError.code,
            stack: dbError.stack,
          });
          throw dbError;
        }
      }

      console.log('=== WEBHOOK PROCESSING COMPLETE ===');
      return NextResponse.json({ received: true });
    } catch (err: any) {
      console.error('Error processing webhook:', {
        error: err.message,
        code: err.code,
        stack: err.stack,
        eventType: event.type,
      });
      return NextResponse.json(
        { error: `Failed to process webhook: ${err.message}` },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error('Fatal webhook error:', {
      error: err.message,
      stack: err.stack,
    });
    return NextResponse.json(
      { error: 'Fatal webhook error' },
      { status: 500 }
    );
  }
}
