"use client";

import { useState } from "react";
import Link from "next/link";

export default function NewBlogPostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this saves to Supabase
    alert("Blog post saved! (Connect Supabase to persist)");
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link
          href="/dashboard/admin/blog"
          className="text-sm text-stone-500 hover:text-stone-900 transition"
        >
          &larr; Back to Blog
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-stone-900">
          New Blog Post
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Your blog post title"
                required
                className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700">
                Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-friendly-slug"
                required
                className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-mono text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              />
              <p className="mt-1 text-xs text-stone-400">
                /blog/{slug || "your-post-slug"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700">
                Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary for listing pages..."
                rows={2}
                className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700">
                Content
              </label>
              <p className="mt-0.5 text-xs text-stone-400">
                Supports Markdown formatting.
              </p>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog post content here...

## Heading
Regular paragraph text.

**Bold text** and *italic text*."
                rows={16}
                required
                className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-3 text-sm font-mono text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 resize-y"
              />
            </div>
          </div>
        </div>

        {/* Publish settings */}
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-stone-900">Publishing</h2>
          <label className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
            />
            <span className="text-sm text-stone-700">
              Publish immediately (visible to everyone)
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="rounded-lg bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            {published ? "Publish Post" : "Save Draft"}
          </button>
          <Link
            href="/dashboard/admin/blog"
            className="rounded-lg border border-stone-200 px-6 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
