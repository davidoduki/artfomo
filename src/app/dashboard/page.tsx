import Link from "next/link";
import { getProfile } from "@/lib/auth";
import { artists } from "@/data/artists";

export default async function DashboardPage() {
  const profile = await getProfile();

  const breakoutCount = artists.filter((a) => a.momentum === "breakout").length;
  const risingCount = artists.filter((a) => a.momentum === "rising").length;
  const totalDrops = artists.reduce((sum, a) => sum + a.recentDrops.length, 0);
  const soldOutDrops = artists.reduce(
    (sum, a) => sum + a.recentDrops.filter((d) => d.soldOut).length,
    0
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">
          Welcome back, {profile?.full_name?.split(" ")[0] || "Collector"}
        </h1>
        <p className="mt-1 text-stone-500">
          Here&apos;s what&apos;s happening in the art market today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="text-sm text-stone-400">Tracked Artists</p>
          <p className="mt-2 text-3xl font-bold text-stone-900">{artists.length}</p>
          <p className="mt-1 text-sm text-green-700">+2 this week</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="text-sm text-stone-400">Breakout Artists</p>
          <p className="mt-2 text-3xl font-bold text-red-700">{breakoutCount}</p>
          <p className="mt-1 text-sm text-stone-400">Momentum &gt; 90</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="text-sm text-stone-400">Rising Artists</p>
          <p className="mt-2 text-3xl font-bold text-amber-700">{risingCount}</p>
          <p className="mt-1 text-sm text-stone-400">Momentum 70-89</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="text-sm text-stone-400">Drops Sold Out</p>
          <p className="mt-2 text-3xl font-bold text-stone-900">
            {soldOutDrops}/{totalDrops}
          </p>
          <p className="mt-1 text-sm text-stone-400">
            {Math.round((soldOutDrops / totalDrops) * 100)}% sell-through
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/dashboard/watchlist"
          className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
            <svg className="h-5 w-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-stone-900">My Watchlist</p>
            <p className="text-sm text-stone-400">Track your favorite artists</p>
          </div>
        </Link>

        <Link
          href="/dashboard/saved"
          className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
            <svg className="h-5 w-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-stone-900">Saved Artists</p>
            <p className="text-sm text-stone-400">Artists you&apos;ve bookmarked</p>
          </div>
        </Link>

        <Link
          href="/artists"
          className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
            <svg className="h-5 w-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-stone-900">Browse Directory</p>
            <p className="text-sm text-stone-400">Discover trending artists</p>
          </div>
        </Link>
      </div>

      {/* Hot artists */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-stone-900">Hot Right Now</h2>
        <div className="mt-4 space-y-3">
          {artists
            .filter((a) => a.momentum === "breakout")
            .map((artist) => (
              <Link
                key={artist.slug}
                href={`/artists/${artist.slug}`}
                className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-6 py-4 transition hover:border-stone-300 hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 overflow-hidden rounded-lg">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">{artist.name}</p>
                    <p className="text-sm text-stone-400">
                      {artist.medium} &middot; {artist.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-700">
                    {artist.momentumScore}
                  </p>
                  <p className="text-xs text-stone-400">momentum</p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
