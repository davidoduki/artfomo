import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  return <DashboardShell profile={profile}>{children}</DashboardShell>;
}
