import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (data) return data;

  // Profile row missing — upsert it so the user isn't stuck in a redirect loop
  const { data: created } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email ?? "",
      full_name: user.user_metadata?.full_name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
    })
    .select("*")
    .single();

  return created;
}

export async function isAdmin(): Promise<boolean> {
  const profile = await getProfile();
  return profile?.role === "admin";
}

export async function isEditor(): Promise<boolean> {
  const profile = await getProfile();
  return profile?.role === "editor";
}

export async function canManageBlog(): Promise<boolean> {
  const profile = await getProfile();
  return profile?.role === "admin" || profile?.role === "editor";
}
