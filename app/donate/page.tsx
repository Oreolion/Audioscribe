'use client';

import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import DonationForm from '@/components/donation-form';
import { getStripe } from '@/lib/stripe';

export default function DonatePage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [amount] = useState(10); // Default amount

  useEffect(() => {
    const initializePayment = async () => {
      try {
        // Create the payment intent
        const response = await fetch('/api/payment/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment intent');
        }

        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to initialize payment. Please try again later.');
      }
    };

    initializePayment();
  }, [amount]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Support Texau</h1>
          <p className="mt-2 text-gray-600">
            Your donation helps us maintain and improve our transcription service
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <Elements
            stripe={getStripe()}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#3b82f6',
                },
              },
            }}
          >
            <DonationForm />
          </Elements>
        </div>
      </div>
    </div>
  );
}
