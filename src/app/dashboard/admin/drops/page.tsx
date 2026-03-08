import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import DropsClient from "./DropsClient";

export default async function AdminDropsPage() {
  if (!(await isAdmin())) {
    redirect("/dashboard");
  }

  return <DropsClient />;
}
