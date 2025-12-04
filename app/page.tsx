import { prisma } from "@/lib/prisma";
import DashboardPageClient from "./components/DashboardPageClient";

export default async function DashboardPage() {
  const linksData = await prisma.link.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      code: true,
      url: true,
      clickCount: true,
      lastClicked: true,
    },
  });
  const links = linksData.map((link) => ({
    ...link,
    lastClicked: link.lastClicked ? link.lastClicked.toISOString() : null,
  }));
  return <DashboardPageClient initialLinks={links} />;
}
