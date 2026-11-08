import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Settings - EduPath",
  description: "Manage your account, preferences, and privacy settings on EduPath.",
};

export default async function SettingsPage() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

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
    redirect("/login");
  }

  const serializedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    bio: user.bio,
    role: user.role,
    xp: user.xp,
    streak: user.streak,
    level: user.level,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    hasPassword: Boolean(user.password),
  };

  return <SettingsClient initialUser={serializedUser} />;
}
