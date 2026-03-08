import Link from "next/link";
import { blogPosts } from "@/data/blog";

export const metadata = {
  title: "Blog — ArtFOMO",
  description: "Insights, guides, and market analysis for art collectors and investors.",
};

const PAGE_SIZE = 45; // 15 rows × 3 columns

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const published = blogPosts.filter((p) => p.published);
  const totalPages = Math.max(1, Math.ceil(published.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagePosts = published.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-stone-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
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
            <Link href="/blog" className="text-sm font-medium text-stone-900">
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
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-stone-400">
            Blog
          </p>
          <h1 className="mt-4 text-4xl font-bold text-stone-900 sm:text-5xl">
            Insights &amp; Analysis
          </h1>
          <p className="mt-4 text-lg text-stone-500">
            Market signals, collector guides, and artist spotlights from the ArtFOMO team.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div className="mx-auto max-w-6xl px-6 pb-24">
        {pagePosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pagePosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:border-stone-300 hover:shadow-md"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[3/2] w-full overflow-hidden bg-stone-100">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                        <span className="text-4xl font-bold text-stone-300 select-none">
                          {post.title.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs text-stone-400">
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      {post.author_name && <> &middot; {post.author_name}</>}
                    </p>
                    <h2 className="mt-2 line-clamp-2 text-lg font-bold text-stone-900 leading-snug">
                      {post.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm text-stone-500 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <span className="mt-4 text-sm font-medium text-red-700">
                      Read more &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                {currentPage > 1 ? (
                  <Link
                    href={`/blog?page=${currentPage - 1}`}
                    className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
                  >
                    &larr; Prev
                  </Link>
                ) : (
                  <span className="rounded-lg border border-stone-100 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-300 cursor-not-allowed">
                    &larr; Prev
                  </span>
                )}

                <span className="text-sm text-stone-500">
                  Page {currentPage} of {totalPages}
                </span>

                {currentPage < totalPages ? (
                  <Link
                    href={`/blog?page=${currentPage + 1}`}
                    className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
                  >
                    Next &rarr;
                  </Link>
                ) : (
                  <span className="rounded-lg border border-stone-100 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-300 cursor-not-allowed">
                    Next &rarr;
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="py-24 text-center text-stone-400">
            No blog posts yet. Check back soon!
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-[#fafaf8] py-10 text-center text-sm text-stone-400">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-semibold text-stone-900">
            Art<span className="text-red-700">FOMO</span>
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} ArtFOMO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
