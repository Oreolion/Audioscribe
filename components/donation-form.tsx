'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { DONATION_AMOUNTS } from '@/config/stripe';

const DonationForm = () => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { data } = await axios.post('/api/payment/create-intent', {
        amount: selectedAmount,
      });

      const { clientSecret } = data;

      setIsProcessing(true);

      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );

      if (paymentError) {
        setError(paymentError.message ?? 'An error occurred');
        setIsProcessing(false);
        return;
      }

      router.push('/payment/success');
    } catch (error: any) {
      console.error('Payment error:', error);
      setError('An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {DONATION_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => setSelectedAmount(amount)}
            className={`p-4 text-center rounded-lg border ${
              selectedAmount === amount
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            ${amount}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>

        {error && (
          <div className="p-4 text-red-700 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
            isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isProcessing ? 'Processing...' : `Donate $${selectedAmount}`}
        </button>
      </div>
    </form>
  );
};

export default DonationForm;
