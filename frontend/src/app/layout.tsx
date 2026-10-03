import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Champions Club - Sports Club Management',
  description: 'Digital backbone of a modern sports club that has outgrown WhatsApp and Excel.',
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
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
