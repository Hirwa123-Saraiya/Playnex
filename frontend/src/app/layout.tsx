import type { Metadata, Viewport } from 'next'; 
import './globals.css';



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
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
