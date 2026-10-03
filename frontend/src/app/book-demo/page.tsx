import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EnquiryForm } from "@/components/enquiries/EnquiryForm";

export default function BookDemoPage() {
  return (
    <main className="min-h-screen bg-sand px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-text"
        >
          <ArrowLeft size={14} /> Back to home
        </Link>
        <EnquiryForm
          source="BookDemo"
          title="Book a demo"
          subtitle="See Playnex in action. We'll set up a 20-minute walkthrough."
        />
      </div>
    </main>
  );
}