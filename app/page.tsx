import { prisma } from "@/lib/prisma";
import DashboardPageClient from "@/app/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardPageClient
      initialLinks={links.map((l: any) => ({
        code: l.code,
        url: l.url,
        clickCount: l.clickCount,
        lastClicked: l.lastClicked ? l.lastClicked.toISOString() : null,
      }))}
    />
  );
}
