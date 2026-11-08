import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { userProfileUpdateSchema } from "@/lib/validators";

export const runtime = "nodejs";

/**
 * PATCH /api/user/profile
 * Updates the user's display name, profile image/avatar, and bio.
 */
export async function PATCH(request: Request) {
  try {
    const session = await requireUser();
    const body = await request.json();
    const validated = userProfileUpdateSchema.parse(body);

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validated.name.trim(),
        image: validated.image || null,
        bio: validated.bio?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updated,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update profile" },
      { status: 400 }
    );
  }
}
