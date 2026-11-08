import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { userDeleteAccountSchema } from "@/lib/validators";

export const runtime = "nodejs";

/**
 * GET /api/user/account
 * Returns authenticated user profile, security flags, and timestamps.
 */
export async function GET() {
  try {
    const session = await requireUser();
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        role: true,
        xp: true,
        streak: true,
        level: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      bio: user.bio,
      role: user.role,
      xp: user.xp,
      streak: user.streak,
      level: user.level,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      hasPassword: Boolean(user.password),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized" },
      { status: 401 }
    );
  }
}

/**
 * DELETE /api/user/account
 * Permanently deletes the user account and cascades all related data.
 */
export async function DELETE(request: Request) {
  try {
    const session = await requireUser();
    const body = await request.json().catch(() => ({}));
    const parsed = userDeleteAccountSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    // If user has a password set and provided one, verify it
    if (user.password && parsed.password) {
      const isValid = bcrypt.compareSync(parsed.password, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Incorrect password. Cannot delete account." },
          { status: 403 }
        );
      }
    }

    // Cascade delete user
    await prisma.$transaction(async (tx) => {
      await tx.user.delete({
        where: { id: session.user.id },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Your account and all associated data have been permanently removed.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete account" },
      { status: 400 }
    );
  }
}
