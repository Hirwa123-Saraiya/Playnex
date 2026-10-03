import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Playnex — The Champions Club",
  description:
    "Digital backbone of a modern sports club that has outgrown WhatsApp and Excel.",
  icons: { icon: "/odoo_logo.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-sand text-text antialiased">
        {children}
      </body>
    </html>
  );
}