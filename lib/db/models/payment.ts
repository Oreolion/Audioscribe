import { z } from 'zod';

export const PaymentStatusSchema = z.enum([
  'pending',
  'processing',
  'succeeded',
  'failed',
  'canceled',
]);

export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentIntentId: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentInput {
  amount: number;
  currency: string;
  paymentIntentId: string;
  metadata?: Record<string, any>;
}

export interface UpdatePaymentInput {
  status: PaymentStatus;
  metadata?: Record<string, any>;
}
