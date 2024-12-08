import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not configured in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

export const createPaymentIntent = async (amount: number) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export const retrievePaymentIntent = async (paymentIntentId: string) => {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    throw error;
  }
};

export const constructEventFromPayload = (
  payload: string | Buffer,
  sig: string,
  webhookSecret: string
) => {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      sig,
      webhookSecret
    );
  } catch (error) {
    console.error('Error constructing webhook event:', error);
    throw error;
  }
};
