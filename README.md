My project video : https://www.youtube.com/watch?v=NNPCCqndop4

# Project Overview
Our goal is to build a Next.js application that allows users to transcribe audio files using
OpenAI's Whisper API. The application should provide a clean, user-friendly interface for
uploading audio files, displaying transcription results, and downloading the transcribed text.
Technologies Used:
- Next.js 15 for the framework
- TypeScript for type safety
- Tailwind CSS for styling
- OpenAI Whisper API for audio transcription
- Sonner for toast notifications
-
# Core Functionalities
## 1. File Upload
- Single file upload interface with drag-and-drop support
- Immediate file processing upon selection
- File type validation (MP3, WAV, M4A, MP4)
- File size validation (max 25MB)
- Loading state indication during upload and processing
- Error handling with user-friendly notifications
## 2. Audio Transcription
- Automatic transcription using OpenAI's Whisper API
- Server-side processing with temporary file storage
- Language detection
- Duration calculation
- Word count analysis
- Real-time status updates via toast notifications
- Comprehensive error handling
## 3. Result Display
- Clean presentation of transcription results
- Display of metadata:
* Detected language
* Audio duration
* Word count
- Formatted text display with proper whitespace handling
- Error state handling with user feedback
## 4. File Download
- Download button for transcribed text
- Formatted text file output including:
* Language information
* Duration details
* Word count statistics
* Full transcription text
- Automatic file naming
- Success notification upon download
## 5. Error Handling
- Comprehensive input validation
- User-friendly error messages
- Network error handling
- API error management
- File cleanup on error
- Development mode stack traces
## 6. Donation Slider Implementation
- Create a new component
'DonationForm.tsx in the components directory
- Implement a slider with predefined donation amounts (10, 20, 50, 100)
- Style the slider using Tailwind CSS classes
- Add amount display that updates in real-time
- Implement amount selection logic:
* Allow direct input of custom amounts
* Snap to nearest predefined amount
* Update visual feedback on amount change
- Add a "Donate" button that triggers the Stripe checkout
- Handle loading states during payment processing
- Display appropriate error messages using toast notifications
## 7. Stripe Integration and Webhook Setup
### 7.1 Initial Stripe Setup
- Sign up for a Stripe account and get API keys
- Add environment variables to ' env. local'
### 7.2 Product Configuration
- Create four separate products in Stripe Dashboard for diﬀerent donation amounts:
* $10 donation product
* $20 donation product
* $50 donation product
* $100 donation product
### 7.3 Stripe Configuration Setup
1. Create a new directory called 'config in your project root
2. Inside it, create a file called stripe.ts*
3. For each donation amount (10, 20, 50, 100), create an object with:
- A description message that will be shown to the user
- A priceld field that will store the product ID from Stripe
4. This configuration will be used by both the frontend and the API routes.
# Doc
## 1 OpenAI Whisper API Documentation
The OpenAI Whisper API can be used to transcribe audio files.
## 2 OpenAI Whisper API Documentation
The following code snippet demonstrates how to use OpenAI's Whisper API to transcribe an
audio file in
import fs from "fs";
import OpenAI from "openai";
const openai = new OpenAI();
async function main() {
const transcription = await openai.audio.transcriptions.create({
file: fs.createReadStream("/path/to/file/audio.mp3"),
model: "whisper-1",
});
}
main();
console.log(transcription.text);
# Important Implementation Notes
## 0. Adding logs
- Always add server side logs to your code so we can debug any potential issues
## 1. Project setup
- All new components should go in /components at the root (not in the app folder) and be
named like example-component.tsx unless otherwise specified
- All new pages go in /app
- Use the Next.js 15 app router
- All data fetching should be done in a server component and pass the data down as props
- Client components (useState, hooks, etc) require that 'use client' is set at the top of the file
## 2. Server-Side API Calls:
- All interactions with external APIs (e.g., Reddit, OpenAI) should be performed server-side.
- Create dedicated API routes in the `pages/api` directory for each external API interaction.
- Client-side components should fetch data through these API routes, not directly from external
APIs.
## 3. Environment Variables:
- Store all sensitive information (API keys, credentials) in environment variables.
- Use a `.env.local` file for local development and ensure it's listed in `.gitignore`.
- For production, set environment variables in the deployment platform (e.g., Vercel).
- Access environment variables only in server-side code or API routes.
## 4. Error Handling and Logging:
- Implement comprehensive error handling in both client-side components and server-side API
routes.
- Log errors on the server-side for debugging purposes.
- Display user-friendly error messages on the client-side.
## 5. Type Safety:
- Use TypeScript interfaces for all data structures, especially API responses.
- Avoid using `any` type; instead, define proper types for all variables and function parameters.
## 6. API Client Initialization:
- Initialize API clients (e.g., Snoowrap for Reddit, OpenAI) in server-side code only.
- Implement checks to ensure API clients are properly initialized before use.
## 7. Data Fetching in Components:
- Use React hooks (e.g., `useEﬀect`) for data fetching in client-side components.
- Implement loading states and error handling for all data fetching operations.
## 8. Next.js Configuration:
- Utilize `next.config.mjs` for environment-specific configurations.
- Use the `env` property in `next.config.mjs` to make environment variables available to the
application.
## 9. CORS and API Routes:
- Use Next.js API routes to avoid CORS issues when interacting with external APIs.
- Implement proper request validation in API routes.
## 10. Component Structure:
- Separate concerns between client and server components.
- Use server components for initial data fetching and pass data as props to client components.
## 11. Security:
- Never expose API keys or sensitive credentials on the client-side.
- Implement proper authentication and authorization for API routes if needed.
## 12. Special syntax:
- When use shadcn, use npx shadcn@latest add xxx, instead of shadcn-ui@latest, this is
deprecated.

I'll break down the entire journey of fixing the Stripe payment verification issues:

1. Initial Problem Identification
We encountered two main issues:
500 Internal Server Error during payment verification
401 Unauthorized Error suggesting API key problems

2. Systematic Investigation & Fixes
A. Environment Setup Verification
Confirmed all necessary environment variables were properly set:
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_APP_URL
B. Payment Flow Architecture
We implemented a robust payment flow:
Frontend: Donation form component (donation-form.tsx)
Collects payment details
Integrates Stripe Elements
Handles form submission
Backend Endpoints:
/api/payment/create-intent: Creates initial payment intent
/api/payment/verify-intent: Verifies payment status
/api/webhooks/stripe: Handles Stripe webhook events
C. Critical Fixes Made
Stripe Import Fix
The main breakthrough was identifying the incorrect Stripe import
Changed from @/config/stripe to @/lib/stripe-service
This was causing the 500 errors as the Stripe instance wasn't properly initialized
Payment Status Handling
Updated status checks to use 'SUCCEEDED' instead of 'COMPLETED'
Implemented consistent status handling between Stripe and our database
Error Handling & Logging
Added comprehensive error logging in webhook processing
Improved error messages for better debugging
Added validation for payment status updates

3. Database Integration
Used Prisma for database operations
Created proper schema for payment records
Implemented status tracking with appropriate enums

4. Why It Took Time
Complex Integration Points:
Stripe API integration
Database operations
Frontend-Backend communication
Webhook handling
Debugging Challenges:
Asynchronous nature of payments
Multiple status states to handle
Need for proper error tracking
Security Considerations:
Proper API key handling
Webhook verification
Payment verification security
The process took time because we needed to ensure:
Payment security
Data consistency
Proper error handling
Robust user experience
Accurate payment status tracking
Current Status
The system now successfully:
Creates payment intents
Processes payments through Stripe
Verifies payment status
Updates database records
Handles webhooks properly
Provides proper user feedback
This comprehensive approach ensures reliable payment processing while maintaining security and user experience standards.

# Texau - Next.js Stripe Payment Integration

A Next.js application demonstrating Stripe payment integration with features including:
- Donation form with customizable amounts
- Stripe payment processing
- Webhook handling for payment events
- PostgreSQL database integration
- Payment status verification

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with the following variables:
```
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_APP_URL=your_app_url
STRIPE_WEBHOOK_SECRET=your_webhook_secret
DATABASE_URL=your_database_url
```

4. Start the development server:
```bash
npm run dev
```

## Features
- Secure payment processing with Stripe
- Real-time payment status updates
- Error handling and validation
- Responsive design
- Database integration for payment tracking

## Technologies Used
- Next.js 13+
- Stripe API
- PostgreSQL
- Prisma ORM
- TypeScript
- Tailwind CSS

## Testing
Use Stripe test cards for payment testing:
- Success: 4242 4242 4242 4242
- Failure: 4000 0000 0000 0002

## License
MIT
