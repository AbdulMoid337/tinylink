import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

type CreatePayload = {
  url: string;
  code?: string;
};

function isValidUrl(raw: string) {
  try {
    const u = new URL(raw);
    return !!u.protocol && !!u.host;
  } catch {
    return false;
  }
}

function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const len = 6;
  let result = "";
  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreatePayload;

  if (!body.url || !isValidUrl(body.url)) {
    return NextResponse.json(
      { error: "Invalid URL" },
      { status: 400 },
    );
  }

  let code = body.code?.trim();
  if (code && !CODE_REGEX.test(code)) {
    return NextResponse.json(
      { error: "Code must match [A-Za-z0-9]{6,8}" },
      { status: 400 },
    );
  }

  if (!code) {
    // generate until unique
    // (for small scale the loop is fine)
    // you can switch to db-side uniqueness with retry handling if needed
    // keep attempts small
    for (let i = 0; i < 5; i++) {
      const candidate = generateCode();
      const existing = await prisma.link.findUnique({ where: { code: candidate } });
      if (!existing) {
        code = candidate;
        break;
      }
    }
    if (!code) {
      return NextResponse.json({ error: "Failed to generate code" }, { status: 500 });
    }
  }

  const existing = await prisma.link.findUnique({ where: { code } });
  if (existing) {
    return NextResponse.json(
      { error: "Code already exists" },
      { status: 409 },
    );
  }

  const link = await prisma.link.create({
    data: {
      code,
      url: body.url,
    },
  });

  return NextResponse.json(
    {
      code: link.code,
      url: link.url,
      clickCount: link.clickCount,
      lastClicked: link.lastClicked,
    },
    { status: 201 },
  );
}

export async function GET() {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: "desc" },
    });
  
    return NextResponse.json(
      links.map((l: any) => ({
        code: l.code,
        url: l.url,
        clickCount: l.clickCount,
        lastClicked: l.lastClicked,
      })),
      { status: 200 },
    );
  }