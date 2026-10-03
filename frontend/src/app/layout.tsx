import type { Metadata, Viewport } from 'next'; 
import Script from 'next/script';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ClubProvider } from '../context/ClubContext';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap' });

// 1. This replaces your old metadata block completely
export const metadata: Metadata = {
  title: 'Playnex - Premier Sports Club Management Platform',
  description: 'Digital operating system for modern sports clubs, courts, inventory, and point of sale.',
  manifest: '/manifest.json',
  icons: {
    icon: '/odoo_logo.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Playnex Sports Club',
  },
};

// 2. This is the new viewport block required for PWA colors
export const viewport: Viewport = {
  themeColor: '#0f172a', 
};

// 3. Keep this part! It prevents your site from breaking
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-sand text-text antialiased">
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
        <AuthProvider>
          <ClubProvider>
            {children}
          </ClubProvider>
        </AuthProvider>
      </body>
    </html>
  );
}