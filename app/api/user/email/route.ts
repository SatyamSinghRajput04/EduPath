import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { userEmailUpdateSchema } from "@/lib/validators";

export const runtime = "nodejs";

/**
 * PATCH /api/user/email
 * Changes user's primary email address with collision checks and identity verification.
 */
export async function PATCH(request: Request) {
  try {
    const session = await requireUser();
    const body = await request.json();
    const validated = userEmailUpdateSchema.parse(body);
    const newEmail = validated.email.toLowerCase().trim();

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, password: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    if (currentUser.email === newEmail) {
      return NextResponse.json(
        { error: "New email must be different from your current email address." },
        { status: 400 }
      );
    }

    // If user has a password, verify it for security
    if (currentUser.password) {
      if (!validated.currentPassword) {
        return NextResponse.json(
          { error: "Please enter your current password to authorize this email change." },
          { status: 400 }
        );
      }
      const isValid = bcrypt.compareSync(validated.currentPassword, currentUser.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Current password verification failed. Please try again." },
          { status: 403 }
        );
      }
    }

    // Check if new email is already taken
    const existing = await prisma.user.findUnique({
      where: { email: newEmail },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This email address is already registered to another account." },
        { status: 409 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { email: newEmail },
      select: { id: true, email: true, updatedAt: true },
    });

    return NextResponse.json({
      success: true,
      email: updated.email,
      message: "Email address successfully updated.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update email" },
      { status: 400 }
    );
  }
}
