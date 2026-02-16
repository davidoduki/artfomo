import Link from "next/link";
import { notFound } from "next/navigation";
import { artists, getMomentumColor, getMomentumIcon } from "@/data/artists";

export function generateStaticParams() {
  return artists.map((artist) => ({ slug: artist.slug }));
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = artists.find((a) => a.slug === slug);

  if (!artist) {
    notFound();
  }

  const similar = artists
    .filter((a) => a.slug !== artist.slug)
    .sort(
      (a, b) =>
        Math.abs(a.momentumScore - artist.momentumScore) -
        Math.abs(b.momentumScore - artist.momentumScore)
    )
    .slice(0, 3);

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
              className="text-sm font-medium text-stone-500 hover:text-stone-900 transition"
            >
              Directory
            </Link>
            <Link
              href="/#waitlist"
              className="rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              Get Early Access
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero banner */}
      <div className="relative pt-16">
        <div
          className={`h-64 bg-gradient-to-br ${artist.imageColor} opacity-60`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fafaf8] via-[#fafaf8]/50 to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative -mt-32 mx-auto max-w-5xl px-6 pb-24">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-stone-400">
          <Link href="/artists" className="hover:text-stone-900 transition">
            Directory
          </Link>
          <span>/</span>
          <span className="text-stone-700">{artist.name}</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left: Main info */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-stone-900">{artist.name}</h1>
                <p className="mt-2 text-lg text-stone-500">
                  {artist.medium} · {artist.location}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold uppercase tracking-wide ${getMomentumColor(artist.momentum)}`}
              >
                {getMomentumIcon(artist.momentum)} {artist.momentum}
              </span>
            </div>

            {/* Momentum bar */}
            <div className="mt-8 rounded-xl border border-stone-200 bg-white p-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500">Momentum Score</span>
                <span className="text-2xl font-bold text-stone-900">
                  {artist.momentumScore}
                  <span className="text-sm text-stone-400">/100</span>
                </span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-stone-100">
                <div
                  className="h-2 rounded-full bg-stone-900 transition-all"
                  style={{ width: `${artist.momentumScore}%` }}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-stone-900">About</h2>
              <p className="mt-3 text-stone-500 leading-relaxed">{artist.bio}</p>
            </div>

            {/* Highlights */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-stone-900">Career Highlights</h2>
              <ul className="mt-3 space-y-2">
                {artist.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-stone-500">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-700" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent drops */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-stone-900">Recent Drops</h2>
              <div className="mt-4 space-y-3">
                {artist.recentDrops.map((drop) => (
                  <div
                    key={drop.title}
                    className="flex items-center justify-between rounded-lg border border-stone-200 bg-white px-5 py-4"
                  >
                    <div>
                      <p className="font-medium text-stone-900">{drop.title}</p>
                      <p className="text-sm text-stone-400">{drop.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-stone-700">
                        {drop.price}
                      </p>
                      {drop.soldOut ? (
                        <span className="text-xs font-semibold text-red-700">
                          SOLD OUT
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-green-700">
                          AVAILABLE
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Price range */}
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <p className="text-sm text-stone-400">Price Range</p>
              <p className="mt-1 text-2xl font-bold text-stone-900">{artist.priceRange}</p>
            </div>

            {/* Galleries */}
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <p className="text-sm text-stone-400">Gallery Representation</p>
              <div className="mt-3 space-y-2">
                {artist.galleries.map((g) => (
                  <div
                    key={g}
                    className="rounded-lg bg-stone-50 px-4 py-2.5 text-sm font-medium text-stone-700"
                  >
                    {g}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <p className="text-sm text-stone-400">Tags</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {artist.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/#waitlist"
              className="block w-full rounded-xl bg-stone-900 p-4 text-center font-semibold text-white shadow-md transition hover:bg-stone-800 hover:shadow-lg"
            >
              Get Alerts for {artist.name.split(" ")[0]}
            </Link>
          </div>
        </div>

        {/* Similar artists */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-stone-900">Similar Artists</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {similar.map((a) => (
              <Link
                key={a.slug}
                href={`/artists/${a.slug}`}
                className="group rounded-xl border border-stone-200 bg-white p-5 transition hover:border-stone-300 hover:shadow-md"
              >
                <div
                  className={`mb-4 h-28 rounded-lg bg-gradient-to-br ${a.imageColor} opacity-70 transition group-hover:opacity-90`}
                />
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-stone-900 group-hover:text-red-700 transition">
                    {a.name}
                  </h3>
                  <span className="text-sm font-bold text-stone-400">
                    {a.momentumScore}
                  </span>
                </div>
                <p className="mt-1 text-sm text-stone-400">
                  {a.medium} · {a.priceRange}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
