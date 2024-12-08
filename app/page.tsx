'use client';

import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import FileUpload from '@/components/file-upload';
import DonationForm from '@/components/donation-form';
import { getStripe } from '@/lib/stripe';

export default function Home() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const response = await fetch('/api/payment/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: 10 }), // Default amount
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment intent');
        }

        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to initialize payment form');
      }
    };

    initializePayment();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Audio Transcription
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Upload your audio file and get accurate transcription in seconds
          </p>
          <FileUpload />
        </div>

        {clientSecret && (
          <div className="max-w-md mx-auto mt-16">
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
        )}

        {error && (
          <div className="max-w-md mx-auto mt-16 p-4 bg-red-50 text-red-500 rounded-lg text-center">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
