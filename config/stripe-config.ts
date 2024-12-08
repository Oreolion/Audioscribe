export const STRIPE_CONFIG = {
  WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  SUCCESS_URL: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
  CANCEL_URL: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
  WEBHOOK_PATH: '/api/webhooks/stripe',
  PAYMENT_SUCCESS_PATH: '/payment/success',
  PAYMENT_CANCEL_PATH: '/payment/cancel',
  CURRENCY: 'usd',
  PAYMENT_METHODS: ['card'],
  ALLOWED_COUNTRIES: ['US', 'CA', 'GB', 'AU', 'NZ', 'IE'],
} as const;

export const STRIPE_WEBHOOK_EVENTS = {
  PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_INTENT_FAILED: 'payment_intent.payment_failed',
  CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed',
} as const;

export type StripeWebhookEvent = typeof STRIPE_WEBHOOK_EVENTS[keyof typeof STRIPE_WEBHOOK_EVENTS];
