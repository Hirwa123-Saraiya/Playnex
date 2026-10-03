import type { Metadata } from 'next';
import './globals.css';
import { ClubProvider } from '../context/ClubContext';

export const metadata: Metadata = {
  title: 'Playnex | Club Owner Portal - Multi-Tenant Club Management',
  description: 'Enterprise-grade SaaS sports club management platform for facilities, bookings, memberships, finances, and departments.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] text-slate-900 antialiased min-h-screen">
        <ClubProvider>
          {children}
        </ClubProvider>
      </body>
    </html>
  );
}
