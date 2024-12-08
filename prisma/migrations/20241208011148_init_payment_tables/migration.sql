-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELED');

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentIntentId" TEXT NOT NULL,
    "checkoutSessionId" TEXT,
    "customerEmail" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentIntentId_key" ON "Payment"("paymentIntentId");

-- CreateIndex
CREATE INDEX "Payment_paymentIntentId_idx" ON "Payment"("paymentIntentId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");
