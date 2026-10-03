import type { Metadata, Viewport } from 'next'; 
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ClubProvider } from '../context/ClubContext';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap' });



// 1. This replaces your old metadata block completely
export const metadata: Metadata = {
  title: 'The Champions Club - Sports Club Management',
  description: 'Digital backbone of a modern sports club that has outgrown WhatsApp and Excel.',
  manifest: '/manifest.json',
  icons: {
    icon: '/odoo_logo.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Champions Club',
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
        <AuthProvider>
          <ClubProvider>
            {children}
          </ClubProvider>
        </AuthProvider>
      </body>
    </html>
  );
}