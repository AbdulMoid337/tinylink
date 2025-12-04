import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { 
  params: Promise<{ code: string }> 
};

export async function GET(_req: NextRequest, { params }: Params) {
  const { code } = await params; // Add await here

  const link = await prisma.link.findUnique({ where: { code } });

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.link.update({
    where: { code },
    data: {
      clickCount: { increment: 1 },
      lastClicked: new Date(),
    },
  });

  return NextResponse.redirect(link.url, 302);
}
