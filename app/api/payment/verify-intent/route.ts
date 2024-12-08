import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-service';
import { PaymentService } from '@/lib/db/services/payment-service';

const paymentService = new PaymentService();

export async function POST(request: Request) {
  try {
    const { paymentIntentId, clientSecret } = await request.json();
    console.log('Verifying payment intent:', { paymentIntentId, clientSecret });

    if (!paymentIntentId || !clientSecret) {
      console.log('Missing required parameters');
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // First, check if we have a record of this payment in our database
    const payment = await paymentService.getPaymentByIntentId(paymentIntentId);
    console.log('Payment record from database:', {
      id: payment?.id,
      status: payment?.status,
      paymentIntentId: payment?.paymentIntentId,
      amount: payment?.amount
    });

    // If we have a payment record and it's successful, return that
    if (payment && payment.status === 'SUCCEEDED') {
      console.log('Found successful payment in database');
      return NextResponse.json({
        status: 'succeeded',
        customerEmail: payment.customerEmail,
      });
    }

    // If we don't have a record or it's not successful, check with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log('Stripe payment intent details:', { 
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });

    if (!paymentIntent) {
      console.log('Payment intent not found');
      return NextResponse.json(
        { error: 'Payment intent not found' },
        { status: 404 }
      );
    }

    // If the payment is successful in Stripe, update or create the database record
    if (paymentIntent.status === 'succeeded') {
      if (payment) {
        // Update existing payment
        await paymentService.updatePayment(payment.id, {
          status: 'SUCCEEDED',
          customerEmail: paymentIntent.receipt_email || undefined,
          metadata: paymentIntent.metadata,
        });
      } else {
        // Create new payment
        await paymentService.createPayment({
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          paymentIntentId: paymentIntent.id,
          status: 'SUCCEEDED',
          customerEmail: paymentIntent.receipt_email || undefined,
          metadata: paymentIntent.metadata,
        });
      }

      return NextResponse.json({
        status: 'succeeded',
        customerEmail: paymentIntent.receipt_email,
      });
    }

    return NextResponse.json({
      status: paymentIntent.status,
      customerEmail: paymentIntent.receipt_email,
    });
  } catch (error) {
    console.error('Error verifying payment intent:', error);
    return NextResponse.json(
      { error: 'Error verifying payment' },
      { status: 500 }
    );
  }
}
