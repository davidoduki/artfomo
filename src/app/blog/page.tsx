import Link from "next/link";
import { blogPosts } from "@/data/blog";

export const metadata = {
  title: "Blog — ArtFOMO",
  description: "Insights, guides, and market analysis for art collectors and investors.",
};

export default function BlogPage() {
  const published = blogPosts.filter((p) => p.published);

  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-stone-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold tracking-tight text-stone-900">
            Art<span className="text-red-700">FOMO</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/artists"
              className="text-sm font-medium text-stone-500 transition hover:text-stone-900"
            >
              Directory
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-stone-900"
            >
              Blog
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-32 pb-12">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-stone-400">
            Blog
          </p>
          <h1 className="mt-4 text-4xl font-bold text-stone-900 sm:text-5xl">
            Insights &amp; Analysis
          </h1>
          <p className="mt-4 text-lg text-stone-500">
            Market signals, collector guides, and artist spotlights from the
            ArtFOMO team.
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <div className="space-y-8">
          {published.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-stone-200 bg-white p-8 transition hover:border-stone-300 hover:shadow-md"
            >
              <p className="text-sm text-stone-400">
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {post.author_name && <> &middot; {post.author_name}</>}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-stone-900 group-hover:text-red-700">
                {post.title}
              </h2>
              <p className="mt-3 text-stone-500 leading-relaxed">
                {post.excerpt}
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-red-700">
                Read more &rarr;
              </span>
            </Link>
          ))}
        </div>

        {published.length === 0 && (
          <div className="py-24 text-center text-stone-400">
            No blog posts yet. Check back soon!
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-[#fafaf8] py-10 text-center text-sm text-stone-400">
        <div className="mx-auto max-w-5xl px-6">
          <p className="font-semibold text-stone-900">
            Art<span className="text-red-700">FOMO</span>
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} ArtFOMO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
