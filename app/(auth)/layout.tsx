import AuthSplitShell from "@/components/AuthSplitShell";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthSplitShell>{children}</AuthSplitShell>;
}
