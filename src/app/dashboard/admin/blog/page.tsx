"use client";

import { useState } from "react";
import Link from "next/link";
import { blogPosts as initialPosts } from "@/data/blog";

export default function AdminBlogPage() {
  const [posts] = useState(initialPosts);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const filtered = posts.filter((p) => {
    if (filter === "published") return p.published;
    if (filter === "draft") return !p.published;
    return true;
  });

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Manage Blog</h1>
          <p className="mt-1 text-stone-500">
            {posts.length} posts &middot; {posts.filter((p) => p.published).length}{" "}
            published
          </p>
        </div>
        <Link
          href="/dashboard/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {(["all", "published", "draft"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
              filter === f
                ? "bg-stone-900 text-white"
                : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Posts list */}
      <div className="space-y-3">
        {filtered.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-6 py-5"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="truncate font-semibold text-stone-900">
                  {post.title}
                </h3>
                {post.published ? (
                  <span className="flex-shrink-0 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                    Published
                  </span>
                ) : (
                  <span className="flex-shrink-0 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-500">
                    Draft
                  </span>
                )}
              </div>
              <p className="mt-1 truncate text-sm text-stone-400">{post.excerpt}</p>
              <p className="mt-2 text-xs text-stone-400">
                By {post.author_name} &middot;{" "}
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="ml-4 flex items-center gap-2">
              <Link
                href={`/blog/${post.slug}`}
                className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50"
              >
                View
              </Link>
              <button className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50">
                Edit
              </button>
              <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-stone-300 bg-white py-12 text-center text-stone-400">
            No posts match your filter.
          </div>
        )}
      </div>
    </div>
  );
}
