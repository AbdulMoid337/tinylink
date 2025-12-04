import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params;

    const existingLink = await prisma.link.findUnique({
      where: { code },
    });

    if (!existingLink) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    await prisma.link.delete({
      where: { code },
    });

    // Revalidate multiple paths if needed
    revalidatePath("/");
    revalidatePath("/[code]", "page");

    return NextResponse.json({
      success: true,
      message: "Link deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { error: "Failed to delete link" },
      { status: 500 },
    );
  }
}
