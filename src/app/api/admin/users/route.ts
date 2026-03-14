import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/auth";

function getAdminDb() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = getAdminDb();

  // Use auth admin API to get all real users (not just profile rows)
  const { data: authData, error: authErr } = await supabase.auth.admin.listUsers();
  if (authErr) {
    return NextResponse.json({ error: authErr.message }, { status: 500 });
  }

  // Get profile role data — only columns that actually exist in the schema
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, role");

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const merged = authData.users
    .map((u) => ({
      id: u.id,
      email: u.email ?? "",
      full_name: (u.user_metadata?.full_name as string | null) ?? null,
      role: profileMap.get(u.id)?.role ?? "user",
      subscription_tier: "free",
      created_at: u.created_at,
    }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json(merged);
}
