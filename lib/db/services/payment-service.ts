import { Payment, PaymentStatus, Prisma } from '@prisma/client';
import { prisma } from '../prisma';

export class PaymentService {
  async createPayment(input: {
    amount: number;
    currency: string;
    paymentIntentId: string;
    metadata?: Record<string, any>;
    status?: PaymentStatus;
    customerEmail?: string;
  }): Promise<Payment> {
    return prisma.payment.create({
      data: {
        amount: input.amount / 100, // Convert cents to dollars
        currency: input.currency,
        paymentIntentId: input.paymentIntentId,
        metadata: input.metadata as Prisma.JsonObject,
        status: input.status || 'PENDING',
        customerEmail: input.customerEmail,
      },
    });
  }

  async updatePayment(id: string, input: {
    status?: PaymentStatus;
    metadata?: Record<string, any>;
    checkoutSessionId?: string;
    customerEmail?: string;
  }): Promise<Payment> {
    return prisma.payment.update({
      where: { id },
      data: {
        status: input.status,
        metadata: input.metadata as Prisma.JsonObject,
        checkoutSessionId: input.checkoutSessionId,
        customerEmail: input.customerEmail,
      },
    });
  }

  async getPaymentByIntentId(paymentIntentId: string): Promise<Payment | null> {
    return prisma.payment.findUnique({
      where: { paymentIntentId },
    });
  }

  async updatePaymentStatus(paymentIntentId: string, status: PaymentStatus): Promise<Payment> {
    return prisma.payment.update({
      where: { paymentIntentId },
      data: { status },
    });
  }

  async getPaymentsByStatus(status: PaymentStatus): Promise<Payment[]> {
    return prisma.payment.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRecentPayments(limit = 10): Promise<Payment[]> {
    return prisma.payment.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }
}
