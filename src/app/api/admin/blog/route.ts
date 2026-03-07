import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canManageBlog } from "@/lib/auth";

export async function POST(request: Request) {
  if (!(await canManageBlog())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const body = await request.json();
  const { title, slug, excerpt, content, published } = body;

  if (!title || !slug || !content) {
    return NextResponse.json({ error: "title, slug, and content are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title,
      slug,
      excerpt: excerpt ?? null,
      content,
      published: published ?? false,
      author_id: user!.id,
    })
    .select("id, slug")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
