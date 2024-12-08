import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PaymentService } from '@/lib/db/services/payment-service';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not configured in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

const paymentService = new PaymentService();

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    if (session.payment_status === 'paid') {
      await paymentService.updatePaymentStatus(
        session.payment_intent as string,
        'SUCCEEDED'
      );
    }

    return NextResponse.json({
      status: session.payment_status,
      customerEmail: session.customer_details?.email,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
