import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin, getProfile } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

const VALID_ROLES: UserRole[] = ["admin", "editor", "user"];

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const role: UserRole = body.role;

  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Prevent admin from demoting themselves
  const self = await getProfile();
  if (self?.id === params.id && role !== "admin") {
    return NextResponse.json({ error: "You cannot remove your own admin role" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", params.id)
    .select("id, email, role")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
