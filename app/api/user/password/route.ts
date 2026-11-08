import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { userPasswordUpdateSchema } from "@/lib/validators";

export const runtime = "nodejs";

/**
 * PATCH /api/user/password
 * Changes the user's password with current password verification and bcrypt hashing.
 */
export async function PATCH(request: Request) {
  try {
    const session = await requireUser();
    const body = await request.json();
    const validated = userPasswordUpdateSchema.parse(body);

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    // Verify current password
    if (currentUser.password) {
      const isValid = bcrypt.compareSync(validated.currentPassword, currentUser.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Your current password is incorrect. Please check and try again." },
          { status: 403 }
        );
      }
    }

    // Hash new password
    const hashedPassword = bcrypt.hashSync(validated.newPassword, 12);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully. Your account is secured.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to change password" },
      { status: 400 }
    );
  }
}
