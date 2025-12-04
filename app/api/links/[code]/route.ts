import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { 
  params: Promise<{ code: string }> 
};

export async function GET(_req: NextRequest, { params }: Params) {
  const { code } = await params; // Add await here
  
  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(
    {
      code: link.code,
      url: link.url,
      clickCount: link.clickCount,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt,
    },
    { status: 200 },
  );
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { code } = await params; // Add await here
  
  const link = await prisma.link.findUnique({ where: { code } });
  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.link.delete({ where: { code } });

  return NextResponse.json({ ok: true }, { status: 200 });
}
