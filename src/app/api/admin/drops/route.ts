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
  const { data, error } = await supabase
    .from("drops")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = getAdminDb();
  const body = await request.json();
  const { title, artist_slug, artist_name, price, date, sold_out, image, description } = body;

  if (!title || !artist_slug || !price || !date) {
    return NextResponse.json(
      { error: "title, artist_slug, price, and date are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("drops")
    .insert({
      title,
      artist_slug,
      artist_name: artist_name ?? null,
      price,
      date,
      sold_out: sold_out ?? false,
      image: image ?? null,
      description: description ?? null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
