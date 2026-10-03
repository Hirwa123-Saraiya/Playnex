import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { CLUB_INFO } from "@/mock/publicSiteMockData";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-sand text-text">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter info={CLUB_INFO} />
    </div>
  );
}