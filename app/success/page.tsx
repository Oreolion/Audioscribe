'use client';

import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Thank You for Your Donation!
        </h1>
        <p className="text-gray-600 mb-8">
          Your support helps us maintain and improve our transcription service.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-600 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
