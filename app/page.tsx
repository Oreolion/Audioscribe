"use client";

import { useState } from "react";
import FileUpload from "@/components/file-upload";
import Link from "next/link";

import {
  Play,
  Upload,
  Download,
  Zap,
  Shield,
  Globe,
  CheckCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import VoiceRecorder from "@/components/voice-recorder";
// import { Elements } from '@stripe/react-stripe-js';
// import DonationForm from '@/components/donation-form';
// import { getStripe } from '@/lib/stripe';

export default function Home() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  //   useEffect(() => {
  //     const initializePayment = async () => {
  //       try {
  //         const response = await fetch('/api/payment/create-intent', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({ amount: 10 }), // Default amount
  //         });

  //         const data = await response.json();

  //         if (!response.ok) {
  //           throw new Error(data.error || 'Failed to create payment intent');
  //         }

  //         setClientSecret(data.clientSecret);
  //       } catch (error) {
  //         console.error('Error:', error);
  //         setError('Failed to initialize payment form');
  //       }
  //     };

  //     initializePayment();
  //   }, []);

  return (
    <section className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 pt-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-15 sm:py-25">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
                <Zap className="w-4 h-4 mr-2" />
                Introducing AudioScribe AI
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Blazing speed.
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Incredible accuracy.
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Meet the new standard in AI transcription. Convert audio or
                video to text in just seconds with unmatched precision and
                speed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  href="#transcribe"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 rounded-lg"
                >
                  Get Started Free
                </Link>
              </div>
              <p className="text-sm text-gray-500">No credit card required</p>
            </div>

            {/* Process Steps */}
            <div className="max-w-6xl mx-auto mt-20">
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      1
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Upload audio or video
                    </h3>
                    <p className="text-gray-600">
                      Drag and drop your files or click to browse. We support
                      all major audio and video formats.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      2
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Get your transcript in seconds
                    </h3>
                    <p className="text-gray-600">
                      Our AI processes your file instantly with industry-leading
                      accuracy and speed.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Download className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      3
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Export to popular formats
                    </h3>
                    <p className="text-gray-600">
                      Download your transcript in TXT, DOCX, PDF, or SRT.
                      Perfect for any workflow.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Audio Transcription Section - Your existing functionality */}
        <section id="transcribe" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Audio Transcription
                </h2>
                <p className="text-xl text-gray-600">
                  Record live audio or upload files for accurate transcription
                </p>
              </div>
              <div className="mb-12">
                <VoiceRecorder />
              </div>

              {/* Divider */}
              <div className="relative mb-12">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or upload a file
                  </span>
                </div>
              </div>

              <FileUpload />

              {error && (
                <div className="mt-8 p-4 bg-red-50 text-red-500 rounded-lg text-center">
                  {error}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Convert audio to text in seconds
              </h2>
              <p className="text-xl text-gray-600">
                Blazing Fast and Accurate AI Transcription
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Superhuman Accuracy
                    </h3>
                    <p className="text-gray-600">
                      AudioScribe is up to 99.8% accurate, outperforming human
                      performance with the power of machine learning.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Blazing Speed
                    </h3>
                    <p className="text-gray-600">
                      No more waiting around for transcription! AudioScribe
                      transcribes 1 hour of audio in just 2-3 minutes. That's
                      30x faster than doing it yourself and quicker than the
                      competition.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Transcribe multiple Languages
                    </h3>
                    <p className="text-gray-600">
                      We support transcription in different languages and
                      dialects from around the world.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Private and Secure
                    </h3>
                    <p className="text-gray-600">
                      We value privacy in a human right, and we protect your
                      data using the latest security standards and encryption.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border">
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center mb-6">
                    <Play className="w-16 h-16 text-blue-600" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Processing complete
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        "Welcome to our podcast. Today we're discussing the
                        future of artificial intelligence and its impact on
                        society..."
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Accuracy: 99.2%</span>
                      <span>Duration: 45:32</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-1">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold">AudioScribe</span>
                </div>
                <p className="text-gray-400 mb-6">
                  The fastest and most accurate AI transcription service.
                  Convert your audio files to text in seconds.
                </p>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                    <span className="text-sm">𝕏</span>
                  </div>
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                    <span className="text-sm">in</span>
                  </div>
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                    <span className="text-sm">f</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-3 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-3 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Status
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} AudioScribe. All rights reserved.
                </p>
                <div className="flex items-center space-x-6 mt-4 md:mt-0">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>4.9/5 from 10,000+ reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* {clientSecret && (
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
        )} */}

        {error && (
          <div className="max-w-md mx-auto mt-16 p-4 bg-red-50 text-red-500 rounded-lg text-center">
            {error}
          </div>
        )}
      </main>
    </section>
  );
}
