import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Playnex — The Champions Club',
  description: 'Multi-tenant digital backbone with dynamic roles for modern sports clubs.',
  icons: {
    icon: '/odoo_logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-sand text-text antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}