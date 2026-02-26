import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blog";

export function generateStaticParams() {
  return blogPosts
    .filter((p) => p.published)
    .map((post) => ({ slug: post.slug }));
}

function renderMarkdown(content: string) {
  // Simple markdown-to-HTML for headings, bold, italic, and paragraphs
  return content
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("## ")) {
        return `<h2 class="mt-8 mb-4 text-2xl font-bold text-stone-900">${trimmed.slice(3)}</h2>`;
      }
      if (trimmed.startsWith("### ")) {
        return `<h3 class="mt-6 mb-3 text-xl font-semibold text-stone-900">${trimmed.slice(4)}</h3>`;
      }
      // Process inline formatting
      const processed = trimmed
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-stone-900">$1</strong>')
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br />");
      return `<p class="mb-4 text-stone-500 leading-relaxed">${processed}</p>`;
    })
    .join("");
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug && p.published);

  if (!post) {
    notFound();
  }

  // Find adjacent posts for navigation
  const publishedPosts = blogPosts.filter((p) => p.published);
  const currentIndex = publishedPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? publishedPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < publishedPosts.length - 1
      ? publishedPosts[currentIndex + 1]
      : null;

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
              className="text-sm font-medium text-stone-500 transition hover:text-stone-900"
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

      {/* Article */}
      <article className="pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-6">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-stone-400">
            <Link href="/blog" className="hover:text-stone-900 transition">
              Blog
            </Link>
            <span>/</span>
            <span className="truncate text-stone-700">{post.title}</span>
          </div>

          {/* Header */}
          <header>
            <p className="text-sm text-stone-400">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {post.author_name && <> &middot; {post.author_name}</>}
            </p>
            <h1 className="mt-4 text-3xl font-bold text-stone-900 sm:text-4xl leading-tight">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-stone-500 leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          {/* Divider */}
          <hr className="my-10 border-stone-200" />

          {/* Content */}
          <div
            className="prose-artfomo"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />

          {/* Post navigation */}
          <div className="mt-16 grid gap-4 sm:grid-cols-2">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="rounded-xl border border-stone-200 bg-white p-5 transition hover:border-stone-300 hover:shadow-sm"
              >
                <p className="text-xs text-stone-400">&larr; Previous</p>
                <p className="mt-1 font-semibold text-stone-900">{prevPost.title}</p>
              </Link>
            ) : (
              <div />
            )}
            {nextPost && (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="rounded-xl border border-stone-200 bg-white p-5 text-right transition hover:border-stone-300 hover:shadow-sm"
              >
                <p className="text-xs text-stone-400">Next &rarr;</p>
                <p className="mt-1 font-semibold text-stone-900">{nextPost.title}</p>
              </Link>
            )}
          </div>
        </div>
      </article>

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
