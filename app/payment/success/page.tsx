'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paymentIntentId = searchParams.get('payment_intent');
        const clientSecret = searchParams.get('payment_intent_client_secret');

        if (!paymentIntentId || !clientSecret) {
          console.log('Missing payment parameters:', { paymentIntentId, clientSecret });
          setVerificationStatus('error');
          setError('Missing payment information');
          return;
        }

        console.log('Verifying payment:', { paymentIntentId, clientSecret });

        const response = await fetch('/api/payment/verify-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            paymentIntentId,
            clientSecret
          }),
        });

        const data = await response.json();
        console.log('Verification response:', data);

        if (response.ok && (data.status === 'succeeded' || data.status === 'SUCCEEDED')) {
          setVerificationStatus('success');
          setCustomerEmail(data.customerEmail);
        } else {
          console.error('Payment verification failed:', {
            status: data.status,
            error: data.error,
            responseOk: response.ok
          });
          setVerificationStatus('error');
          setError(data.error || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setVerificationStatus('error');
        setError('An unexpected error occurred');
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (verificationStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">Verifying your payment...</h2>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">Payment verification failed</h2>
          {error && <p className="mt-2 text-red-600">{error}</p>}
          <p className="mt-2 text-gray-500">Please contact support if you believe this is an error.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Thank you for your donation!</h2>
          {customerEmail && (
            <p className="mt-2 text-gray-600">
              A receipt has been sent to {customerEmail}
            </p>
          )}
          <p className="mt-4 text-gray-600">
            Your support helps us continue improving our transcription service.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading payment status...</h2>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
