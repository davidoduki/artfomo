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
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold text-white">
            Art<span className="text-purple-400">FOMO</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/artists"
              className="text-sm font-medium text-zinc-400 hover:text-white transition"
            >
              Directory
            </Link>
            <Link
              href="/#waitlist"
              className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            >
              Get Early Access
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero banner */}
      <div className="relative pt-16">
        <div
          className={`h-64 bg-gradient-to-br ${artist.imageColor} opacity-40`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative -mt-32 mx-auto max-w-5xl px-6 pb-24">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/artists" className="hover:text-white transition">
            Directory
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{artist.name}</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left: Main info */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold">{artist.name}</h1>
                <p className="mt-2 text-lg text-zinc-400">
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
            <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Momentum Score</span>
                <span className="text-2xl font-bold text-white">
                  {artist.momentumScore}
                  <span className="text-sm text-zinc-500">/100</span>
                </span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-rose-500 transition-all"
                  style={{ width: `${artist.momentumScore}%` }}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="mt-3 text-zinc-400 leading-relaxed">{artist.bio}</p>
            </div>

            {/* Highlights */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold">Career Highlights</h2>
              <ul className="mt-3 space-y-2">
                {artist.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-zinc-400">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent drops */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold">Recent Drops</h2>
              <div className="mt-4 space-y-3">
                {artist.recentDrops.map((drop) => (
                  <div
                    key={drop.title}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-5 py-4"
                  >
                    <div>
                      <p className="font-medium text-white">{drop.title}</p>
                      <p className="text-sm text-zinc-500">{drop.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-zinc-300">
                        {drop.price}
                      </p>
                      {drop.soldOut ? (
                        <span className="text-xs font-semibold text-rose-400">
                          SOLD OUT
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-green-400">
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
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-500">Price Range</p>
              <p className="mt-1 text-2xl font-bold">{artist.priceRange}</p>
            </div>

            {/* Galleries */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-500">Gallery Representation</p>
              <div className="mt-3 space-y-2">
                {artist.galleries.map((g) => (
                  <div
                    key={g}
                    className="rounded-lg bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-300"
                  >
                    {g}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-500">Tags</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {artist.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/#waitlist"
              className="block w-full rounded-xl bg-gradient-to-r from-purple-600 to-rose-500 p-4 text-center font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:shadow-purple-500/40 hover:scale-[1.01]"
            >
              Get Alerts for {artist.name.split(" ")[0]}
            </Link>
          </div>
        </div>

        {/* Similar artists */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold">Similar Artists</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {similar.map((a) => (
              <Link
                key={a.slug}
                href={`/artists/${a.slug}`}
                className="group rounded-xl border border-white/10 bg-white/[.03] p-5 transition hover:border-purple-500/30 hover:bg-white/[.06]"
              >
                <div
                  className={`mb-4 h-28 rounded-lg bg-gradient-to-br ${a.imageColor} opacity-50 transition group-hover:opacity-70`}
                />
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold group-hover:text-purple-300 transition">
                    {a.name}
                  </h3>
                  <span className="text-sm font-bold text-zinc-500">
                    {a.momentumScore}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-500">
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
