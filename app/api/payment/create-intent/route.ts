import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { DONATION_AMOUNTS } from '@/config/stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not configured in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount || !DONATION_AMOUNTS.includes(amount)) {
      return NextResponse.json(
        { error: 'Invalid donation amount' },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      payment_method_types: ['card'],
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
