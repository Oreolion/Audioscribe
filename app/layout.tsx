import { Inter } from 'next/font/google';
import Navigation from '@/components/navigation';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AudioScribe - Audio Transcription Service',
  description: 'Convert your audio files to text with high accuracy',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
